# SPARK — MVP Build Specification
**For an autonomous build agent (e.g. Antigravity). Read this entire document before writing any code.**

---

## 0. Rules for the build agent — read first

1. **Follow this document in order.** Do not reorder phases, do not skip a feature because it seems optional, do not add a feature that isn't listed here. If you think something is missing, add it to a `NOTES.md` file instead of building it — do not silently expand scope.
2. **Do not hallucinate packages, APIs, or config.** Only use the exact libraries and versions named in Section 2. If you are unsure whether something exists or works a certain way, check the installed package's own docs/types in `node_modules`, don't guess from memory.
3. **Build in the phase order in Section 8.** After finishing each phase, run the "Definition of Done" checklist for every feature in that phase before moving to the next phase. If a check fails, fix it before continuing — do not move on with a known-broken feature.
4. **Every feature must actually work when clicked through in a browser**, not just compile. "It builds with no errors" is not the bar. "I clicked every button in this feature and it did what the spec says" is the bar.
5. **Use seed data.** This is a demo for judges, not a production launch. Every screen must look populated and alive on first load — never an empty state during a demo. Seed data requirements are in Section 7.
6. **No placeholder Lorem Ipsum, no "Feature coming soon," no dead links.** If something isn't being built in this MVP, it should not appear in the UI at all.
7. **Keep a running `BUILD_LOG.md`** — one line per feature, timestamped, noting what was built and what was tested. This is proof of process, and the team will show it to judges alongside the working app.
8. **If a step is genuinely blocked** (a free-tier limit, a package that doesn't do what's expected), write the blocker and your workaround into `NOTES.md` and proceed with the best available substitute — never stop silently.

---

## 1. Product brief

**Spark** helps students find their actual crowd for whatever they're genuinely into — web dev, poetry, cybersecurity, anything — instead of being stuck with whoever their exam rank and hostel room happened to assign them. Students answer a short onboarding, get matched into open interest **Communities** they can join as many of as they want, and a small trusted **Circle** (5–8 people) quietly forms inside each one where the real relationships happen. Consistent engagement moves students up a **tier ladder** toward a small, cross-India **National Guild** of the most dedicated people in that interest — regardless of college or marks. One clean **Opportunities feed** surfaces real hackathons, competitions, and events per interest. Universities get an aggregate dashboard showing where their strongest students actually are.

**This MVP's single job:** prove the core loop — onboarding → community/circle match → tier progress → opportunities — works, looks credible, and feels distinct, so judges believe this is a real product, not a slide deck.

---

## 2. Tech stack — locked, do not substitute

All free tier, no credit card required to sign up, fast to stand up in one session.

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) + React | `npx create-next-app@latest` |
| Styling | **Tailwind CSS** | No component library on top (e.g. no shadcn) — the design system in Section 3 is custom, so a generic component kit will fight it |
| Backend / DB / Auth / Realtime | **Supabase** (free project) | Postgres DB, built-in email auth, Realtime for circle chat. Free tier, no card required. |
| Hosting | **Vercel** (free Hobby tier) | Connect GitHub repo, auto-deploy. No card required. |
| Charts (admin dashboard) | **Recharts** | Free, lightweight |
| Icons | **Lucide React** | Free, consistent stroke style |
| Fonts | **Google Fonts**, self-hosted via `next/font` | Exact families in Section 3 |
| Animation | **Framer Motion** | Used sparingly per Section 3 — not on every element |
| Illustration | **Custom-coded SVG only** (see Section 3 signature element) | No AI-generated images, no generic stock illustration packs (e.g. undraw-style people). If a photo is ever needed, use a real Unsplash source image, not a generated one. |

Do not introduce: payment processing, third-party auth providers beyond Supabase email auth, any paid API, any package that requires a credit card at any tier.

---

## 3. Design system — this is not generic-AI-SaaS, follow exactly

The most common "AI-generated" look right now is either (a) cream background + serif display + terracotta accent, or (b) near-black + one neon accent, or (c) broadsheet newspaper columns. **Spark uses none of these.** The direction below is specific to the subject: late-night thinking, small circles of light in a big dark system, a personal "fingerprint" made visible.

### Color tokens
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0F1024` | Primary background — deep indigo-black, not pure black |
| `ink-raised` | `#181A38` | Cards, panels, raised surfaces |
| `paper` | `#F6F4FF` | Light-mode background / text-on-dark |
| `ember` | `#FF7A45` | Primary accent — warm, energetic, used for CTAs and the "spark" motif only |
| `signal` | `#7CF5D6` | Secondary accent — cool mint-cyan, used for tier progress and success states |
| `violet-mist` | `#8C87F2` | Tertiary — used only for Circle-related UI, to visually distinguish Circles from Communities |

Rule: **ember** appears only on primary actions and the literal spark/flame motif — never as a background wash. This keeps it feeling earned, not decorative.

### Typography
- **Display face:** `Space Grotesk` (700/500) — used for headlines, tier names, big numbers. Slightly technical, slightly warm — not a generic humanist sans, not a cream-aesthetic serif.
- **Body face:** `General Sans` (via Fontshare, or `Inter` as fallback if unavailable) — clean, quiet, does not compete with Space Grotesk.
- **Utility/mono face:** `JetBrains Mono` (500) — used only for tags, skill-level labels, and tier codes (e.g. `TIER_02 · REGIONAL`), never for body copy. This gives the interface a "logged, tracked" feeling appropriate to a platform about progress.

### Layout concept
- Landing page hero is **asymmetric**, not centered: headline and CTA sit left-aligned in the top-left two-thirds, and the right third is occupied by the signature Constellation element (below), which is large, slightly overflows its container, and is the first thing the eye catches.
- App shell (post-login) uses a **left rail nav** (icons + labels, collapsible on mobile to a bottom bar), not a top nav bar — this frees full width for community/circle content, which is text- and card-heavy.
- Cards throughout use **1px hairline borders in a lightened ink tone**, not drop shadows — shadows read as generic-SaaS; hairlines read as intentional and technical.

### Signature element — the Constellation
Every student's onboarding answers generate a small, unique **node-and-line constellation graphic**: each answer becomes a node, node size reflects how the answer scored on engagement/depth, and lines connect nodes whose underlying axes are close together (visually, this is literally their "fingerprint" made visible — nodes in `ember`, `signal`, and `violet-mist`, lines at low opacity in `paper`). This exact motif appears in three places and nowhere else, so it stays a signature rather than becoming wallpaper:
1. Large and animated on the landing page hero (a generic/sample constellation, gently animating — nodes drift slightly, lines fade in on load).
2. On the student's own Fingerprint Result screen right after onboarding (their real, generated one).
3. Small and static as a personal "seal" icon next to a student's name in Circle chat headers.

Build this as inline SVG generated from data (node positions from a deterministic layout function, e.g. force-simulated or simple radial placement seeded from the student's answers) — not an image, not AI-generated art.

### Motion
- One orchestrated load sequence on the landing page hero (constellation nodes fade/drift in, headline text reveals with a slight upward motion, staggered ~80ms per line). Nothing else on the landing page animates on scroll — restraint matters more than coverage.
- Inside the app: only hover/press micro-interactions on buttons and cards (subtle scale/opacity, ~150ms), and a satisfying but brief animation when a student is promoted a tier (confetti-free — use the constellation motif itself pulsing once in `signal` color). No page-transition animations, no auto-playing background effects inside the app shell — this is a tool people will use often, not a one-time landing experience.

### Voice and copy
- Second person, active voice, plain verbs. "Find your circle," not "Discover curated communities tailored to you."
- Tier names are literal and a little proud, not cutesy: **Starter Pod → Home Circle → Regional Circle → National Guild.**
- Empty states are invitations, not apologies: e.g. an empty Circle chat says "Say the first thing — someone here is thinking about the same thing you are," not "No messages yet."
- Never use the words "revolutionary," "seamless," "empower," "unlock your potential," or any generic startup-copy filler. Every sentence should sound like it was written by someone who actually felt the problem.

---

## 4. Information architecture

```
/                          Landing page (public)
/login, /signup            Auth
/onboarding                Curiosity & skill fingerprint questionnaire
/onboarding/result         Fingerprint result + constellation reveal
/communities               Browse & join communities (grid, filter by tag)
/communities/[slug]        Single community: feed, members, resources, events
/circle                    The student's active Circle (chat + shared workspace)
/journey                   Tier progress visual (Starter Pod → National Guild)
/opportunities             Unified opportunities feed, filterable by interest
/profile                   Student's own profile, constellation seal, settings
/admin                     University admin dashboard (separate login role)
```

Left rail nav (post-login): Communities · My Circle · Journey · Opportunities · Profile.

---

## 5. Data model (Supabase / Postgres)

```sql
-- Students
users (
  id uuid primary key,
  email text unique,
  display_name text,
  university_id uuid references universities,
  created_at timestamp,
  onboarding_complete boolean default false
)

universities (
  id uuid primary key,
  name text,
  domain text -- e.g. "college.edu.in", used for signup matching
)

-- Onboarding answers, one row per question per user
fingerprint_answers (
  id uuid primary key,
  user_id uuid references users,
  question_id text,       -- e.g. "q1_interest_freeform"
  answer_text text,
  created_at timestamp
)

-- Derived profile, computed after onboarding
fingerprint_profile (
  user_id uuid primary key references users,
  primary_interest text,       -- e.g. "web-dev", "poetry", "cybersecurity"
  secondary_interests text[],  -- multi-interest support
  skill_level text,            -- "beginner" | "building" | "mentor" (skill-based interests only)
  axis_scores jsonb,           -- { depth_first: 0.7, socratic: 0.4, ... }
  constellation_seed jsonb     -- data used to deterministically render their constellation SVG
)

communities (
  id uuid primary key,
  slug text unique,
  name text,
  tag text,             -- "web-dev", "poetry", "cybersecurity", etc.
  description text,
  cover_accent text     -- one of the design token colors, for visual variety per community
)

community_memberships (
  user_id uuid references users,
  community_id uuid references communities,
  joined_at timestamp,
  primary key (user_id, community_id)
)

circles (
  id uuid primary key,
  community_id uuid references communities,
  tier text,          -- "starter_pod" | "home_circle" | "regional_circle" | "national_guild"
  created_at timestamp
)

circle_memberships (
  user_id uuid references users,
  circle_id uuid references circles,
  joined_at timestamp,
  primary key (user_id, circle_id)
)

circle_messages (
  id uuid primary key,
  circle_id uuid references circles,
  user_id uuid references users,
  content text,
  created_at timestamp
)

engagement_scores (
  user_id uuid references users,
  circle_id uuid references circles,
  week_start date,
  score numeric,       -- computed weekly, drives tier promotion (see Section 6.8)
  primary key (user_id, circle_id, week_start)
)

opportunities (
  id uuid primary key,
  title text,
  org_name text,
  tag text,             -- matches communities.tag for filtering
  type text,             -- "hackathon" | "workshop" | "competition" | "internship" | "meetup"
  url text,
  event_date date,
  is_expired boolean default false
)
```

---

## 6. Feature specifications

Each feature below must be built exactly as described, and the **Definition of Done** must pass before moving on.

### 6.1 Landing page (`/`)
**What it does:** Tells the Spark story in one scroll, gets a student to sign up.

**Sections, top to bottom:**
1. Hero: asymmetric layout per Section 3, animated constellation, headline (e.g. "Find the crowd that gets it."), one-line subhead naming the real problem, single primary CTA button ("Get started").
2. Problem section: 3 short, specific statements about the "no crowd for my interest" problem (not generic stat cards — write real sentences).
3. How it works: 4 steps (Answer a few questions → Join your communities → Your circle finds you → Grow toward the National Guild), presented as a horizontal sequence, each with a small icon, not a numbered generic 01/02/03 unless genuinely presented as a sequence (it is here, so numbering is appropriate).
4. Interest showcase: a horizontal scroll or grid of 8–10 real community cards (Web Dev, Poetry, Cybersecurity, Design, Debate, Music Production, Robotics, Creative Writing, Data Science, Dance) each with its `cover_accent` color, to make the breadth concrete.
5. Footer CTA + minimal footer (no fake social links — only real ones if they exist, otherwise omit).

**Definition of Done:** Loads in under 2s locally, hero animation plays once on load, is fully responsive at 375px width, every visible link/button navigates somewhere real (no dead hrefs), Lighthouse accessibility score 90+.

### 6.2 Auth (`/signup`, `/login`)
**What it does:** Email-based signup/login via Supabase Auth. For the MVP demo, skip real domain verification against a live university system — instead, a dropdown of 3–5 seeded demo universities the student selects from at signup (this simulates the real "university partner" flow without needing live institutional integration).

**Definition of Done:** A new user can sign up with email + password, is redirected to `/onboarding` if `onboarding_complete = false`, and to `/communities` otherwise. Logging out and back in preserves session. Wrong password shows a clear inline error, not a console error.

### 6.3 Curiosity & skill onboarding (`/onboarding`)
**What it does:** A short, well-designed multi-step questionnaire — one question per screen, progress indicator at top, back/next navigation, feels considered rather than like a form.

**Questions (build exactly these 8, in this order):**
1. What could you talk about for three hours without getting bored? *(free text)*
2. What's a field you know nothing about but are drawn to understanding? *(free text)*
3. Pick your primary interest right now *(single-select from a fixed list matching `communities.tag`: Web Dev, Poetry, Cybersecurity, Design, Debate, Music Production, Robotics, Creative Writing, Data Science, Dance, Other)*
4. Anything else you're into? *(multi-select from the same list, optional, becomes `secondary_interests`)*
5. If your primary interest is skill-based (Web Dev, Cybersecurity, Design, Robotics, Data Science): "Where are you right now?" *(single-select: Just starting · Building real things · Could mentor others)*. If not skill-based, skip this question.
6. Would you rather go deep on one problem for a week, or touch five loosely related ideas? *(two-option select — feeds `axis_scores.depth_first`)*
7. When you're excited about an idea, do you want to talk it through immediately, or think it through alone first? *(two-option select — feeds `axis_scores.overt_social`)*
8. Do you care more about being right, or the conversation going somewhere interesting even if you're proven wrong? *(two-option select — feeds `axis_scores.truth_seeking`)*

**Logic:** On submit, write all answers to `fingerprint_answers`, compute a simple `fingerprint_profile` row (rule-based scoring is fine for MVP — do not attempt real embeddings/ML; e.g. `axis_scores` are just 0/1 or 0.5 defaults based on which option was picked), generate `constellation_seed` from the answers (deterministic — same answers always produce the same layout), set `onboarding_complete = true`, redirect to `/onboarding/result`.

**Definition of Done:** All 8 questions render correctly including the conditional skip on Q5, back button preserves previously entered answers, submitting with a required field empty shows inline validation (no silent failure), a completed onboarding is visible as new rows in `fingerprint_answers` and one row in `fingerprint_profile` in the Supabase table editor.

### 6.4 Fingerprint result (`/onboarding/result`)
**What it does:** The payoff moment — shows the student's real constellation graphic, their primary interest, skill level (if applicable), and 2–4 recommended communities (primary interest + any secondary interests, matched by tag), each with a "Join" button.

**Definition of Done:** Constellation renders using the actual `constellation_seed` from this student's answers (reload the page — it must render identically, proving it's deterministic, not random each time). Clicking "Join" on a recommended community creates a `community_memberships` row and visually confirms (button state changes to "Joined"). A "Continue to Spark" button proceeds to `/communities`.

### 6.5 Communities browse (`/communities`)
**What it does:** Grid of all communities, each a card with name, tag, member count, `cover_accent` color, and Join/Joined state. Filter/search by tag.

**Definition of Done:** All seeded communities render, join/leave works and persists on reload, filtering by tag correctly narrows the grid, a student can be a member of more than one community simultaneously (test by joining 3).

### 6.6 Single community (`/communities/[slug]`)
**What it does:** Community home — a simple text-post feed (members can post short updates, no images required for MVP), a member list, and an "Upcoming opportunities" mini-section pulling from `opportunities` filtered by this community's tag.

**Definition of Done:** Posting a new update appears instantly in the feed (Supabase Realtime subscription, not a manual page refresh), member list shows real joined members, opportunities mini-section shows only relevant, non-expired items.

### 6.7 Circle (`/circle`)
**What it does:** The student's current small-group chat. For MVP, auto-assign every new student to a `starter_pod` circle within their primary-interest community immediately after onboarding (seed enough dummy members so no circle ever looks empty — see Section 7). Real-time chat: send/receive text messages.

**Definition of Done:** Messages send and appear in real time without a page refresh (test with two browser sessions/incognito windows open simultaneously), message history persists and loads correctly on revisit, each message shows the sender's display name and small constellation seal icon, an empty-state message (per the voice guide in Section 3) shows only if a circle genuinely has zero messages.

### 6.8 Journey / tier progress (`/journey`)
**What it does:** A visual ladder showing Starter Pod → Home Circle → Regional Circle → National Guild, the student's current tier highlighted, and a simple, visible explanation of what moves someone up (consistent, substantive engagement — not marks, not college).

**Logic for MVP:** Do not build a real scheduled weekly-scoring job for the overnight build — instead, compute an `engagement_scores` value live from message count and average message length in `circle_messages` whenever this page loads, and use a simple fixed threshold to determine displayed tier. This is a legitimate simplification of the real product's weekly cron-based scorer — note this simplification explicitly in `NOTES.md`.

**Definition of Done:** Page correctly reflects a student's current tier based on their real message activity, sending several substantive messages and reloading the page visibly moves the progress indicator, the explanation copy matches the voice guide (no marks/college-based language).

### 6.9 Opportunities feed (`/opportunities`)
**What it does:** A filterable list of seeded opportunities (hackathons, workshops, competitions), filter by tag, each card shows title, organizer, type, date, and an outbound link.

**Definition of Done:** All seeded opportunities render with correct data, filtering by tag works, any opportunity with an `event_date` in the past is either hidden or clearly marked expired (never shown as if it's still open), external links open in a new tab.

### 6.10 University admin dashboard (`/admin`)
**What it does:** A separate, simply-gated view (a seeded demo admin login is fine — no need for real role-based auth infrastructure for MVP) showing aggregate stats only: total active students, students per interest tag (bar chart), a simple "circle health" percentage, and a list of communities by member count. **No individual student data or messages are ever shown here** — this must be genuinely true in the UI, not just claimed.

**Definition of Done:** Charts render real seeded data via Recharts, no student name, email, or message content appears anywhere on this route, numbers update if you seed additional students and reload.

### 6.11 App shell / navigation / responsiveness
**What it does:** Left rail nav (Section 3) present on every authenticated route, collapses to a bottom tab bar under 768px width, active route is visually indicated, logout available.

**Definition of Done:** Every authenticated page is reachable from the nav, nav collapses correctly on mobile viewport, no layout breaks or horizontal scroll at 375px, 768px, and 1440px widths.

---

## 7. Seed data requirements

The demo must never show an empty screen. Before building any feature UI, seed the database with:
- 5 universities (demo names, e.g. "Silver Oak Institute of Technology," fictional, not a real institution's name)
- 10 communities matching the tag list in Section 6.3, each with a short real description and distinct `cover_accent`
- 40–60 dummy student users spread across universities and communities (script this — do not hand-create)
- For each community, at least one pre-formed `starter_pod` circle with 4–6 dummy members and 15–25 realistic seeded chat messages showing genuine back-and-forth (write these messages to actually sound like students talking about the topic, not generic filler)
- 20 seeded opportunities across at least 6 different tags, roughly half with future dates and a few intentionally past-dated to test the expiry logic
- One seeded admin user for `/admin`

Write a single `seed.ts` (or `.sql`) script that populates all of this in one run, and note in `BUILD_LOG.md` when it's been run successfully.

---

## 8. Build order — follow this sequence, test-gate every phase

1. **Phase 0 — Setup:** Next.js + Tailwind scaffold, Supabase project created, environment variables wired, design tokens (Section 3) added to `tailwind.config`, fonts loading correctly. *Test: a styled "Hello Spark" page deploys successfully to Vercel.*
2. **Phase 1 — Data & seed:** Build the schema in Section 5, write and run the seed script from Section 7. *Test: query the Supabase table editor and confirm every table has realistic seeded rows.*
3. **Phase 2 — Auth:** Section 6.2. *Test: full signup → logout → login cycle works.*
4. **Phase 3 — Onboarding & result:** Sections 6.3 and 6.4, including the constellation SVG generator. *Test: complete onboarding twice with different answers, confirm two visually distinct, reproducible constellations.*
5. **Phase 4 — Communities:** Sections 6.5 and 6.6. *Test: join/leave multiple communities, post and see a realtime update.*
6. **Phase 5 — Circle:** Section 6.7. *Test: two-window realtime chat test.*
7. **Phase 6 — Journey:** Section 6.8. *Test: sending messages visibly changes tier state.*
8. **Phase 7 — Opportunities:** Section 6.9. *Test: filtering and expiry logic both work.*
9. **Phase 8 — Admin dashboard:** Section 6.10. *Test: confirm zero individual student data leaks onto this route.*
10. **Phase 9 — Landing page & app shell polish:** Sections 6.1 and 6.11, done last so the design system is already proven out inside the app before it's used on the marketing page. *Test: full responsive pass at 375 / 768 / 1440px.*
11. **Phase 10 — Final QA:** Run the entire checklist in Section 10 end to end as a first-time user, on a clean seeded database, before handing this back.

Do not begin a phase until the previous phase's tests pass.

---

## 9. Explicit non-goals — do not build these for this MVP

- Real end-to-end encryption for circle chat (roadmap item — architect the schema so it could be added later, but do not attempt it overnight)
- Real web scraping or third-party event API integrations (seeded data only, per Section 7)
- Real skill-verification (GitHub/portfolio linking) — the self-declared skill level in Q5 is sufficient
- A real weekly scheduled scoring job — the live-computed simplification in 6.8 is sufficient, and must be logged as a known simplification
- Payments, subscriptions, or any monetization flow
- Native mobile apps — responsive web only
- Real cross-university "National Guild" matching logic beyond simply displaying the tier name and explanation — no actual cross-institution circle needs to be functionally formed for this MVP
- Any AI-generated images or stock illustration packs

---

## 10. Final QA checklist before showing judges

- [ ] Fresh incognito session: sign up → onboarding → result → land in a populated app, no empty states
- [ ] Join 3 different communities, confirm all persist after logout/login
- [ ] Send messages in Circle chat from two separate sessions, confirm realtime delivery both ways
- [ ] Journey page reflects real activity, not a static number
- [ ] Opportunities feed filters correctly and never shows an expired item as active
- [ ] Admin dashboard shows only aggregate data — manually verify no student name/email/message appears anywhere on that route
- [ ] Full click-through on 375px (mobile) width with no broken layout
- [ ] No console errors on any route
- [ ] No Lorem Ipsum, no "coming soon," no dead links anywhere
- [ ] `BUILD_LOG.md` and `NOTES.md` are complete and readable — these are part of what gets shown to judges as proof of process

---

## 11. What to hand back

When complete, provide: the deployed Vercel URL, the GitHub repo link, `BUILD_LOG.md`, `NOTES.md`, and Supabase project access so the team can verify the seed data and continue building after the hackathon.
