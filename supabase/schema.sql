-- Shekinah School Portal Schema
create extension if not exists "pgcrypto";

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text default 'Shekinah School',
  location text default 'Kimilili, Bungoma',
  curricula text[] default array['CBC', '8-4-4'],
  enable_844 boolean default true,
  motto text,
  contact_email text,
  contact_phone text,
  created_at timestamp default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role text check (role in ('admin', 'bursar', 'teacher', 'parent', 'student')) not null,
  avatar_url text,
  created_at timestamp default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  admission_number text unique not null,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female')) not null,
  curriculum text check (curriculum in ('CBC', '8-4-4')) not null,
  grade_level text not null,
  stream text,
  day_or_boarding text check (day_or_boarding in ('day', 'boarding')) not null,
  parent_id uuid references profiles(id),
  class_teacher_id uuid references profiles(id),
  photo_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  enrollment_date date,
  status text check (status in ('active', 'transferred', 'graduated', 'withdrawn')) default 'active',
  created_at timestamp default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  grade_level text not null,
  stream text,
  curriculum text check (curriculum in ('CBC', '8-4-4')) not null,
  class_teacher_id uuid references profiles(id),
  year int not null,
  created_at timestamp default now()
);

create table if not exists teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references profiles(id) not null,
  class_id uuid references classes(id) not null,
  subject text not null,
  created_at timestamp default now()
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) not null,
  date date not null,
  status text check (status in ('present', 'absent', 'late', 'excused')) not null,
  marked_by uuid references profiles(id),
  notes text,
  created_at timestamp default now()
);

create unique index if not exists attendance_unique on attendance (student_id, date);

create table if not exists homework (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text not null,
  grade_level text not null,
  stream text,
  due_date date,
  attachments text[],
  created_by uuid references profiles(id) not null,
  created_at timestamp default now()
);

create table if not exists homework_completions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid references homework(id) not null,
  student_id uuid references students(id) not null,
  completed_at timestamp default now()
);

create unique index if not exists homework_completions_unique on homework_completions (homework_id, student_id);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) not null,
  subject text not null,
  competency text not null,
  rating text check (rating in ('Exceeding', 'Meeting', 'Approaching', 'Below')) not null,
  evidence_urls text[],
  teacher_notes text,
  assessed_by uuid references profiles(id) not null,
  assessed_at timestamp default now(),
  term text not null,
  year int not null
);

create table if not exists results_844 (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) not null,
  subject text not null,
  score int check (score >= 0 and score <= 100) not null,
  grade text not null,
  term text not null,
  year int not null,
  created_by uuid references profiles(id) not null,
  created_at timestamp default now()
);

create table if not exists fee_structures (
  id uuid primary key default gen_random_uuid(),
  grade_level text not null,
  day_or_boarding text check (day_or_boarding in ('day', 'boarding')) not null,
  amount decimal(10,2) not null,
  year int not null,
  term text not null,
  created_by uuid references profiles(id) not null,
  created_at timestamp default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) not null,
  amount decimal(10,2) not null,
  due_date date,
  description text,
  status text check (status in ('pending', 'partial', 'paid', 'overdue')) default 'pending',
  created_by uuid references profiles(id) not null,
  created_at timestamp default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) not null,
  amount decimal(10,2) not null,
  method text check (method in ('cash', 'bank_transfer', 'mpesa', 'cheque')) not null,
  reference_number text,
  paid_by text,
  recorded_by uuid references profiles(id) not null,
  notes text,
  created_at timestamp default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target_roles text[],
  target_grades text[],
  priority text check (priority in ('low', 'normal', 'high', 'urgent')) default 'normal',
  posted_by uuid references profiles(id) not null,
  expires_at timestamp,
  created_at timestamp default now()
);

create table if not exists announcement_reads (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid references announcements(id) not null,
  user_id uuid references profiles(id) not null,
  read_at timestamp default now()
);

create unique index if not exists announcement_reads_unique on announcement_reads (announcement_id, user_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) not null,
  recipient_id uuid references profiles(id) not null,
  subject text,
  body text not null,
  read_at timestamp,
  created_at timestamp default now()
);

create table if not exists parent_accounts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  pin_hash text not null,
  pin_salt text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Helper functions
create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = role_name
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.has_role('admin');
$$;

create or replace function public.is_bursar()
returns boolean
language sql
stable
as $$
  select public.has_role('bursar') or public.has_role('admin');
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
as $$
  select public.has_role('teacher');
$$;

create or replace function public.teacher_has_class(p_grade text, p_stream text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from teacher_assignments ta
    join classes c on c.id = ta.class_id
    where ta.teacher_id = auth.uid()
      and c.grade_level = p_grade
      and (c.stream is null or c.stream = p_stream)
  );
$$;

-- RLS
alter table profiles enable row level security;
alter table students enable row level security;
alter table classes enable row level security;
alter table teacher_assignments enable row level security;
alter table attendance enable row level security;
alter table homework enable row level security;
alter table homework_completions enable row level security;
alter table assessments enable row level security;
alter table results_844 enable row level security;
alter table fee_structures enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table announcements enable row level security;
alter table messages enable row level security;
alter table schools enable row level security;
alter table announcement_reads enable row level security;
alter table parent_accounts enable row level security;

-- Profiles policies
create policy "profiles self read"
  on profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles self update"
  on profiles for update
  using (id = auth.uid() or public.is_admin());

create policy "profiles self insert"
  on profiles for insert
  with check (id = auth.uid());

-- Schools policies
create policy "schools read"
  on schools for select
  using (true);

create policy "schools admin write"
  on schools for all
  using (public.is_admin())
  with check (public.is_admin());

-- Students policies
create policy "students admin write"
  on students for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "students parents read"
  on students for select
  using (parent_id = auth.uid());

create policy "students teacher read"
  on students for select
  using (public.teacher_has_class(grade_level, stream));

-- Classes policies
create policy "classes admin write"
  on classes for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "classes teacher read"
  on classes for select
  using (public.is_teacher());

-- Teacher assignments policies
create policy "assignments admin write"
  on teacher_assignments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "assignments teacher read"
  on teacher_assignments for select
  using (teacher_id = auth.uid() or public.is_admin());

-- Attendance policies
create policy "attendance teacher write"
  on attendance for all
  using (public.is_teacher() or public.is_admin())
  with check (public.is_teacher() or public.is_admin());

create policy "attendance parent read"
  on attendance for select
  using (
    student_id in (select id from students where parent_id = auth.uid())
  );

-- Homework policies
create policy "homework teacher write"
  on homework for all
  using (public.is_teacher() or public.is_admin())
  with check (public.is_teacher() or public.is_admin());

create policy "homework parent read"
  on homework for select
  using (
    exists (
      select 1 from students s
      where s.parent_id = auth.uid()
        and s.grade_level = homework.grade_level
        and (homework.stream is null or homework.stream = s.stream)
    )
  );

create policy "homework completions parent"
  on homework_completions for all
  using (
    exists (
      select 1 from students s
      where s.parent_id = auth.uid() and s.id = homework_completions.student_id
    )
  )
  with check (
    exists (
      select 1 from students s
      where s.parent_id = auth.uid() and s.id = homework_completions.student_id
    )
  );

-- Assessments policies
create policy "assessments teacher write"
  on assessments for all
  using (public.is_teacher() or public.is_admin())
  with check (public.is_teacher() or public.is_admin());

create policy "assessments parent read"
  on assessments for select
  using (
    student_id in (select id from students where parent_id = auth.uid())
  );

-- 8-4-4 results policies
create policy "results teacher write"
  on results_844 for all
  using (public.is_teacher() or public.is_admin())
  with check (public.is_teacher() or public.is_admin());

create policy "results parent read"
  on results_844 for select
  using (
    student_id in (select id from students where parent_id = auth.uid())
  );

-- Finance policies
create policy "fee_structures bursar write"
  on fee_structures for all
  using (public.is_bursar())
  with check (public.is_bursar());

create policy "fee_structures read"
  on fee_structures for select
  using (true);

create policy "invoices bursar write"
  on invoices for all
  using (public.is_bursar())
  with check (public.is_bursar());

create policy "invoices parent read"
  on invoices for select
  using (
    student_id in (select id from students where parent_id = auth.uid())
  );

create policy "payments bursar write"
  on payments for all
  using (public.is_bursar())
  with check (public.is_bursar());

create policy "payments parent read"
  on payments for select
  using (
    invoice_id in (
      select id from invoices where student_id in (select id from students where parent_id = auth.uid())
    )
  );

-- Announcements policies
create policy "announcements admin write"
  on announcements for all
  using (public.is_admin() or public.is_bursar())
  with check (public.is_admin() or public.is_bursar());

create policy "announcements read"
  on announcements for select
  using (
    public.is_admin() or public.is_bursar()
    or
    (target_roles is null or exists (
      select 1 from profiles p where p.id = auth.uid() and p.role = any (target_roles)
    ))
    and
    (
      target_grades is null
      or exists (
        select 1 from students s
        where s.parent_id = auth.uid()
          and s.grade_level = any (target_grades)
      )
      or exists (
        select 1
        from teacher_assignments ta
        join classes c on c.id = ta.class_id
        where ta.teacher_id = auth.uid()
          and c.grade_level = any (target_grades)
      )
    )
  );

create policy "announcement_reads owner"
  on announcement_reads for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "parent_accounts admin read"
  on parent_accounts for select
  using (public.is_admin());

-- Messages policies\ncreate policy "messages sender or recipient"\n  on messages for select\n  using (sender_id = auth.uid() or recipient_id = auth.uid());\n\ncreate policy "messages insert sender"\n  on messages for insert\n  with check (sender_id = auth.uid());\n\n-- NEW TABLES FOR PIVOT\n\ncreate table if not exists leads (\n  id uuid primary key default gen_random_uuid(),\n  parent_name text,\n  phone text unique not null,\n  child_name text,\n  grade text,\n  prev_school text,\n  docs_url text[],\n  source text default \'whatsapp\',\n  status text check (status in (\'new\', \'contacted\', \'documents\', \'enrolled\', \'rejected\')) default \'new\',\n  created_at timestamp default now()\n);\n\nalter table leads enable row level security;\n\ncreate policy "leads admin full access"\n  on leads for all\n  using (public.is_admin())\n  with check (public.is_admin());\n\ncreate policy "leads read public"\n  on leads for select\n  using (true);\n\n-- Announcements already exists, add delivery_status\nalter table announcements add column if not exists delivery_status text check (delivery_status in (\'sent\', \'delivered\', \'failed\'));\n\nalter table announcements add column if not exists recipients_count int default 0;\n\nalter table announcements add column if not exists channel text check (channel in (\'sms\', \'whatsapp\'));\n\n-- Update RLS for announcements to allow admin status updates\ncreate policy "announcements admin full"\n  on announcements for all\n  using (public.is_admin())\n  with check (public.is_admin());
