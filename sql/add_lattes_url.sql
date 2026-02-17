ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS lattes_url text;

COMMENT ON COLUMN public.profiles.lattes_url IS 'URL do Currículo Lattes do egresso';
