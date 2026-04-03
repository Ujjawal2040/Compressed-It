"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, FileDown, FileImage, Image as ImageIcon, History, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NEXT_ROUTES = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Compress File", href: "/compress", icon: <FileDown className="w-5 h-5" /> },
  { name: "PDF to JPG", href: "/convert/pdf-to-jpg", icon: <FileImage className="w-5 h-5" /> },
  { name: "JPG to PDF", href: "/convert/jpg-to-pdf", icon: <ImageIcon className="w-5 h-5" /> },
  { name: "History", href: "/history", icon: <History className="w-5 h-5" /> },
  { name: "Support", href: "/contact", icon: <Zap className="w-5 h-5" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-background/50 backdrop-blur-xl z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xl font-heading font-bold text-white tracking-wide">CompressIt</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NEXT_ROUTES.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className={`${isActive ? "text-primary" : "text-white/50"}`}>
                {route.icon}
              </div>
              {route.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || "User"}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="mt-2 w-full flex items-center gap-2 text-sm text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
