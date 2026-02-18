-- Wedding Calendar 2026 — Budget Tracker Schema

-- budgets: overall budget cap per couple
create table budgets (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null unique,
  total_budget numeric(12,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- budget_categories: per-category estimated allocation
create table budget_categories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  category text not null,
  estimated_amount numeric(12,2) default 0,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(couple_id, category)
);

-- budget_expenses: individual expense line items
create table budget_expenses (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid references couples(id) on delete cascade not null,
  category text not null default 'miscellaneous',
  vendor_name text not null,
  description text,
  amount numeric(12,2) default 0,
  is_paid boolean default false,
  date date,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_budgets_couple on budgets(couple_id);
create index idx_budget_categories_couple on budget_categories(couple_id);
create index idx_budget_expenses_couple on budget_expenses(couple_id);

-- Enable RLS
alter table budgets enable row level security;
alter table budget_categories enable row level security;
alter table budget_expenses enable row level security;

-- RLS Policies: budgets (full CRUD for couple members)
create policy "Budgets are viewable by couple members"
  on budgets for select
  using (couple_id = get_my_couple_id());

create policy "Budgets are insertable by couple members"
  on budgets for insert
  with check (couple_id = get_my_couple_id());

create policy "Budgets are updatable by couple members"
  on budgets for update
  using (couple_id = get_my_couple_id());

create policy "Budgets are deletable by couple members"
  on budgets for delete
  using (couple_id = get_my_couple_id());

-- RLS Policies: budget_categories (full CRUD for couple members)
create policy "Budget categories are viewable by couple members"
  on budget_categories for select
  using (couple_id = get_my_couple_id());

create policy "Budget categories are insertable by couple members"
  on budget_categories for insert
  with check (couple_id = get_my_couple_id());

create policy "Budget categories are updatable by couple members"
  on budget_categories for update
  using (couple_id = get_my_couple_id());

create policy "Budget categories are deletable by couple members"
  on budget_categories for delete
  using (couple_id = get_my_couple_id());

-- RLS Policies: budget_expenses (full CRUD for couple members)
create policy "Budget expenses are viewable by couple members"
  on budget_expenses for select
  using (couple_id = get_my_couple_id());

create policy "Budget expenses are insertable by couple members"
  on budget_expenses for insert
  with check (couple_id = get_my_couple_id());

create policy "Budget expenses are updatable by couple members"
  on budget_expenses for update
  using (couple_id = get_my_couple_id());

create policy "Budget expenses are deletable by couple members"
  on budget_expenses for delete
  using (couple_id = get_my_couple_id());

-- Enable real-time for budget tables
alter publication supabase_realtime add table budgets;
alter publication supabase_realtime add table budget_categories;
alter publication supabase_realtime add table budget_expenses;
