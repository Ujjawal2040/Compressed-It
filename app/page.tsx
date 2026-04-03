import React from "react";
import Link from "next/link";
import { Zap, Shield, FileDown, Lock, FastForward, CheckCircle2, Layers, Image as ImageIcon, Sparkles, ChevronDown } from "lucide-react";
import { LandingNav } from "@/components/layout/LandingNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] selection:bg-primary/30 overflow-hidden text-white w-full font-body">
      
      <LandingNav />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-20 brightness-100 contrast-150 mix-blend-overlay" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"}}></div>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col items-center pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="w-full max-w-7xl px-4 sm:px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-sm backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide">Next-Gen File Supercharger</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1] sm:leading-tight">
            Shrink Files. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary break-words">
              Expand Possibilities.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/60 font-body max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed px-2">
            The enterprise-grade platform for lightning-fast compression and format conversion. 
            No middleman servers—processed 100% securely inside your browser.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <Link 
              href="/login"
              className="px-8 py-4 rounded-full bg-primary text-background font-bold text-lg hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-all duration-300 w-full sm:w-auto"
            >
              Start Optimizing For Free
            </Link>
            <Link 
              href="#how-it-works"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              See How It Works
            </Link>
          </div>
          
          {/* Mock Real App UI Display */}
          <div className="mt-24 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
            <div className="rounded-xl overflow-hidden bg-[#111] border border-white/5 flex flex-col aspect-video relative">
              {/* Fake App Header */}
              <div className="h-12 border-b border-white/10 bg-black/40 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="mx-auto px-12 py-1.5 rounded-md bg-white/5 text-xs text-white/40 border border-white/5">app.compressedit.com</div>
              </div>
              {/* Fake App Body */}
              <div className="flex-1 p-4 sm:p-8 flex flex-col md:flex-row gap-4 sm:gap-6 bg-gradient-to-br from-[#121215] to-[#0a0a0c]">
                 <div className="flex-1 border border-white/10 border-dashed rounded-xl flex flex-col items-center justify-center py-6 sm:py-0 bg-white/[0.02] text-white/40 gap-4">
                    <FileDown className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                    <p className="font-medium text-sm sm:text-lg text-white/80 text-center px-2">Masterpiece.pdf</p>
                    <p className="text-xs sm:text-sm">45 MB</p>
                 </div>
                 <div className="h-8 md:w-16 flex items-center justify-center md:flex hidden">
                    <FastForward className="w-6 h-6 sm:w-8 sm:h-8 text-white/20 animate-pulse rotate-90 md:rotate-0" />
                 </div>
                 <div className="flex-1 border border-primary/30 rounded-xl flex flex-col items-center justify-center py-6 sm:py-0 bg-primary/5 text-white/40 gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 sm:p-3">
                      <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 text-[10px] sm:text-xs font-bold rounded-full border border-green-500/30">-85%</span>
                    </div>
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                    <p className="font-medium text-sm sm:text-lg text-white/80 text-center px-2">Masterpiece_compressed.pdf</p>
                    <p className="text-xs sm:text-sm text-primary">4.5 MB</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- STATS STRIP --- */}
        <section className="w-full border-y border-white/5 bg-white/[0.02] py-8 md:py-12 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 divide-x-0 md:divide-x divide-white/5">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-2">100%</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-white/50 uppercase tracking-widest font-semibold">Local Processing</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-2">90%</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-white/50 uppercase tracking-widest font-semibold">Max Compression</span>
            </div>
            <div className="flex w-full h-px bg-white/5 col-span-2 md:hidden"></div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-2">0s</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-white/50 uppercase tracking-widest font-semibold">Upload Wait Time</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-2">∞</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-white/50 uppercase tracking-widest font-semibold">Files Supported</span>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32" id="features">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Built for Professionals</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
              Stop waiting on cloud uploads. Our WebAssembly core executes heavy compression directly on your machine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureBlock 
              icon={<Shield className="text-emerald-400" />}
              title="Military-Grade Privacy"
              desc="Files never leave your device. All computations happen in your browser's private memory sandbox."
            />
            <FeatureBlock 
              icon={<Zap className="text-primary" />}
              title="Ludicrous Speed"
              desc="Powered by multi-threaded Web Workers. We utilize your CPU cores to crunch gigabytes in seconds."
            />
            <FeatureBlock 
              icon={<ImageIcon className="text-blue-400" />}
              title="Smart Format AI"
              desc="Dynamically determines the absolute best image or document format to maximize your byte savings."
            />
            <FeatureBlock 
              icon={<Layers className="text-purple-400" />}
              title="Bulk Processing"
              desc="Drag in hundreds of images at once and watch our queue orchestrator handle them concurrently."
            />
            <FeatureBlock 
              icon={<FileDown className="text-orange-400" />}
              title="Lossless PDFs"
              desc="Deep text rasterization and redundant object streaming strip fat from PDFs without degrading readability."
            />
            <FeatureBlock 
              icon={<Lock className="text-rose-400" />}
              title="Secure Cloud Vault"
              desc="Optionally save compressed files to your private remote Vault powered by Supabase architecture."
            />
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20" id="how-it-works">
          <div className="glass-card p-8 sm:p-12 lg:p-20 rounded-[2rem] sm:rounded-[3rem] text-center bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-10 sm:mb-16 relative z-10">How It Works</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12 relative z-10">
              <Step number="1" title="Select Files" desc="Drag & drop your heavy PDFs, PNGs, JPEGs, or WebP files." />
              <Step number="2" title="Define Target" desc="Optionally dial in exact parameters like 500KB target size." />
              <Step number="3" title="Insta-Download" desc="Boom. It's done locally before you can blink. Download immediately." />
            </div>
            
            <Link 
              href="/signup"
              className="mt-12 sm:mt-16 inline-flex flex-col sm:flex-row items-center gap-2 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-white text-black font-bold text-base sm:text-lg hover:scale-105 transition-transform duration-300 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span>Create Free Account</span> <FastForward className="w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-0" />
            </Link>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="w-full max-w-4xl mx-auto px-6 py-20" id="faq">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-white/50 font-light">
              Everything you need to know about how we manage and compress your data.
            </p>
          </div>
          <div className="space-y-4">
            <FaqItem 
              q="Are my files uploaded to your servers?" 
              a="No! That's the magic of CompressIt. All file compression algorithms execute locally within your Chrome, Safari, or Edge browser's memory using WebAssembly. Your sensitive documents never leave your machine unless you explicitly save them to our secure cloud."
            />
            <FaqItem 
              q="Is there a limit on file size?" 
              a="Since we run entirely inside your browser, the only limit is your device's RAM. Most modern laptops and phones can comfortably compress 100MB+ image and PDF payloads in seconds."
            />
            <FaqItem 
              q="How does PDF compression actually work here?" 
              a="We do true compression. Our engine opens the PDF, selectively filters out unused streams, and rasterizes bulky HD images down to an exact JPEG quality ratio you define on the slider before repacking it into a lossless, vastly smaller PDF container."
            />
            <FaqItem 
              q="Is this service actually free?" 
              a="Yes, the core compression engine is 100% free with no hidden watermarks. We believe strong utility should be accessible to everyone."
            />
          </div>
        </section>

      </div>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/10 bg-black relative z-20 overflow-hidden mt-auto">
        <div className="absolute left-1/2 -bottom-[50px] -translate-x-1/2 w-[300px] h-[100px] bg-primary/30 blur-[80px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6 opacity-80">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-heading font-bold tracking-widest text-white">CompressIt</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm font-medium text-white/40">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
            <Link href="/features" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <p className="text-white/60 font-medium">
             Made with ❤️ by <span className="text-white font-bold tracking-wide">Adarsh</span> and <span className="text-white font-bold tracking-wide">Ujjwal</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureBlock({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-8 rounded-3xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.04] transition-colors duration-500 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300 shadow-inner">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7 ' + (icon as React.ReactElement).props.className })}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{title}</h3>
      <p className="text-white/50 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/20 text-primary border-2 border-primary/50 flex items-center justify-center text-2xl font-bold mb-6">
        {number}
      </div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-white/50 leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  // A simple accordion without needing heavily managed state for this static page
  return (
    <details className="group glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
      <summary className="px-8 py-6 font-medium text-lg cursor-pointer list-none flex items-center justify-between text-white/90">
        {q}
        <span className="transition group-open:rotate-180 text-white/40 group-hover:text-primary">
          <ChevronDown className="w-5 h-5" />
        </span>
      </summary>
      <div className="px-8 pb-6 text-white/50 font-light leading-relaxed animate-slide-up border-t border-white/5 pt-4 mt-2 mx-4">
        {a}
      </div>
    </details>
  );
}
