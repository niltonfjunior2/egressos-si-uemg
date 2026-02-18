-- Add expires_at column to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Add index for performance on filtering by expiration date
CREATE INDEX IF NOT EXISTS idx_opportunities_expires_at ON public.opportunities(expires_at);
