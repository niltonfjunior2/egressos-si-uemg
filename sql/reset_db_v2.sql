-- WARNING: THIS SCRIPT CLEARS ALL DATA FROM THE DATABASE AND CREATES A FRESH DEFAULT ADMIN.
-- USE WITH CAUTION.

-- 1. Enable pgcrypto for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Clear all data (CASCADE ensures dependent tables are cleared)
-- We truncate 'profiles' and cascade to everything that references it.
TRUNCATE TABLE public.profiles CASCADE;

-- Also need to clear opportunities if not cascaded via profiles (it should be, but let's be safe)
-- opportunities references profiles via author_id.
-- feed_posts references profiles via author_id.
-- opportunity_interests references opportunities and profiles.
-- academic_records, education_history, professional_history, profile_surveys reference profiles.

-- Explicit truncate for clarity
TRUNCATE TABLE public.opportunity_interests CASCADE;
TRUNCATE TABLE public.feed_posts CASCADE;
TRUNCATE TABLE public.opportunities CASCADE;
TRUNCATE TABLE public.academic_records CASCADE;
TRUNCATE TABLE public.education_history CASCADE;
TRUNCATE TABLE public.professional_history CASCADE;
TRUNCATE TABLE public.profile_surveys CASCADE;

-- Finally, remove users from auth.users
-- Note: 'profiles' references auth.users via foreign key on id.
-- Since we truncated profiles above, we can now safely delete from auth.users.
-- However, we only delete users that correspond to our app if possible, or all if requested.
-- The user requested "apaga todos os registros".
TRUNCATE TABLE auth.users CASCADE;

-- 3. Create the Admin User
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    -- Insert into auth.users
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
        '00000000-0000-0000-0000-000000000000', -- standard instance_id
        new_user_id,
        'authenticated',
        'authenticated',
        'nilton.junior@uemg.br',
        crypt('ncc1701@ESI', gen_salt('bf')), -- Hashed password
        now(), -- Auto-confirm
        null,
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Nilton Junior"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- Insert into public.profiles (Using the trigger or manual insert)
    -- Our trigger 'on_auth_user_created' usually handles this, but let's ensure it's set correctly as ADMIN.
    -- If the trigger runs, it might create a profile with default role 'aluno'.
    -- We'll explicitely check and UPDATE or INSERT to force 'administrador'.
    
    -- Option A: Trust the trigger then update.
    -- Option B: Insert manually (if trigger conflicts, UPSERT).
    
    INSERT INTO public.profiles (id, role, full_name, email, is_open_to_mentoring)
    VALUES (
        new_user_id,
        'administrador',
        'Nilton Junior',
        'nilton.junior@uemg.br',
        false
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'administrador',
        full_name = 'Nilton Junior',
        email = 'nilton.junior@uemg.br';
        
END $$;
