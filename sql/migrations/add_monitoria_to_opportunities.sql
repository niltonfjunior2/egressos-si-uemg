-- Drop the existing check constraint
ALTER TABLE public.opportunities 
DROP CONSTRAINT IF EXISTS opportunities_type_check;

-- Add the new check constraint including 'monitoria'
ALTER TABLE public.opportunities 
ADD CONSTRAINT opportunities_type_check 
CHECK (type = ANY (ARRAY['estagio'::text, 'emprego'::text, 'trainee'::text, 'monitoria'::text, 'freelance'::text, 'pj'::text, 'projeto_pesquisa'::text]));
