import React from "react";

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-300 relative shadow-[0_0_10px_rgba(0,229,255,0.5)]" 
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/20 blur-[2px]" />
      </div>
    </div>
  );
}
