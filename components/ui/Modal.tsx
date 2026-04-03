"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  children?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  isConfirmLoading?: boolean;
  isDanger?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  children,
  confirmText = "Confirm",
  onConfirm,
  isConfirmLoading,
  isDanger = false
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-[#13151c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-heading font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {message && <p className="text-white/70 text-sm mb-6">{message}</p>}
          {children}
        </div>
        
        {onConfirm && (
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <Button variant="ghost" onClick={onClose} disabled={isConfirmLoading}>
              Cancel
            </Button>
            <Button 
              variant={isDanger ? "danger" : "primary"} 
              onClick={onConfirm}
              isLoading={isConfirmLoading}
            >
              {confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
