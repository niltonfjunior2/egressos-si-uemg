-- Add policy for admins and coordinators to update feed_posts
CREATE POLICY "Admins and Coordinators can update feed_posts"
ON public.feed_posts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'administrador' OR profiles.role = 'coordenador')
  )
);
