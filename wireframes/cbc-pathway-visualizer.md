CBC Pathway Visualizer (Learning Road) Spec

Purpose
Create a signature CBC pathway section that explains progression and invites action, with a journey metaphor and mobile-friendly interaction.

Visual Metaphor
Learning Road with four milestones.
Milestones: Pre-Primary (PP1-PP2), Lower Primary (G1-3), Upper Primary (G4-6), Junior Secondary (G7-9).

Default State
- Show full road with four milestones and short taglines.
- If logged in and a learner is detected, display "Your child is here" marker on the current stage.

Interaction States
- Hover or tap: milestone expands and reveals core subjects and outcomes.
- Click: slide panel opens from the right on desktop, bottom sheet on tablet.
- Mobile: vertical accordion replaces the road; each stage expands inline.

Icons and Illustrations
- Pre-Primary: book icon.
- Lower Primary: pencil icon.
- Upper Primary: microscope icon.
- Junior Secondary: laptop icon.

Panel Content Structure
Per level panel
1. Header: level name, grade range, icon.
2. Core subjects badges: 3-4 badges.
3. Outcomes: "In this stage, your child will..." with 3 bullets.
4. Assessment style: one short sentence.
5. Optional: sample weekly timetable snippet.
6. Teacher quote or student work sample.
7. CTAs: "See full curriculum guide" (PDF) and "Book a visit".

Sample Content (Level Cards)

Pre-Primary (PP1-PP2)
Tagline: "Curiosity, play, and foundational skills."
Core subjects: Literacy, Numeracy, Creative Arts, Environmental Activities.
Outcomes:
- Build confidence in communication.
- Develop fine motor skills through guided play.
- Form positive routines and classroom habits.
Assessment: Continuous observation and learning portfolios.
Teacher quote: "We celebrate every small milestone, every day."

Lower Primary (Grade 1-3)
Tagline: "Strong basics and joyful learning."
Core subjects: English, Kiswahili, Mathematics, Environmental Activities.
Outcomes:
- Read and write with growing fluency.
- Build number sense and problem-solving skills.
- Collaborate and share ideas respectfully.
Assessment: Short competency tasks and teacher-led check-ins.
Teacher quote: "We help learners discover how they learn best."

Upper Primary (Grade 4-6)
Tagline: "Exploration, skills, and independence."
Core subjects: English, Science and Technology, Social Studies, Agriculture.
Outcomes:
- Apply skills to real-life projects.
- Research, present, and reflect.
- Take responsibility for learning routines.
Assessment: Projects, presentations, and competency rubrics.
Teacher quote: "We guide learners to think beyond the classroom."

Junior Secondary (Grade 7-9)
Tagline: "Pathway readiness and identity."
Core subjects: Integrated Science, Pre-Technical Studies, Humanities, ICT.
Outcomes:
- Explore career-aligned interests.
- Collaborate on complex tasks.
- Build a strong academic and personal voice.
Assessment: Performance-based tasks and reflective journals.
Teacher quote: "We prepare students for confident choices ahead."

Responsive Behavior
- Desktop: horizontal road with milestones; slide panel from right.
- Tablet: horizontal road with bottom-sheet panel; if space tight, switch to vertical list.
- Mobile: accordion with each stage as a stacked card; icons shown beside headings.

Accessibility
- Keyboard navigation for milestones.
- Visible focus state on active milestone.
- Contrast-compliant text for badges.

Micro-Interactions
- Progress line animates left-to-right on load.
- Milestone expands with 200-250ms ease-out.
- Panel opens with 300ms slide or bottom-sheet.
