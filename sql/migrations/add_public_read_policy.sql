-- Enable read access for everyone to education_history
ALTER TABLE public.education_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.education_history
    FOR SELECT USING (true);

-- Enable read access for everyone to professional_history (just in case)
ALTER TABLE public.professional_history ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'professional_history' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON public.professional_history
            FOR SELECT USING (true);
    END IF;
END $$;
