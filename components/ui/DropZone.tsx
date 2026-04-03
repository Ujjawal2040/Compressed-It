"use client";

import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export function DropZone({ onFileDrop, accept, maxSizeMB = 50, label = "Drag & drop your file here" }: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        // Validation size
        const file = e.dataTransfer.files[0];
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File too large. Max size is ${maxSizeMB}MB.`);
          return;
        }
        onFileDrop(file);
      }
    },
    [onFileDrop, maxSizeMB]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      onFileDrop(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`glass-card relative overflow-hidden flex flex-col items-center justify-center p-12 text-center border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,229,255,0.2)]"
          : "border-white/20 hover:border-white/40 hover:bg-white/[0.02]"
      }`}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={handleChange}
      />
      <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? "text-primary" : "text-white/50"}`} />
      <h3 className="text-xl font-medium text-white mb-2">{label}</h3>
      <p className="text-sm text-white/40">
        Accepts {accept || "multiple formats"} up to {maxSizeMB}MB
      </p>
    </div>
  );
}
