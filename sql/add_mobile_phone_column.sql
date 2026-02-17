ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mobile_phone text;

COMMENT ON COLUMN public.profiles.mobile_phone IS 'Número de telefone celular do egresso';
