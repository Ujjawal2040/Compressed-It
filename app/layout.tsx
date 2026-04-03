import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "CompressIt | Next-Gen File Tools",
  description: "Fast, secure, and client-side file compression and conversion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${dmSans.variable} font-body bg-background text-foreground antialiased min-h-screen`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1A1D27',
              color: '#ededed',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }} 
        />
      </body>
    </html>
  );
}
