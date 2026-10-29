**Landing Page Plan (design only, all dummy)**


**1. Route and assets**
- Page: `src/app/page.tsx` (served at `localhost:3000`)
- Move your image to `public/images/tracker.jpg` and render it with `next/image`
Image is present in the cirrent directory tracker.jpg pick that one

**2. Layout, top to bottom**
- **Navbar:** Home and Expense on the left, **Sign up** and **Login** buttons on the right.
- **Hero:** the heading "Welcome To Expense Tracker", with the image centered below it.
- **Features:** 4 boxes below the hero, explaining why expense tracking matters:
  1. Track every spending
  2. Control your budget
  3. Save more money
  4. Your data stays private (ties to your multi-tenant design)
- Desktop shows 4 boxes in a row; mobile stacks them.

**3. Dummy behavior**
- Home, Expense, Sign up, and Login are plain `<button type="button">` elements with no links or handlers, so nothing redirects.

**4. Components** (in `src/components/`, following your component rules)
- `Navbar.tsx`
- `Hero.tsx`
- `FeatureCard.tsx`
- `FeaturesSection.tsx`
- All are Server Components with named exports and typed props. No Supabase yet.

**5. Styling**
- Blue theme to match your image, responsive, with accessible buttons and alt text. I'm assuming Tailwind (the `create-next-app` default).



## Login Plan


# Login System Plan: Password-Only (revised)

**Scope:** signup, login, logout, a protected dashboard, and tenant isolation (`auth.uid() = user_id`, per CLAUDE.md as written — no separate tenant layer). There is no OTP, no email, and no Resend or SMTP.

## Phase 1: Supabase setup (dashboard, done by the user — Claude never uses the Supabase MCP on this account)
- **Authentication > Sign In / Providers > Email:** enable the provider and turn **Confirm email OFF**.
- Set the minimum password length to 8.
- Env vars already in `.env.local` (Claude never reads this file): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Same two vars go in Vercel.
- `.env*` is already in `.gitignore`.

## Phase 2: Packages
- `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `server-only` (pinned exact versions, already installed).

## Phase 3: Database migration — run by hand in the SQL editor
File: `supabase/migrations/0001_profiles.sql`. One table, keyed directly by `user_id` (no `tenants` table — each user owns exactly one profile, so the extra indirection buys nothing today):
```sql
create table public.profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- New public tables are no longer auto-exposed to the Data API: grant explicitly.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Profiles are created only here, atomically with the auth user, via trigger.
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
```
There are no insert/update/delete policies — profiles are created only by the trigger, so the "session with no profile" state cannot happen, and no recovery page is needed.

A companion `supabase/tests/rls_profiles.sql` (transactional, rolls back) proves: the trigger creates both of two fake users' profiles, each user can select only their own row, neither can insert/update, and `anon` has no table privilege at all.

## Phase 4: Code layout
```
src/lib/supabase/   env.ts, database.types.ts, server.ts, proxy-session.ts
src/lib/auth/       schemas.ts, route-guard.ts, signup.ts, login.ts, logout.ts
src/lib/profile/    get-current-profile.ts
src/proxy.ts                         (Next 16: proxy.ts replaces middleware.ts)
src/components/     SignupForm, LoginForm, FormField, LogoutButton, DashboardGreeting
src/app/            signup/, login/, dashboard/
```

## Phase 5: Flow logic
**Signup** (`signup.ts`, `'use server'`)
1. Validate name, email, password (zod).
2. `signUp({ email, password, options: { data: { name } } })` inside try/catch (redirect stays outside the catch, since it throws).
3. Already registered → "Account already exists, please log in."
4. No session back (confirm-email somehow still on) → log server-side, return a generic message.
5. Success → `redirect('/dashboard')`.

**Login** (`login.ts`): validate → `signInWithPassword` → any failure → "Invalid email or password." → success → `/dashboard`.

**Logout** (`logout.ts`): `signOut()` → `redirect('/')`.

## Phase 6: Proxy rules (`src/proxy.ts`, matcher `['/dashboard/:path*', '/login', '/signup']`)
| State | Visiting | Result |
|---|---|---|
| No session | `/dashboard*` | redirect to `/login` |
| Session | `/login`, `/signup` | redirect to `/dashboard` |

Authorize with `getClaims()` (current Supabase guidance), never `getSession()`.

## Phase 7: Dashboard
- `get-current-profile.ts` reads `getClaims()` for `sub`, redirects to `/login` if absent, then queries `profiles` filtered by that `sub` (defense in depth on top of RLS).
- `DashboardGreeting` is an async Server Component behind `<Suspense>` (required: `cacheComponents: true` forbids reading `cookies()` outside one) showing "Hi, {name}" and an empty state.

## Phase 8: Tests (per file, after completion)
- **Unit:** zod schemas, route-guard table, each auth action (mocked Supabase client + mocked `redirect`/`notFound`), `get-current-profile`.
- **Tenant isolation:**
  - Unit: `get-current-profile` takes no id argument — the filter always comes from the session.
  - SQL (`rls_profiles.sql`, run by hand): user A cannot read B's profile; anon gets `insufficient_privilege`.
  - Playwright: two browser contexts, two real users, each sees only their own name.
- Test users use emails like `pw-test-<timestamp>@example.com`; cleanup SQL (`delete from auth.users where email like 'pw-test-%@example.com'`) is run by hand afterward.

## Phase 9: Playwright verification
- Full path: signup → dashboard shows name → logout → login → dashboard.
- Two contexts/users confirm isolation.
- Check redirects against the Phase 6 table, console errors, failed requests.
- Latency targets: page load under 2 s, auth actions under 1 s.

## Phase 10: Delivery
Follow the CLAUDE.md loop: advisor before and after coding, then `checks.md`, the SQL run by hand, Playwright, push with `github_commands.md`, and a final report.

## Build order
Phase 2 (packages, done) → Phase 3 (SQL, given to the user to run) → Phase 4–7 (lib, proxy, components, pages) → Phase 8–10 (tests, Playwright, delivery).


