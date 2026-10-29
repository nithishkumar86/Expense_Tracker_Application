-- Run by hand in the Supabase SQL editor after Playwright verification,
-- to remove the test accounts created during that run.
-- (Supabase rejects reserved domains like example.com, so tests use gmail.com;
-- "Confirm email" is off, so no mail is ever sent to these addresses.)
delete from auth.users where email like 'pw-test-%@gmail.com';
