"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFileJob } from "@/hooks/useFileJob";
import { DropZone } from "@/components/ui/DropZone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { pdfToImages } from "@/lib/fileProcessing";
import { formatBytes } from "@/lib/formatters";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { FileUp, FileCheck, Download } from "lucide-react";

export default function PdfToJpgPage() {
  const { user } = useAuth();
  const { createJob, updateJob } = useFileJob();
  
  const [file, setFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [dpi, setDpi] = useState<number>(150);
  const [progress, setProgress] = useState(0);

  const handleProcess = async () => {
    if (!file || !user) return;
    setStatus('processing');
    setProgress(0);
    setZipFile(null);
    
    // Create DB Record
    const job = await createJob({
      original_filename: file.name,
      original_size: file.size,
      output_size: null,
      file_type: 'pdf',
      job_type: 'pdf_to_jpg',
      output_url: null,
      status: 'processing'
    });

    try {
      const output = await pdfToImages(file, dpi, (p) => setProgress(p));
      setZipFile(output);
      
      // Upload to Supabase Storage
      const filePath = `${user.id}/${job?.id || Date.now()}/${output.name}`;
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
      toast.success("PDF converted to images successfully!");
    } catch (err) {
      console.error(err);
      setStatus('error');
      if (job) await updateJob(job.id, { status: 'error' });
      toast.error(err instanceof Error ? err.message : "Failed to convert PDF");
    }
  };

  const handleDownload = () => {
    if (!zipFile) return;
    const url = URL.createObjectURL(zipFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white">Convert PDF to JPG</h2>
        <p className="text-white/60 mt-2">Extract all PDF pages into a zipped archive of high-quality images.</p>
      </div>

      {!file && (
        <DropZone 
          onFileDrop={setFile} 
          accept="application/pdf"
          label="Drop your PDF here"
        />
      )}

      {file && status === 'idle' && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                <FileUp className="text-red-400" />
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
              <label className="text-sm font-medium text-white/80 block mb-3">
                Image Quality (DPI)
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[72, 150, 300].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDpi(d)}
                    className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                      dpi === d 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-surface border-white/10 text-white hover:bg-white/5"
                    }`}
                  >
                    {d} DPI
                    <span className="block text-[10px] opacity-70 mt-1">
                      {d === 72 ? "Low" : d === 150 ? "Medium" : "High"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg" 
              onClick={handleProcess}
            >
              Convert to JPG
            </Button>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <h3 className="text-xl font-heading font-bold text-white mb-6">Converting Pages...</h3>
          <div className="w-full max-w-md mx-auto mb-2">
            <ProgressBar progress={progress} />
          </div>
          <p className="text-white/60 text-sm">{progress}% complete</p>
        </div>
      )}

      {status === 'done' && zipFile && (
        <div className="glass-card p-8 animate-scale-up">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white text-center mb-2">Conversion Complete!</h3>
          <p className="text-white/60 text-center text-sm mb-8">File saved as {zipFile.name} ({formatBytes(zipFile.size)})</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14" 
              onClick={() => {
                setFile(null);
                setZipFile(null);
                setStatus('idle');
              }}
            >
              Convert Another
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
