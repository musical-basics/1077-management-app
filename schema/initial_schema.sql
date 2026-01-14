-- 0. SETUP
-- Enable UUID generation (Standard for Supabase, but good to ensure)
create extension if not exists "uuid-ossp";

-- 1. USERS (Staff & Admins)
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  phone text unique, -- Critical for Twilio AI identification
  role text check (role in ('admin', 'assistant')),
  avatar_url text,
  hourly_rate_cents int, -- e.g., 2500 = $25.00/hr
  min_guarantee_minutes int default 120, -- The 2-hour minimum rule
  created_at timestamp with time zone default now()
);

-- 2. PROJECT TEMPLATES (The "SOP" Library)
-- These are your repeatable jobs (e.g., "Standard Clean", "Dog Walk")
create table project_templates (
  id uuid primary key default uuid_generate_v4(),
  title text, -- e.g., "Master Suite Turnover"
  description text,
  estimated_minutes int,
  -- Category helps the Finance Dashboard know where money is going
  category text check (category in ('cleaning', 'errands', 'admin', 'maintenance')) default 'cleaning',
  is_active boolean default true
);

-- 3. TEMPLATE TASKS (The Checklist Items inside a Template)
create table template_tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references project_templates(id),
  description text, -- e.g., "Fold towels swan-style"
  sort_order int default 0
);

-- 4. SHIFTS (The Schedule)
create table shifts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  project_template_id uuid references project_templates(id), -- Links shift to an SOP
  start_time timestamp with time zone,
  end_time_expected timestamp with time zone,
  status text check (status in ('draft', 'pending', 'confirmed', 'completed', 'cancelled')),
  briefing_notes text, -- Custom notes for this specific day
  ai_chat_log jsonb, -- Stores the SMS negotiation history
  created_at timestamp with time zone default now()
);

-- 5. SHIFT TASKS (The Actual To-Do List for a specific day)
-- When a shift is created, we copy 'template_tasks' into here
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  shift_id uuid references shifts(id),
  description text, 
  is_completed boolean default false,
  completed_at timestamp with time zone
);

-- 6. TIME_LOGS (The "Manual Entry" Data)
create table time_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  shift_id uuid references shifts(id),
  date_worked date default current_date,
  -- clock_in/out are optional/legacy now, we trust the duration
  clock_in timestamp with time zone, 
  clock_out timestamp with time zone,
  
  -- Payroll Data
  duration_minutes int not null, 
  payable_minutes int, -- Adjusted for the 2-hour minimum
  total_pay_cents int
);

-- 7. MESSAGES (The Unified Inbox)
create table messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id), -- The assistant involved
  direction text check (direction in ('inbound', 'outbound')), -- Inbound = from Assistant
  content text,
  is_ai_generated boolean default false, -- True = AI Agent, False = You typed it
  created_at timestamp with time zone default now()
);

-- 8. EXPENSES (Reimbursements)
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  description text not null, -- e.g., "Whole Foods Groceries"
  amount_cents int not null, 
  receipt_url text, -- Link to image
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  incurred_at timestamp with time zone default now()
);

-- ==========================================
-- ANALYTICS VIEWS (For your Dashboard KPIs)
-- ==========================================

-- View A: Staff Performance (On-Time Rates)
create or replace view view_staff_performance as
select 
  u.id as user_id,
  u.full_name,
  u.avatar_url,
  count(s.id) as total_shifts,
  -- Logic: Clocked in within 5 mins of start time = On Time
  round(
    (count(case when tl.clock_in <= s.start_time + interval '5 minutes' then 1 end)::numeric / 
    nullif(count(s.id), 0)::numeric) * 100, 
  1) as on_time_percentage
from users u
left join shifts s on u.id = s.user_id
left join time_logs tl on s.id = tl.shift_id
where s.status = 'completed'
group by u.id, u.full_name, u.avatar_url;

-- View B: Financial Breakdown by Category (Donut Chart)
create or replace view view_cost_by_category as
select 
  pt.category,
  sum(tl.total_pay_cents) as total_spend_cents
from time_logs tl
join shifts s on tl.shift_id = s.id
join project_templates pt on s.project_template_id = pt.id
where tl.clock_out is not null
group by pt.category;

-- View C: Daily Labor Cost Trend (Bar Chart - Last 30 Days)
create or replace view view_daily_labor_cost as
select 
  date_trunc('day', tl.clock_in) as work_date,
  sum(tl.total_pay_cents) as total_spend_cents
from time_logs tl
where tl.clock_in > now() - interval '30 days'
group by 1
order by 1 desc;
