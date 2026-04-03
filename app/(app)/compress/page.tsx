"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFileJob } from "@/hooks/useFileJob";
import { DropZone } from "@/components/ui/DropZone";
import { Button } from "@/components/ui/Button";
import { compressImage, compressPDF } from "@/lib/fileProcessing";
import { formatBytes } from "@/lib/formatters";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { FileUp, FileCheck, ArrowRight, Download } from "lucide-react";

export default function CompressPage() {
  const { user } = useAuth();
  const { createJob, updateJob } = useFileJob();
  
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [quality, setQuality] = useState(70);
  const [targetSize, setTargetSize] = useState<string>('');
  const [sizeUnit, setSizeUnit] = useState<'KB' | 'MB'>('KB');
  const [outputFormat, setOutputFormat] = useState<string>('auto');

  const handleProcess = async () => {
    if (!file || !user) return;
    setStatus('processing');
    setCompressedFile(null);
    
    // Detect type
    const isPDF = file.type.includes('pdf');
    const isImage = file.type.includes('image');
    const fileType = isPDF ? 'pdf' : (file.type.includes('png') ? 'png' : 'jpg');
    
    // Create DB Record
    const job = await createJob({
      original_filename: file.name,
      original_size: file.size,
      output_size: null,
      file_type: fileType,
      job_type: 'compress',
      output_url: null,
      status: 'processing'
    });

    try {
      let output: File;
      let sizeMB = targetSize ? parseFloat(targetSize) : undefined;
      if (sizeMB && sizeUnit === 'KB') sizeMB = sizeMB / 1024;

      if (isImage) {
        const fmt = outputFormat !== 'auto' ? outputFormat : undefined;
        output = await compressImage(file, quality / 100, sizeMB, fmt);
      } else if (isPDF) {
        output = await compressPDF(file, quality / 100, sizeMB);
      } else {
        throw new Error("Unsupported file type");
      }
      
      if (output.size >= file.size) {
        output = file;
        toast("File is already optimally compressed. No further reduction possible!", { icon: "ℹ️", duration: 5000 });
      }
      
      setCompressedFile(output);
      
      // Upload to Supabase Storage - clean file name to avoid Invalid Key 400 errors (e.g. replacing brackets)
      const sanitizedName = output.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filePath = `${user.id}/${job?.id || Date.now()}/${sanitizedName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('output-files')
        .upload(filePath, output);
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage.from('output-files').getPublicUrl(filePath);

      // Update DB record
      if (job) {
        await updateJob(job.id, {
          output_size: output.size,
          output_url: publicUrlData.publicUrl,
          status: 'done'
        });
      }
      
      setStatus('done');
      toast.success("File compressed successfully!");
    } catch (err) {
      console.error(err);
      setStatus('error');
      if (job) await updateJob(job.id, { status: 'error' });
      toast.error(err instanceof Error ? err.message : "Failed to compress file");
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const calculateSavings = () => {
    if (!file || !compressedFile) return 0;
    const savings = ((file.size - compressedFile.size) / file.size) * 100;
    return savings > 0 ? savings.toFixed(1) : 0;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white">Compress File</h2>
        <p className="text-white/60 mt-2">Shrink image and PDF sizes without losing quality.</p>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <label className="text-sm font-medium text-white/80 block mb-2">
            Target Image Size (Optional)
          </label>
          <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <input 
              type="number"
              min="0"
              step="any"
              value={targetSize}
              onChange={(e) => setTargetSize(e.target.value)}
              placeholder="Target Size (e.g., 500)"
              className="bg-transparent text-white px-4 py-2 w-full outline-none min-w-0"
            />
            <select 
              value={sizeUnit}
              onChange={(e) => setSizeUnit(e.target.value as 'KB' | 'MB')}
              className="bg-neutral-800 text-white px-3 py-2 border-l border-white/10 outline-none"
            >
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-white/80 block mb-2">
            Image Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-neutral-800 text-white px-4 py-2 border text-sm border-white/10 rounded-lg w-full outline-none h-[42px]"
            disabled={file?.type.includes('pdf')}
          >
            <option value="auto">Auto (Keep Original)</option>
            <option value="image/jpeg">JPEG / JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
      </div>

      {!file && (
        <DropZone 
          onFileDrop={setFile} 
          accept="image/jpeg,image/png,application/pdf"
          label="Drop your image or PDF here"
        />
      )}

      {file && status === 'idle' && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                {file.type.includes('pdf') ? <FileUp className="text-red-400" /> : <FileUp className="text-blue-400" />}
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs text-sm">{file.name}</p>
                <p className="text-white/50 text-xs">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="text-white/50 hover:text-white text-sm"
            >
              Change file
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80 block mb-3 flex justify-between">
                <span>Compression Level</span>
                <span className="text-primary">{quality}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-white/40 mt-2">
                Lower quality means smaller file size but visually degraded (For PDFs, it rasterizes texts).
              </p>
            </div>

            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleProcess}
            >
              Compress Now
            </Button>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-heading font-bold text-white mb-2">Compressing your file...</h3>
          <p className="text-white/60 text-sm">Please wait, processing entirely in your browser.</p>
        </div>
      )}

      {status === 'done' && compressedFile && (
        <div className="glass-card p-8 animate-scale-up">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white text-center mb-8">Compression Complete!</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
            <div className="text-center flex-1">
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Original Size</p>
              <p className="text-2xl font-bold text-white">{formatBytes(file!.size)}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRight className="text-white/20 hidden sm:block w-8 h-8" />
              <div className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold mt-2">
                -{calculateSavings()}% 
              </div>
            </div>

            <div className="text-center flex-1">
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">New Size</p>
              <p className="text-2xl font-bold text-primary">{formatBytes(compressedFile.size)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14" 
              onClick={() => {
                setFile(null);
                setCompressedFile(null);
                setStatus('idle');
              }}
            >
              Compress Another
            </Button>
            <Button 
              className="flex-1 h-14 gap-2" 
              onClick={handleDownload}
            >
              <Download className="w-5 h-5" /> Download File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
