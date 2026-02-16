-- Cria o usuário na tabela auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- instance_id (padrão)
    gen_random_uuid(), -- id
    'authenticated', -- aud
    'authenticated', -- role (papel do Supabase Auth)
    'nilton.junior@uemg.br', -- email
    crypt('ncc1701@EGRESSO', gen_salt('bf')), -- encrypted_password
    now(), -- email_confirmed_at
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}', -- raw_app_meta_data
    '{"full_name": "Administrador do Sistema"}', -- raw_user_meta_data
    now(),
    now(),
    '',
    '',
    '',
    ''
) RETURNING id;

-- A inserção na tabela public.profiles deve ocorrer automaticamente via Trigger se configurado.
-- Caso contrário, ou para garantir o papel de ADMIN, fazemos um UPSERT.

INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
    id, 
    'Administrador do Sistema', 
    'nilton.junior@uemg.br', 
    'administrador'::user_role -- Define como ADMINISTRADOR explicitamente
FROM auth.users 
WHERE email = 'nilton.junior@uemg.br'
ON CONFLICT (id) DO UPDATE
SET role = 'administrador'::user_role;
