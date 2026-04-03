-- Supabase Schema for CompressIt

-- Create ENUM types for file types and job types
CREATE TYPE file_type_enum AS ENUM ('pdf', 'jpg', 'png', 'jpeg');
CREATE TYPE job_type_enum AS ENUM ('compress', 'pdf_to_jpg', 'jpg_to_pdf');
CREATE TYPE job_status_enum AS ENUM ('processing', 'done', 'error');

-- File Jobs Table
CREATE TABLE public.file_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_filename TEXT NOT NULL,
    original_size BIGINT NOT NULL, -- in bytes
    output_size BIGINT, -- in bytes
    file_type file_type_enum NOT NULL,
    job_type job_type_enum NOT NULL,
    status job_status_enum NOT NULL DEFAULT 'processing',
    output_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User Stats Table
CREATE TABLE public.user_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_files_processed INT DEFAULT 0 NOT NULL,
    total_bytes_saved BIGINT DEFAULT 0 NOT NULL,
    total_conversions INT DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.file_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------------
-- RLS Policies for file_jobs
-- ----------------------------------------------------------------------------------

-- Users can view their own jobs
CREATE POLICY "Users can view their own file jobs"
ON public.file_jobs FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own jobs
CREATE POLICY "Users can insert their own file jobs"
ON public.file_jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own jobs (e.g., when status changes to 'done')
CREATE POLICY "Users can update their own file jobs"
ON public.file_jobs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own jobs
CREATE POLICY "Users can delete their own file jobs"
ON public.file_jobs FOR DELETE
USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------------
-- RLS Policies for user_stats
-- ----------------------------------------------------------------------------------

-- Users can view their own stats
CREATE POLICY "Users can view their own stats"
ON public.user_stats FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update their own stats"
ON public.user_stats FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------------
-- Trigger to initialize user_stats on new user signup
-- ----------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create the Storage Bucket for outputs
INSERT INTO storage.buckets (id, name, public) VALUES ('output-files', 'output-files', true);

-- Storage Policies
-- Users can upload output files
CREATE POLICY "Users can upload their own output files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'output-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone can download output files (since bucket is public and links can be shared, though we can restrict if needed. Let's make it public for now since the UI gives a link)
CREATE POLICY "Anyone can download output files"
ON storage.objects FOR SELECT
USING (bucket_id = 'output-files');
