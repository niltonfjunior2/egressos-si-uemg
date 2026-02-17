-- Add contact_info column
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS contact_info text;

-- Update the type check constraint to include 'pj'
ALTER TABLE public.opportunities 
DROP CONSTRAINT IF EXISTS opportunities_type_check;

ALTER TABLE public.opportunities 
ADD CONSTRAINT opportunities_type_check 
CHECK (type = ANY (ARRAY[
    'estagio'::text, 
    'emprego'::text, 
    'trainee'::text, 
    'freelance'::text, 
    'pj'::text,
    'projeto_pesquisa'::text
]));
