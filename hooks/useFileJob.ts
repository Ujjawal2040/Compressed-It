"use client"

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export type FileJob = {
  id: string;
  original_filename: string;
  original_size: number;
  output_size: number | null;
  file_type: 'pdf' | 'jpg' | 'png' | 'jpeg';
  job_type: 'compress' | 'pdf_to_jpg' | 'jpg_to_pdf';
  status: 'processing' | 'done' | 'error';
  output_url: string | null;
  created_at: string;
};

export function useFileJob() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async (limit = 10): Promise<FileJob[]> => {
    if (!user) return [];
    
    setLoading(true);
    const { data, error } = await supabase
      .from('file_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    setLoading(false);
    
    if (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
    
    return data as FileJob[];
  }, [user]);

  const createJob = async (job: Omit<FileJob, 'id' | 'created_at' | 'status'> & { status?: string }) => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('file_jobs')
      .insert({
        ...job,
        user_id: user.id,
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating job:", error);
      return null;
    }
    
    return data as FileJob;
  };

  const updateJob = async (id: string, updates: Partial<FileJob>) => {
    const { data, error } = await supabase
      .from('file_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating job:", error);
      return null;
    }
    
    return data as FileJob;
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase
      .from('file_jobs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting job:", error);
      return false;
    }
    return true;
  };

  return { fetchJobs, createJob, updateJob, deleteJob, loading };
}
