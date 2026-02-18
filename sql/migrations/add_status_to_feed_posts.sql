-- Add status column to feed_posts table
ALTER TABLE public.feed_posts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Provide backward compatibility: Existing posts are approved by default
UPDATE public.feed_posts SET status = 'approved' WHERE status = 'pending';

-- Update the default to be 'pending' for new posts (if you want all to start as pending)
-- However, since the column definition already has DEFAULT 'pending', we are good.
-- The UPDATE above was just to migrate existing data.

-- Add index for performance on filtering by status
CREATE INDEX IF NOT EXISTS idx_feed_posts_status ON public.feed_posts(status);
