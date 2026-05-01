-- Plans enum and profile/credits tables
create type public.plan_tier as enum ('free', 'pro', 'business');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan plan_tier not null default 'free',
  credits int not null default 10,
  referral_code text unique default substr(md5(random()::text), 1, 8),
  referred_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Generation history
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool text not null,
  prompt text,
  result text,
  created_at timestamptz not null default now()
);

alter table public.generations enable row level security;
create policy "users view own generations" on public.generations for select using (auth.uid() = user_id);
create policy "users insert own generations" on public.generations for insert with check (auth.uid() = user_id);
create policy "users delete own generations" on public.generations for delete using (auth.uid() = user_id);

-- Auto create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Decrement credits function
create or replace function public.use_credit(_amount int default 1)
returns int language plpgsql security definer set search_path = public as $$
declare _remaining int;
begin
  update public.profiles set credits = credits - _amount
    where id = auth.uid() and credits >= _amount
    returning credits into _remaining;
  if _remaining is null then raise exception 'INSUFFICIENT_CREDITS'; end if;
  return _remaining;
end;
$$;