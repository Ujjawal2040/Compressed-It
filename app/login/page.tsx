"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Zap, ArrowRight, Mail, Lock, LogIn } from "lucide-react";
import { LandingNav } from "@/components/layout/LandingNav";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Internal login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#09090b] selection:bg-primary/30">
      <LandingNav />
      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-[2.5rem] blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000" />
        
        <div className="glass-card w-full p-10 rounded-[2rem] border border-white/10 bg-[#0c0c0e]/90 backdrop-blur-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-[inset_0_0_15px_rgba(0,229,255,0.1)]">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-heading font-extrabold text-white tracking-tight">Welcome back</h2>
            <p className="text-white/50 text-sm mt-3 font-light">Secure access to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input 
                  className="pl-12 !bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl h-12"
                  label="" 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input 
                    className="pl-12 !bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl h-12"
                    label="" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end px-1">
                  <Link href="/forgot-password" virtual-link="true" className="text-xs text-primary/70 hover:text-primary transition-colors font-medium">
                    Lost password?
                  </Link>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-14 mt-4 text-lg font-bold group shadow-lg shadow-primary/10" isLoading={loading}>
              Sign In
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 py-2">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Secure Gateway</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 border-white/5 hover:bg-white/5 hover:border-white/10 text-white/70 font-medium transition-all"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-white/40 mt-10">
            New to CompressIt?{" "}
            <Link href="/signup" className="text-primary hover:text-primary-light transition-colors font-bold underline underline-offset-4 decoration-primary/30">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
