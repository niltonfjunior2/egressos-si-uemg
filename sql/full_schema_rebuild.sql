-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CLEAN SLATE (Be careful!)
-- We assume the user has a fresh database or wants to wipe everything.
-- Auth tables are protected, so we focus on public.
DROP TABLE IF EXISTS public.opportunity_interests CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.feed_posts CASCADE;
DROP TABLE IF EXISTS public.professional_history CASCADE;
DROP TABLE IF EXISTS public.education_history CASCADE;
DROP TABLE IF EXISTS public.academic_records CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. ENUMS & TYPES
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('aluno', 'egresso', 'professor', 'coordenador', 'administrador');

-- 4. TABLES (DDL)

-- PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'aluno',
    full_name TEXT NOT NULL,
    social_name TEXT,
    email TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    avatar_url TEXT,
    is_open_to_mentoring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACADEMIC RECORDS
CREATE TABLE public.academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_year INTEGER NOT NULL,
    graduation_year INTEGER,
    student_id_code TEXT,
    status TEXT DEFAULT 'cursando' CHECK (status IN ('cursando', 'formado', 'trancado', 'desligado')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDUCATION HISTORY
CREATE TABLE public.education_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    degree_type TEXT NOT NULL,
    course_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('em_andamento', 'concluido', 'interrompido')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFESSIONAL HISTORY
CREATE TABLE public.professional_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    tech_stack TEXT[],
    salary_range TEXT CHECK (salary_range IN ('<2k', '2k-5k', '5k-8k', '8k-12k', '12k-15k', '>15k')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEED POSTS
CREATE TABLE public.feed_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OPPORTUNITIES
CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('estagio', 'emprego', 'trainee', 'freelance', 'projeto_pesquisa')),
    status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'preenchida', 'cancelada')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    company TEXT,
    location TEXT,
    work_mode TEXT CHECK (work_mode IN ('presencial', 'remoto', 'hibrido'))
);

-- OPPORTUNITY INTERESTS
CREATE TABLE public.opportunity_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'interessado' CHECK (status IN ('interessado', 'contratado')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. RLS POLICIES (Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_interests ENABLE ROW LEVEL SECURITY;

-- Note: Simplified Policies for Start. Refine later based on PROJECT_DNA.md
-- PUBLIC ACCESS (Read-only for some tables if needed)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Feed: Visible to Authenticated (or Public if needed for landing page)
CREATE POLICY "Feed posts are viewable by everyone" ON public.feed_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own feed posts" ON public.feed_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Opportunities
CREATE POLICY "Opportunities are viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Profs/Admins can insert opportunities" ON public.opportunities FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('professor', 'coordenador', 'administrador'))
);


-- 6. SEED ADMIN USER
-- Execute this block to create the admin user if it doesn't exist
DO $$
DECLARE
    new_user_id uuid := '00000000-0000-0000-0000-000000000001'; -- Fixed ID for root admin
    user_email text := 'adminegressos@uemg.br';
BEGIN
    -- Check if user exists in auth.users (if not wiped)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
        INSERT INTO auth.users (
            id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, 
            created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            user_email,
            crypt('adminegressos', gen_salt('bf', 10)),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Administrador Root"}',
            false
        );
        
        -- Identity
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            new_user_id,
            format('{"sub": "%s", "email": "%s"}', new_user_id, user_email)::jsonb,
            'email',
            user_email,
            now(),
            now(),
            now()
        );
    END IF;

    -- Upsert Profile
    INSERT INTO public.profiles (id, role, full_name, email, is_open_to_mentoring)
    VALUES (
        (SELECT id FROM auth.users WHERE email = user_email),
        'administrador',
        'Administrador Root',
        user_email,
        false
    )
    ON CONFLICT (id) DO UPDATE SET role = 'administrador';

END $$;
