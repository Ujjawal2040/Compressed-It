"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { Zap, ArrowRight, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { LandingNav } from "@/components/layout/LandingNav";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };
  
  const strength = getPasswordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
        if (data.session) {
          router.push("/dashboard");
        } else {
          toast("Check your email to confirm your account.", { 
            icon: "✉️",
            duration: 6000
          });
          router.push("/login");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error("Failed to connect to Google.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#09090b] selection:bg-primary/30">
      <LandingNav />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10s]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 group mt-12">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        
        <div className="glass-card p-10 rounded-[2rem] border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-2xl relative shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-4xl font-heading font-extrabold text-white tracking-tight">Join CompressIt</h2>
            <p className="text-white/50 text-sm mt-3 font-light text-center max-w-[280px]">
              The elite platform for lightening-fast file optimization.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input 
                className="pl-12 !bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl h-12"
                label="" 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
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
              
              {/* Premium Strength meter */}
              <div className="flex gap-1.5 h-1 w-full px-1">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`h-full flex-1 rounded-full transition-all duration-500 ${
                      strength >= level * 25 
                        ? (strength === 100 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : strength >= 50 ? "bg-amber-400" : "bg-rose-500")
                        : "bg-white/5"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input 
                className="pl-12 !bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl h-12"
                label="" 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
                type="submit" 
                className="w-full h-14 mt-6 text-lg font-bold group shadow-lg shadow-primary/20" 
                isLoading={loading}
            >
              Initialize Account
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 py-2">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Standard Connect</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 border-white/5 hover:bg-white/5 hover:border-white/10 text-white/70 font-medium transition-all"
            onClick={handleGoogleSignup}
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
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-bold underline underline-offset-4 decoration-primary/30">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
