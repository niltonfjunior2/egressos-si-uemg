-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.academic_records (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  entry_year integer NOT NULL,
  graduation_year integer,
  student_id_code text,
  status text DEFAULT 'cursando'::text CHECK (status = ANY (ARRAY['cursando'::text, 'formado'::text, 'trancado'::text, 'desligado'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT academic_records_pkey PRIMARY KEY (id),
  CONSTRAINT academic_records_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.education_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  institution_name text NOT NULL,
  degree_type text NOT NULL,
  course_name text NOT NULL,
  status text CHECK (status = ANY (ARRAY['em_andamento'::text, 'concluido'::text, 'interrompido'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT education_history_pkey PRIMARY KEY (id),
  CONSTRAINT education_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.feed_posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  author_id uuid NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT feed_posts_pkey PRIMARY KEY (id),
  CONSTRAINT feed_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.opportunities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  link_url text,
  type text NOT NULL CHECK (type = ANY (ARRAY['estagio'::text, 'emprego'::text, 'trainee'::text, 'freelance'::text, 'pj'::text, 'projeto_pesquisa'::text])),
  status text DEFAULT 'aberta'::text CHECK (status = ANY (ARRAY['aberta'::text, 'preenchida'::text, 'cancelada'::text])),
  created_at timestamp with time zone DEFAULT now(),
  company text,
  location text,
  work_mode text CHECK (work_mode = ANY (ARRAY['presencial'::text, 'remoto'::text, 'hibrido'::text])),
  contact_info text,
  CONSTRAINT opportunities_pkey PRIMARY KEY (id),
  CONSTRAINT opportunities_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.opportunity_interests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  opportunity_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  status text DEFAULT 'interessado'::text CHECK (status = ANY (ARRAY['interessado'::text, 'contratado'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT opportunity_interests_pkey PRIMARY KEY (id),
  CONSTRAINT opportunity_interests_opportunity_id_fkey FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id),
  CONSTRAINT opportunity_interests_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.professional_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL,
  company_name text NOT NULL,
  role_title text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  tech_stack ARRAY,
  salary_range text CHECK (salary_range = ANY (ARRAY['<2k'::text, '2k-5k'::text, '5k-8k'::text, '8k-12k'::text, '12k-15k'::text, '>15k'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT professional_history_pkey PRIMARY KEY (id),
  CONSTRAINT professional_history_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_surveys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  missing_technologies text,
  most_useful_areas ARRAY,
  soft_skills_desired ARRAY,
  methodology_priority ARRAY,
  employability_impact integer CHECK (employability_impact >= 1 AND employability_impact <= 5),
  suggestions text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profile_surveys_pkey PRIMARY KEY (id),
  CONSTRAINT profile_surveys_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'aluno'::user_role,
  full_name text NOT NULL,
  social_name text,
  email text,
  linkedin_url text,
  github_url text,
  is_open_to_mentoring boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  mobile_phone text,
  social_media_url text,
  lattes_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);