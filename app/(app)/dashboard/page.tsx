"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useFileJob, FileJob } from "@/hooks/useFileJob";
import { formatBytes } from "@/lib/formatters";
import { supabase } from "@/lib/supabase";
import { FileDown, FileImage, ImageIcon, Download, AlertCircle, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

type UserStats = {
  total_files_processed: number;
  total_bytes_saved: number;
  total_conversions: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { fetchJobs, loading: jobsLoading } = useFileJob();
  const [recentJobs, setRecentJobs] = useState<FileJob[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_files_processed: 0,
    total_bytes_saved: 0,
    total_conversions: 0,
  });

  useEffect(() => {
    if (user) {
      // Calculate stats dynamically from all completed jobs
      supabase
        .from('file_jobs')
        .select('original_size, output_size, job_type')
        .eq('user_id', user.id)
        .eq('status', 'done')
        .then(({ data }) => {
          if (data) {
            const processed = data.length;
            const conversions = data.filter(d => d.job_type !== 'compress').length;
            const saved = data.reduce((acc, curr) => {
              const diff = curr.original_size - (curr.output_size || curr.original_size);
              return acc + Math.max(0, diff);
            }, 0);
            
            setStats({
              total_files_processed: processed,
              total_bytes_saved: saved,
              total_conversions: conversions
            });
          }
        });

      // Load recent jobs
      fetchJobs(5).then(setRecentJobs);
    }
  }, [user, fetchJobs]);

  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-3xl font-heading font-bold text-white">
          {greeting}, {user?.user_metadata?.full_name?.split(' ')[0] || "there"} 👋
        </h2>
        <p className="text-white/60 mt-1 text-sm md:text-base">Ready to optimize some files today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<FileDown className="w-6 h-6 text-primary" />}
          label="Total Files Processed"
          value={stats.total_files_processed.toString()}
          delay="0"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-secondary" />}
          label="Total Space Saved"
          value={formatBytes(stats.total_bytes_saved)}
          delay="100ms"
        />
        <StatCard 
          icon={<FileImage className="w-6 h-6 text-primary" />}
          label="Total Conversions"
          value={stats.total_conversions.toString()}
          delay="200ms"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 pt-4">
        <Link href="/compress">
          <Button variant="primary" className="gap-2">
            <FileDown className="w-5 h-5" /> Compress File
          </Button>
        </Link>
        <Link href="/convert/pdf-to-jpg">
          <Button variant="outline" className="gap-2">
            <FileImage className="w-5 h-5" /> PDF → JPG
          </Button>
        </Link>
        <Link href="/convert/jpg-to-pdf">
          <Button variant="outline" className="gap-2">
            <ImageIcon className="w-5 h-5" /> JPG → PDF
          </Button>
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="glass-card mt-8 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-heading font-bold text-white">Recent Jobs</h3>
          <Link href="/history" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-4 font-medium">File</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Size (Before → After)</th>
                <th className="px-6 py-4 font-medium">Savings</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobsLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading recent jobs...
                  </td>
                </tr>
              ) : recentJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No files processed yet. Start by compressing a file!
                  </td>
                </tr>
              ) : (
                recentJobs.map((job) => {
                  const savings = job.output_size && job.original_size 
                    ? Math.max(0, ((job.original_size - job.output_size) / job.original_size) * 100).toFixed(1)
                    : null;
                  
                  return (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]" title={job.original_filename}>
                        {job.original_filename}
                      </td>
                      <td className="px-6 py-4 uppercase text-white/70">{job.job_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-white/70 whitespace-nowrap">
                        {formatBytes(job.original_size)} 
                        {job.output_size ? ` → ${formatBytes(job.output_size)}` : ''}
                      </td>
                      <td className="px-6 py-4">
                        {savings && parseFloat(savings) > 0 ? (
                          <span className="inline-flex px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-bold">
                            -{savings}%
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {job.output_url && job.status === "done" && (
                          <a 
                            href={job.output_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function StatCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: string }) {
  return (
    <div 
      className="glass-card p-6 flex flex-col gap-2 relative overflow-hidden group"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-2">
        {icon}
      </div>
      <p className="text-white/60 text-sm font-medium">{label}</p>
      <p className="text-3xl font-heading font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

function JobStatusBadge({ status }: { status: FileJob['status'] }) {
  if (status === 'done') return <span className="inline-flex px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Done</span>;
  if (status === 'error') return <span className="inline-flex px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider gap-1"><AlertCircle className="w-3 h-3" /> Error</span>;
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider">
    <Loader2 className="w-3 h-3 animate-spin" /> Processing
  </span>;
}


