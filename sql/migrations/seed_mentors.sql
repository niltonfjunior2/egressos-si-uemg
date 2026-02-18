-- Ensure there are some mentors for testing
UPDATE public.profiles 
SET is_open_to_mentoring = true 
WHERE id IN (
    SELECT id FROM public.profiles 
    ORDER BY created_at DESC 
    LIMIT 3
);
