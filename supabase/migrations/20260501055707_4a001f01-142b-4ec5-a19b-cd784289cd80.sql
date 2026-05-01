revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.use_credit(int) from public, anon;
-- authenticated needs to call use_credit
grant execute on function public.use_credit(int) to authenticated;