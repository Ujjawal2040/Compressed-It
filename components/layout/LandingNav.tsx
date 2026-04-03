"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors" />
            <div className="w-10 h-10 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center relative z-10 transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-wide relative z-10">CompressIt</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">How It Works</Link>
            <Link href="/#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
            <Link href="/#faq" className="text-sm font-medium text-white/70 hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Support & Contact</Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">Sign In</Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden animate-fade-in" onClick={closeMenu}>
          {/* Sidebar */}
          <div 
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-[#0A0B0F] border-l border-primary/20 p-6 flex flex-col shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10">
              <span className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Menu
              </span>
              <button className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full" onClick={closeMenu}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <Link href="/" onClick={closeMenu} className="text-lg font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20" /> Home
              </Link>
              <Link href="/#how-it-works" onClick={closeMenu} className="text-lg font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20" /> How It Works
              </Link>
              <Link href="/#features" onClick={closeMenu} className="text-lg font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20" /> Features
              </Link>
              <Link href="/#faq" onClick={closeMenu} className="text-lg font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20" /> FAQ
              </Link>
              <Link href="/contact" onClick={closeMenu} className="text-lg font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/20" /> Contact & Support
              </Link>
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6">
              <Link href="/login" onClick={closeMenu} className="w-full">
                <Button variant="outline" className="w-full h-12">Sign In</Button>
              </Link>
              <Link href="/signup" onClick={closeMenu} className="w-full">
                <Button className="w-full h-12">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
