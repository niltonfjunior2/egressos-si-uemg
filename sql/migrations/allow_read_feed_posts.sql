-- Enable RLS on feed_posts if not already enabled
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read approved posts
CREATE POLICY "Everyone can read approved posts"
ON public.feed_posts
FOR SELECT
USING (status = 'approved');

-- Policy 2: Users can read their own posts (regardless of status)
CREATE POLICY "Users can read own posts"
ON public.feed_posts
FOR SELECT
USING (auth.uid() = author_id);

-- Policy 3: Admins and Coordinators can read all posts
CREATE POLICY "Admins and Coordinators can read all posts"
ON public.feed_posts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'administrador' OR profiles.role = 'coordenador')
  )
);
