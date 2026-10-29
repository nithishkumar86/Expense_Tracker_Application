-- Run this once in the Supabase SQL editor.
-- Before running: Authentication > Sign In / Providers > Email must be enabled
-- with "Confirm email" OFF, and the minimum password length set to 8.

create table public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- New public-schema tables are no longer auto-exposed to the Data API
-- (Supabase breaking change effective 2026-10-30): grant explicitly.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Profiles are created only here, atomically with the auth user.
-- No insert/update/delete policy exists, so the app never writes this table directly.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, name)
  values (
    new.id,
    coalesce(
      nullif(left(btrim(new.raw_user_meta_data ->> 'name'), 80), ''),
      nullif(left(split_part(new.email, '@', 1), 80), ''),
      'User'
    )
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
