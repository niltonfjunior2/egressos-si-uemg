-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Grant access to authenticated users
GRANT SELECT ON public.profiles TO authenticated;

-- Ensure service role can do everything (default, but good to ensure)
-- GRANT ALL ON public.profiles TO service_role;
