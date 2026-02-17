-- Create table for Profile Surveys (Steps 4 and 5)
create table if not exists public.profile_surveys (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Step 4 Fields
  missing_technologies text, -- Textarea
  most_useful_areas text[], -- Checkbox Group
  soft_skills_desired text[], -- Checkbox Group
  methodology_priority text[], -- Checkbox Group
  employability_impact int check (employability_impact >= 1 and employability_impact <= 5), -- Rating 1-5
  
  -- Step 5 Field
  suggestions text, -- Textarea
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(profile_id)
);

-- RLS Policies
alter table public.profile_surveys enable row level security;

create policy "Users can view their own survey"
  on public.profile_surveys for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own survey"
  on public.profile_surveys for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own survey"
  on public.profile_surveys for update
  using ( auth.uid() = profile_id );

-- Grant access
grant all on public.profile_surveys to authenticated;
grant all on public.profile_surveys to service_role;
