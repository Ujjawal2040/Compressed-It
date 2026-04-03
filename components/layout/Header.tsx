"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const router = useRouter();

  const getPageTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("compress")) return "Compress File";
    if (pathname.includes("pdf-to-jpg")) return "PDF to JPG";
    if (pathname.includes("jpg-to-pdf")) return "JPG to PDF";
    if (pathname.includes("history")) return "History";
    if (pathname.includes("settings")) return "Settings";
    return "";
  };

  const isDashboard = pathname === "/dashboard";

  return (
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 bg-background/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-3">
        {/* Back Button for mobile view when inside inner pages */}
        {!isDashboard && (
          <button 
            onClick={() => router.back()} 
            className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-heading font-medium text-white">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Home Button (to Landing Page) */}
        <Link 
          href="/" 
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2"
          title="Home Page"
        >
          <Home className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:block text-xs font-bold uppercase tracking-wider">Home</span>
        </Link>
        
        {/* Mobile Sign Out Button */}
        <button 
          onClick={signOut}
          className="md:hidden p-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm ml-1 hidden md:flex">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
