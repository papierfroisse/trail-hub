-- Schéma de base de données PostgreSQL pour TrailHub
-- À exécuter dans l'éditeur SQL (SQL Editor) de votre tableau de bord Supabase.

-- Extension de support pour les géolocalisations (optionnel, pour l'avenir des points d'intérêt / Via Rhona)
-- create extension if not exists postgis;

----------------------------------------------------
-- 1. Table Profiles (Profils Utilisateurs)
----------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  preferences jsonb default '{}'::jsonb
);

-- Activation de RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Politiques RLS (Chaque utilisateur accède à ses propres données)
create policy "Les utilisateurs peuvent voir leur propre profil" 
  on public.profiles for select using (auth.uid() = id);

create policy "Les utilisateurs peuvent mettre à jour leur propre profil" 
  on public.profiles for update using (auth.uid() = id);

create policy "Les utilisateurs peuvent insérer leur propre profil" 
  on public.profiles for insert with check (auth.uid() = id);


----------------------------------------------------
-- Triggers pour créer automatiquement le profil à l'inscription
----------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


----------------------------------------------------
-- 2. Table Trails (Itinéraires de randonnée & GPX)
----------------------------------------------------
create table if not exists public.trails (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  date date,
  distance_km double precision not null default 0,
  d_plus integer not null default 0,
  d_minus integer not null default 0,
  status text not null default 'À venir',
  notes text,
  waypoints jsonb default '[]'::jsonb,
  elevation_profile jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activation de RLS
alter table public.trails enable row level security;

-- Politiques RLS
create policy "Les utilisateurs accèdent à leurs propres trails" 
  on public.trails for all using (auth.uid() = user_id);


----------------------------------------------------
-- 3. Table Gear (Inventaire d'équipement & sacs)
----------------------------------------------------
create table if not exists public.gear (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text not null,
  weight_grams integer not null default 0,
  is_packed boolean not null default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activation de RLS
alter table public.gear enable row level security;

-- Politiques RLS
create policy "Les utilisateurs accèdent à leur propre matériel" 
  on public.gear for all using (auth.uid() = user_id);
