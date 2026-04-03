"use client";

import { useEffect, useState } from "react";
import { useFileJob, FileJob } from "@/hooks/useFileJob";
import { formatBytes, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Download, Trash2, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { fetchJobs, deleteJob, loading } = useFileJob();
  const [jobs, setJobs] = useState<FileJob[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Fetch a large amount to handle local filtering for MVP
    fetchJobs(100).then(setJobs);
  }, [fetchJobs]);

  const handleDelete = async () => {
    if (!jobToDelete) return;
    const success = await deleteJob(jobToDelete);
    if (success) {
      setJobs(jobs.filter(j => j.id !== jobToDelete));
      toast.success("Job record deleted");
    } else {
      toast.error("Failed to delete job");
    }
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const filteredJobs = jobs.filter(job => {
    if (filterType !== 'all' && job.job_type !== filterType) return false;
    if (searchQuery && !job.original_filename.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 fade-in h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-heading font-bold text-white">Job History</h2>
        <p className="text-white/60 mt-1">Review all your past file conversions and compressions.</p>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Filter className="w-4 h-4 text-white/40 mr-1" />
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'compress', label: 'Compress' },
              { id: 'pdf_to_jpg', label: 'PDF→JPG' },
              { id: 'jpg_to_pdf', label: 'JPG→PDF' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setFilterType(f.id); setCurrentPage(1); }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filterType === f.id 
                    ? "bg-primary text-background" 
                    : "bg-surface text-white hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-[#11131A] text-white/60 sticky top-0 z-10 box-border">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-white/5">Filename</th>
                <th className="px-6 py-4 font-medium border-b border-white/5 w-24">Type</th>
                <th className="px-6 py-4 font-medium border-b border-white/5 w-32">Date</th>
                <th className="px-6 py-4 font-medium border-b border-white/5 w-48">Size change</th>
                <th className="px-6 py-4 font-medium border-b border-white/5 w-32">Status</th>
                <th className="px-6 py-4 font-medium border-b border-white/5 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && jobs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-white/40">Loading history...</td></tr>
              ) : paginatedJobs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-white/40">No jobs found matching your criteria.</td></tr>
              ) : (
                paginatedJobs.map((job) => {
                  const savings = job.output_size && job.original_size 
                    ? Math.max(0, ((job.original_size - job.output_size) / job.original_size) * 100).toFixed(1)
                    : null;
                    
                  return (
                    <tr key={job.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white truncate max-w-[200px]" title={job.original_filename}>
                          {job.original_filename}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">
                        {job.job_type === 'pdf_to_jpg' ? 'PDF→JPG' : job.job_type === 'jpg_to_pdf' ? 'JPG→PDF' : 'Compress'}
                      </td>
                      <td className="px-6 py-4 text-white/50">{formatDate(job.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white/70">{formatBytes(job.original_size)}</span>
                          {job.output_size && (
                            <>
                              <span className="text-white/30">→</span>
                              <span className="text-white/70">{formatBytes(job.output_size)}</span>
                              {parseFloat(savings || "0") > 0 && (
                                <span className="text-green-400 text-xs ml-1 font-medium bg-green-400/10 px-1 rounded">-{savings}%</span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          job.status === 'done' ? 'bg-green-500/10 text-green-400' :
                          job.status === 'error' ? 'bg-red-500/10 text-red-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {job.output_url && job.status === "done" && (
                            <a 
                              href={job.output_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => { setJobToDelete(job.id); setIsDeleteModalOpen(true); }}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Details */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#11131A] text-sm text-white/50">
            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} results</span>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Job History"
        message="Are you sure you want to delete this job record? The output file may still eventually expire according to bucket lifecycle policies, but it will be removed from your history immediately."
        confirmText="Delete Record"
        isDanger
        onConfirm={handleDelete}
      />
    </div>
  );
}
