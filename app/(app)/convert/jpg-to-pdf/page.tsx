"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFileJob } from "@/hooks/useFileJob";
import { DropZone } from "@/components/ui/DropZone";
import { Button } from "@/components/ui/Button";
import { SortableThumbnailGrid } from "@/components/ui/SortableThumbnailGrid";
import { imagesToPDF } from "@/lib/fileProcessing";
import { formatBytes } from "@/lib/formatters";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { FileCheck, Download } from "lucide-react";

export default function JpgToPdfPage() {
  const { user } = useAuth();
  const { createJob, updateJob } = useFileJob();
  
  const [files, setFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');

  const handleFilesAdded = (file: File) => {
    if (files.length >= 20) {
      toast.error("You can only upload up to 20 images at once.");
      return;
    }
    setFiles(prev => [...prev, file]);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 20) {
        toast.error("You can only upload up to 20 images at once.");
        return;
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0 || !user) return;
    setStatus('processing');
    setPdfFile(null);
    
    const combinedSize = files.reduce((acc, f) => acc + f.size, 0);

    // Create DB Record
    const job = await createJob({
      original_filename: `merged_${files.length}_images`,
      original_size: combinedSize,
      output_size: null,
      file_type: 'jpg',
      job_type: 'jpg_to_pdf',
      output_url: null,
      status: 'processing'
    });

    try {
      const output = await imagesToPDF(files, pageSize);
      setPdfFile(output);
      
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
      toast.success("Images merged into PDF successfully!");
    } catch (err) {
      console.error(err);
      setStatus('error');
      if (job) await updateJob(job.id, { status: 'error' });
      toast.error(err instanceof Error ? err.message : "Failed to merge images");
    }
  };

  const handleDownload = () => {
    if (!pdfFile) return;
    const url = URL.createObjectURL(pdfFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white">Merge Images to PDF</h2>
        <p className="text-white/60 mt-2">Combine multiple JPG/PNG images into a single PDF document. Drag to reorder.</p>
      </div>

      {status === 'idle' && (
        <div className="space-y-6">
          <div className="glass-card p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 pb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Images ({files.length}/20)</h3>
                <p className="text-white/50 text-sm mt-1">Drag thumbnails to reorder pages.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative overflow-hidden inline-block w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Add More</Button>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/png"
                    onChange={handleMultipleFilesChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {files.length > 0 && (
                  <Button variant="ghost" onClick={() => setFiles([])} className="text-red-400 hover:text-red-300">
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {files.length === 0 ? (
              <DropZone 
                onFileDrop={(f) => handleFilesAdded(f)} 
                accept="image/jpeg,image/png"
                label="Drop your images here"
              />
            ) : (
              <SortableThumbnailGrid 
                files={files} 
                onReorder={setFiles}
                onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
              />
            )}
          </div>

          {files.length > 0 && (
            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div>
                <label className="text-sm font-medium text-white/80 block mb-3">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['A4', 'Letter', 'Fit'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPageSize(s)}
                      className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                        pageSize === s 
                          ? "bg-primary/20 border-primary text-primary" 
                          : "bg-surface border-white/10 text-white hover:bg-white/5"
                      }`}
                    >
                      {s}
                      <span className="block text-[10px] opacity-70 mt-1">
                        {s === 'A4' ? "Standard" : s === 'Letter' ? "US Letter" : "Fit to Image"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full h-14 text-lg" 
                onClick={handleProcess}
              >
                Build PDF
              </Button>
            </div>
          )}
        </div>
      )}

      {status === 'processing' && (
        <div className="glass-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-6" />
          <h3 className="text-xl font-heading font-bold text-white mb-2">Building PDF...</h3>
          <p className="text-white/60 text-sm">Processing {files.length} images into a single document.</p>
        </div>
      )}

      {status === 'done' && pdfFile && (
        <div className="glass-card p-8 animate-scale-up">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileCheck className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-white text-center mb-2">PDF Generated successfully!</h3>
          <p className="text-white/60 text-center text-sm mb-8">Generated file: {pdfFile.name} ({formatBytes(pdfFile.size)})</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14" 
              onClick={() => {
                setFiles([]);
                setPdfFile(null);
                setStatus('idle');
              }}
            >
              Start New Merge
            </Button>
            <Button 
              className="flex-1 h-14 gap-2" 
              onClick={handleDownload}
            >
              <Download className="w-5 h-5" /> Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
