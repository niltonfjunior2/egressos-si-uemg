-- Fix missing profile for Admin User
-- User ID from logs: c6ad27e6-a8b4-4391-b3ca-6704de763af7

INSERT INTO public.profiles (id, role, full_name, email, is_open_to_mentoring)
VALUES (
    'c6ad27e6-a8b4-4391-b3ca-6704de763af7',
    'administrador',
    'Administrador Root',
    'adminegressos@uemg.br',
    false
)
ON CONFLICT (id) DO UPDATE SET 
    role = 'administrador',
    email = 'adminegressos@uemg.br';
