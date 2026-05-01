# Shekinah School Portal

CBC-first school management platform for Shekinah School, Kimilili, Bungoma County. Supports CBC and transitional 8-4-4, with a focus on parent visibility, teacher tools, and bursar-led finance tracking.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn-style components
- Supabase (Auth, PostgreSQL, Storage)
- React Hook Form + Zod
- Recharts + jsPDF

## Getting Started
1. Install dependencies:
   - `npm install`
2. Create a `.env.local` file using `.env.example`.
3. Run the app:
   - `npm run dev`

## Supabase
- Schema and RLS policies are in `supabase/schema.sql`.
- Run the SQL in your Supabase SQL editor before starting.
- Create a public storage bucket named `school-media` for uploads.

## Demo Seed
Run `npm run seed` to create demo users, students, and finance records. This requires:
- `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Auth users will be created with password `Shekinah@2026`

## PWA Offline Mode
The app registers `public/sw.js` automatically. Core pages and static assets are cached for offline viewing.

## Roles
- Admin: full access
- Bursar: finance only
- Teacher: classes, attendance, homework, assessments
- Parent/Student: view-only dashboards

## Notes
- No on-site payments. Bursar records payments only.
- Announcements are in-app only (no SMS).
- CBC is the primary curriculum; 8-4-4 is transitional support.
