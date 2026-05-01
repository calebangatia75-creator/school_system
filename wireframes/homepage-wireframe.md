CBC School Homepage Wireframe (Refined)

Purpose
Define the homepage structure, content hierarchy, and responsive behavior with the final refinement notes applied.

Primary Breakpoints
Mobile: <640px
Tablet: 640-1024px
Desktop: >1024px

Grid
Desktop: 12-column grid with 80px max gutter
Tablet: 8-column grid with 24px gutter
Mobile: 4-column grid with 16px gutter

Top-Level Layout Order
1. Header
2. Announcement Bar (sticky, dismissible)
3. Hero
4. Trust Bar (affiliations)
5. Main Content Grid (News, Events, Achievements + Sidebar)
6. School at a Glance (5 stats)
7. CBC Pathway Visualizer
8. Success Stories
9. Co-Curricular Showcase
10. CTA Band
11. Footer

Wireframe Sketch (Desktop, not to scale)
------------------------------------------------------------
Header: Logo | Nav (active) | Quick Links
------------------------------------------------------------
Sticky Announcement Bar [Dismiss]
------------------------------------------------------------
Hero: Headteacher Note | CTAs | Social Proof
Media: Student photo/video
------------------------------------------------------------
Trust Bar: TSC | Ministry of Education | KPSA
------------------------------------------------------------
Main Grid: 70/30 split
Left: News Cards | Events | Achievements
Right: Notices | Dates | Downloads | Contacts
------------------------------------------------------------
School at a Glance: 5 Stats
------------------------------------------------------------
CBC Pathway Visualizer (Learning Road)
------------------------------------------------------------
Success Stories
------------------------------------------------------------
Co-Curricular + View All Activities
------------------------------------------------------------
CTA Band (Primary + Secondary + Secondary)
------------------------------------------------------------
Footer
------------------------------------------------------------

Section Specifications

1. Header
- Active state indicator for current page: underline or pill; keep consistent across nav.
- Desktop layout: Logo left, primary nav center, quick links right.
- Mobile layout: Logo left, hamburger right, quick links inside menu.
- Quick links: Parent Portal, Pay Fees, Calendar, Contact.

2. Announcement Bar
- Sticky at top on scroll.
- Dismissible with "Don’t show again for 24 hours" option.
- Persistence: use local storage key `cbc_announce_dismissed_at`.
- Content: one critical alert plus a short secondary link.

3. Hero
- Left: Headteacher welcome, one-sentence school promise, two CTAs.
- CTAs: Primary "Enroll Now", Secondary "Download Prospectus".
- Social proof microcopy below CTAs: "Trusted by 500+ families since 2010".
- Right: Photo or short loop video of students in action.
- Info chips below hero text: Current term, next event, admissions status.

4. Trust Bar
- Placement: between Hero and Main Grid.
- Logos: TSC, Ministry of Education, Kenya Private Schools Association.
- Treatment: monochrome or muted to avoid overpowering hero.

5. Main Content Grid
Layout behavior
Desktop: 70/30 split.
Tablet: test 50/50; if cramped, collapse sidebar below main content.
Mobile: stacked; sidebar appears after main content.

Left Column
- Latest News: cards with image, date, title, excerpt, and category tag.
- Category tags: Academic, Sports, Events.
- Upcoming Events: list view with toggle to mini calendar.
- Recent Achievements: 3 highlight cards.

Right Sidebar
- Quick Notices with urgency labels.
- Urgency label hierarchy:
Urgent: red
Important: amber
General: neutral
- Important Dates: upcoming exams, holidays, deadlines.
- Downloads: include file type and size, for example "Term Dates (PDF, 245KB)".
- Quick Contacts: phone, email, map snippet.

6. School at a Glance
- Stats: Students, Teachers, Years Established, Alumni, Student:Teacher Ratio.
- Animated counters on scroll.

7. CBC Pathway Visualizer
- Reference detailed spec in `cbc-pathway-visualizer.md`.

8. Success Stories
- 2 parent testimonials.
- 2 student achievements.
- 1 graduate spotlight with placement info.

9. Co-Curricular Showcase
- Three columns: Sports, Clubs, Talent.
- Add "View All Activities" link to avoid dead-end.

10. CTA Band
- One primary CTA: "Schedule a School Tour".
- Two secondary CTAs: "Download Admission Forms", "Contact Us".
- Visual hierarchy: primary button filled, secondary outlined.

11. Footer
- Quick links.
- Contact info and map.
- Social links.
- Newsletter signup.
- Policies.

Responsive Behavior Notes
- Header: on mobile, nav collapses to hamburger with active state retained.
- Announcement bar: single line on desktop, collapsible on mobile.
- Main grid: tablet uses 50/50; if text wraps excessively, collapse sidebar.
- Pathway visualizer: switches to vertical accordion on mobile.

Content Tokens (Starter Copy)
- Hero promise: "A caring CBC school where every learner is seen and supported."
- Hero chip examples: "Term 2, 2026", "Next Event: Mid-Term Break", "Admissions Open".
- Trust bar label: "Registered and recognized by".
