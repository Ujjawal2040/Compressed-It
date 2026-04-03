"use client";

import { useState } from "react";
import { LandingNav } from "@/components/layout/LandingNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll right get back to you.", { icon: "🚀" });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white overflow-hidden py-32 relative">
      <LandingNav />

      {/* Background Decor */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-1 max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-heading font-bold text-white mb-6">Let's Connect</h1>
          <p className="text-lg text-white/60 font-body">
            Have questions about enterprise deployment, need custom API access, or just want to report a bug? We are here to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-5xl">
          {/* Contact Info Column */}
          <div className="flex-1 space-y-8 lg:pr-12">
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Email Us</h3>
                <p className="text-white/50 text-sm mb-2">For general queries and enterprise support.</p>
                <a href="mailto:support@compressedit.com" className="text-primary hover:underline font-medium">support@compressedit.com</a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Live Chat</h3>
                <p className="text-white/50 text-sm mb-2">Available 9am - 5pm EST for immediate assistance.</p>
                <button className="text-blue-400 hover:underline font-medium">Start a conversation</button>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Call Us</h3>
                <p className="text-white/50 text-sm mb-2">For urgent enterprise outages.</p>
                <p className="text-green-400 font-medium">+1 (555) 019-2831</p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="flex-[1.5]">
            <form onSubmit={handleSubmit} className="glass-card p-8 sm:p-10 rounded-3xl h-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              
              <Input label="Work Email" type="email" placeholder="john@company.com" required />
              
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-sm font-medium text-white/80">How can we help?</label>
                <textarea 
                  required
                  placeholder="Describe your issue or inquiry..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[150px] resize-y flex-1"
                ></textarea>
              </div>

              <Button type="submit" className="w-full py-4 text-lg mt-4 gap-2" isLoading={loading}>
                <Send className="w-5 h-5" /> Send Message
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
