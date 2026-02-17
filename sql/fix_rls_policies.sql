-- Enable RLS on tables (just in case)
alter table public.academic_records enable row level security;
alter table public.professional_history enable row level security;
alter table public.education_history enable row level security;

-- Policies for academic_records
create policy "Users can view their own academic records"
  on public.academic_records for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own academic records"
  on public.academic_records for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own academic records"
  on public.academic_records for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own academic records"
  on public.academic_records for delete
  using ( auth.uid() = profile_id );


-- Policies for professional_history
create policy "Users can view their own professional history"
  on public.professional_history for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own professional history"
  on public.professional_history for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own professional history"
  on public.professional_history for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own professional history"
  on public.professional_history for delete
  using ( auth.uid() = profile_id );


-- Policies for education_history
create policy "Users can view their own education history"
  on public.education_history for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own education history"
  on public.education_history for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update their own education history"
  on public.education_history for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own education history"
  on public.education_history for delete
  using ( auth.uid() = profile_id );

-- Grant access to authenticated users
grant all on public.academic_records to authenticated;
grant all on public.professional_history to authenticated;
grant all on public.education_history to authenticated;
