-- Run this by hand in the Supabase SQL editor, after 0001_profiles.sql.
-- It runs in a transaction and rolls back, so it leaves nothing behind.
-- Success means the whole script finishes with no error.
-- Any FAIL: message means that assertion did not hold.

begin;

insert into auth.users (id, email, raw_user_meta_data, aud, role) values
  ('00000000-0000-4000-8000-00000000000a', 'rls-a@example.com', '{"name":"Alice"}', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-00000000000b', 'rls-b@example.com', '{"name":"Bob"}',   'authenticated', 'authenticated');

do $$ begin
  if (select count(*) from public.profiles
      where user_id in ('00000000-0000-4000-8000-00000000000a',
                        '00000000-0000-4000-8000-00000000000b')) <> 2 then
    raise exception 'FAIL: trigger did not create both profiles';
  end if;
end $$;

-- User A
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}';
do $$ begin
  if (select count(*) from public.profiles) <> 1
     or not exists (select 1 from public.profiles where name = 'Alice') then
    raise exception 'FAIL: user A does not see exactly their own profile';
  end if;
  begin
    insert into public.profiles (user_id, name) values ('00000000-0000-4000-8000-00000000000a', 'x');
    raise exception 'FAIL: user A could insert a profile';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set name = 'hacked' where user_id = '00000000-0000-4000-8000-00000000000b';
    raise exception 'FAIL: user A could update';
  exception when insufficient_privilege then null;
  end;
end $$;

-- User B
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-00000000000b","role":"authenticated"}';
do $$ begin
  if (select count(*) from public.profiles) <> 1
     or not exists (select 1 from public.profiles where name = 'Bob') then
    raise exception 'FAIL: user B does not see exactly their own profile';
  end if;
end $$;

-- Anonymous: no table privilege at all
set local role anon;
do $$ begin
  begin
    perform 1 from public.profiles;
    raise exception 'FAIL: anon could read profiles';
  exception when insufficient_privilege then null;
  end;
end $$;

rollback;
