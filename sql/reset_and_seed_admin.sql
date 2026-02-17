-- DANGER: This script resets public tables but handles auth carefully.
-- Utiliza pgcrypto para hash de senha. Certifique-se que a extensão está habilitada.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Limpeza das tabelas da aplicação
TRUNCATE TABLE public.opportunity_interests RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.opportunities RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.feed_posts RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.professional_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.education_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.academic_records RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.profiles RESTART IDENTITY CASCADE;

-- 2. Remoção Cirúrgica do Admin (se existir) para recriar
-- Não apague tudo de auth.users para evitar corromper o serviço se houver dependências internas
DELETE FROM auth.users WHERE email = 'adminegressos@uemg.br';

-- 3. Criação do Usuário Admin (Root)
DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
BEGIN
    -- Inserir em auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        role,
        aud,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'adminegressos@uemg.br',
        crypt('adminegressos', gen_salt('bf', 10)), -- Senha: adminegressos (Cost 10)
        now(), -- Email confirmado
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Administrador Root"}',
        false
    );

    -- Inserir em auth.identities (Muitas vezes necessário para login funcionar corretamente em algumas versões do GoTrue)
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        new_user_id,
        format('{"sub": "%s", "email": "adminegressos@uemg.br"}', new_user_id)::jsonb,
        'email',
        'adminegressos@uemg.br', -- provider_id is the email
        now(),
        now(),
        now()
    );

    -- Inserir em public.profiles
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        email,
        is_open_to_mentoring
    ) VALUES (
        new_user_id,
        'administrador', -- Role correta (PT-BR)
        'Administrador Root',
        'adminegressos@uemg.br',
        false
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'administrador';

END $$;
