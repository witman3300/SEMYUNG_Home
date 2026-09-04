-- ===========================================================
-- 세명장교 비즈니스센터 — Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행
-- ===========================================================

-- updated_at 자동 갱신 함수
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- 1) 상담 문의 (contacts) --------------------------------------------------
create table if not exists public.contacts (
  id          bigint generated always as identity primary key,
  name        text        not null,
  phone       text        not null,
  email       text,
  interest    text,
  message     text        not null,
  status      text        not null default '접수',  -- 접수 / 처리중 / 완료
  created_at  timestamptz not null default now()
);
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
alter table public.contacts enable row level security;

-- 2) 블로그 글 (posts) ------------------------------------------------------
create table if not exists public.posts (
  id          bigint generated always as identity primary key,
  title       text        not null,
  category    text,
  excerpt     text,
  content     text        not null,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
alter table public.posts enable row level security;
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- 3) 비상주/입주 고객 (customers) ------------------------------------------
create table if not exists public.customers (
  id          bigint generated always as identity primary key,
  name        text        not null,
  phone       text,
  email       text,
  plan        text,                       -- 비상주 / 고정석 / 고정실 등
  monthly_fee integer     not null default 0,
  status      text        not null default '이용중', -- 이용중 / 해지 / 대기
  start_date  date,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists customers_created_at_idx on public.customers (created_at desc);
alter table public.customers enable row level security;
drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

-- 4) 계약·결제 (payments) ---------------------------------------------------
create table if not exists public.payments (
  id            bigint generated always as identity primary key,
  customer_id   bigint references public.customers(id) on delete set null,
  customer_name text,
  amount        integer     not null default 0,
  method        text,                     -- 카드 / 계좌이체 / 현금
  paid_at       date        not null default current_date,
  note          text,
  created_at    timestamptz not null default now()
);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc);
alter table public.payments enable row level security;

-- ===========================================================
-- 보안
--  · 서버(FastAPI)는 service_role 키로 접근해 RLS를 우회합니다.
--  · anon/authenticated 역할에는 정책을 부여하지 않아 브라우저 직접 접근 불가.
--  · 관리자 로그인은 Supabase Auth 사용 → 관리자 계정을
--    Supabase Dashboard(Authentication → Users)에서 생성하세요.
--  · (선택) ADMIN_EMAIL 환경변수로 특정 이메일만 관리자 허용.
-- ===========================================================
