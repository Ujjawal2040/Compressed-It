"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileDown, FileImage, ImageIcon, History } from "lucide-react";

const MOBILE_ROUTES = [
  { name: "Dash", href: "/dashboard", icon: <LayoutDashboard className="w-6 h-6" /> },
  { name: "Compress", href: "/compress", icon: <FileDown className="w-6 h-6" /> },
  { name: "PDF>JPG", href: "/convert/pdf-to-jpg", icon: <FileImage className="w-6 h-6" /> },
  { name: "JPG>PDF", href: "/convert/jpg-to-pdf", icon: <ImageIcon className="w-6 h-6" /> },
  { name: "History", href: "/history", icon: <History className="w-6 h-6" /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0A0B0F]/90 backdrop-blur-xl z-50 flex items-center justify-around px-2 py-3 pb-safe">
      {MOBILE_ROUTES.map((route) => {
        const isActive = pathname === route.href || pathname.startsWith(route.href + '/');
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
              isActive ? "text-primary" : "text-white/50 hover:text-white"
            }`}
          >
            {route.icon}
            <span className="text-[10px] mt-1 font-medium">{route.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
