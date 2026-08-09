export interface University {
  id: string;
  name: string;
  domain: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  university_id: string;
  created_at: string;
  onboarding_complete: boolean;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  cover_accent: string;
}

export interface Circle {
  id: string;
  community_id: string;
  tier: 'starter_pod' | 'home_circle' | 'regional_circle' | 'national_guild';
  created_at: string;
}

export interface CircleMessage {
  id: string;
  circle_id: string;
  user_id: string;
  user_display_name?: string;
  content: string;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  org_name: string;
  tag: string;
  type: 'hackathon' | 'workshop' | 'competition' | 'internship' | 'meetup';
  url: string;
  event_date: string;
  is_expired: boolean;
}

export const SEEDED_UNIVERSITIES: University[] = [
  { id: 'uni-1', name: 'Silver Oak Institute of Technology', domain: 'silveroak.edu.in' },
  { id: 'uni-2', name: 'Apex Institute of Science & Research', domain: 'apex.edu.in' },
  { id: 'uni-3', name: 'Vanguard University of Engineering', domain: 'vanguard.edu.in' },
  { id: 'uni-4', name: 'Horizon State Technological Institute', domain: 'horizon.edu.in' },
  { id: 'uni-5', name: 'Zenith College of Computer Applications', domain: 'zenith.edu.in' },
];

export const SEEDED_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    slug: 'web-dev',
    name: 'Web Engineering & Craft',
    tag: 'web-dev',
    description: 'Building fast, accessible, beautiful interfaces and robust distributed backend systems.',
    cover_accent: '#FF7A45',
  },
  {
    id: 'comm-2',
    slug: 'poetry',
    name: 'Modern Verse & Spoken Word',
    tag: 'poetry',
    description: 'Late-night stanza critiques, rhythm breakdowns, and vulnerable contemporary prose.',
    cover_accent: '#8C87F2',
  },
  {
    id: 'comm-3',
    slug: 'cybersecurity',
    name: 'Offensive & Defensive Security',
    tag: 'cybersecurity',
    description: 'CTF breakdown sessions, binary exploitation, network forensics, and zero-day defense.',
    cover_accent: '#7CF5D6',
  },
  {
    id: 'comm-4',
    slug: 'design',
    name: 'UI/UX & Visual Systems',
    tag: 'design',
    description: 'Micro-interaction design, spatial layouts, design tokens, and human-computer ergonomics.',
    cover_accent: '#FF7A45',
  },
  {
    id: 'comm-5',
    slug: 'debate',
    name: 'Parliamentary & Policy Debate',
    tag: 'debate',
    description: 'First-principles argumentation, economics analysis, and impromptu counter-arguments.',
    cover_accent: '#8C87F2',
  },
  {
    id: 'comm-6',
    slug: 'music-production',
    name: 'Audio Engineering & Beats',
    tag: 'music-production',
    description: 'FL Studio / Ableton sound design, mixing science, synth programming, and beatboxing.',
    cover_accent: '#7CF5D6',
  },
  {
    id: 'comm-7',
    slug: 'robotics',
    name: 'Autonomous Systems & Embedded C',
    tag: 'robotics',
    description: 'ESP32 microcontrollers, ROS2 navigation nodes, CAD modeling, and solder sessions.',
    cover_accent: '#FF7A45',
  },
  {
    id: 'comm-8',
    slug: 'creative-writing',
    name: 'Fiction & Narrative Worldbuilding',
    tag: 'creative-writing',
    description: 'Sci-fi short stories, character arc workshops, world maps, and daily prompt sprints.',
    cover_accent: '#8C87F2',
  },
  {
    id: 'comm-9',
    slug: 'data-science',
    name: 'Machine Learning & Applied AI',
    tag: 'data-science',
    description: 'Transformers, PyTorch model training, feature engineering, and kaggle sprint discussions.',
    cover_accent: '#7CF5D6',
  },
  {
    id: 'comm-10',
    slug: 'dance',
    name: 'Choreography & Movement Art',
    tag: 'dance',
    description: 'Urban choreography, freestyle cyphers, rhythm counting, and performance breakdown.',
    cover_accent: '#FF7A45',
  },
];

export const SEEDED_STUDENTS: UserProfile[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `usr-${i + 1}`,
  email: `student${i + 1}@${SEEDED_UNIVERSITIES[i % 5].domain}`,
  display_name: [
    'Aarav Sharma', 'Ananya Iyer', 'Rohan Verma', 'Isha Patel', 'Devansh Mehta',
    'Kavya Nair', 'Siddharth Rao', 'Priya Kulkarni', 'Aditya Joshi', 'Meera Kapoor',
    'Kabir Das', 'Diya Sengupta', 'Tanmay Pillai', 'Riya Bhatia', 'Arjun Reddy',
    'Sneha Jain', 'Vikram Choudhury', 'Anushree Saxena', 'Yash Gupta', 'Tara D’Souza',
    'Nikhil Bhatt', 'Pooja Deshmukh', 'Varun Menon', 'Shruti Ahuja', 'Karan Roy',
    'Rhea Malhotra', 'Sujay Banerjee', 'Nisha Thomas', 'Gaurav Aggarwal', 'Natasha Sen',
    'Pranav Hegde', 'Rishika Puri', 'Dhruv Rastogi', 'Adisree Kumar', 'Harsh Vora',
    'Bhavna Nambiar', 'Manav Dave', 'Trisha Grover', 'Manish Pandit', 'Simran Gill',
    'Omkar Fadnavis', 'Neelam Mahajan', 'Parth Shetty', 'Zoya Ansari', 'Chirag Sethi'
  ][i],
  university_id: SEEDED_UNIVERSITIES[i % 5].id,
  created_at: new Date(Date.now() - (45 - i) * 86400000).toISOString(),
  onboarding_complete: true,
}));

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-1',
  email: 'admin@spark.edu',
  display_name: 'Dr. Rajesh Swaminathan (Dean of Student Affairs)',
  university_id: SEEDED_UNIVERSITIES[0].id,
  created_at: new Date().toISOString(),
  onboarding_complete: true,
};

export const SEEDED_CIRCLES: Circle[] = SEEDED_COMMUNITIES.map((c, idx) => ({
  id: `circle-${c.tag}-1`,
  community_id: c.id,
  tier: idx % 3 === 0 ? 'starter_pod' : idx % 3 === 1 ? 'home_circle' : 'regional_circle',
  created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
}));

export const SEEDED_MESSAGES: Record<string, CircleMessage[]> = {
  'web-dev': [
    { id: 'm1', circle_id: 'circle-web-dev-1', user_id: 'usr-1', user_display_name: 'Aarav Sharma', content: 'Anyone playing around with Next.js 14 Server Actions vs API routes for mutations?', created_at: '2026-08-08T14:20:00Z' },
    { id: 'm2', circle_id: 'circle-web-dev-1', user_id: 'usr-2', user_display_name: 'Ananya Iyer', content: 'Server actions are super clean for forms, but I still prefer API routes when handling multi-stage auth callbacks or webhooks.', created_at: '2026-08-08T14:22:00Z' },
    { id: 'm3', circle_id: 'circle-web-dev-1', user_id: 'usr-3', user_display_name: 'Rohan Verma', content: 'Agreed! Also watch out for optimistic updates with useOptimistic. Once you get the state sync right, UI latency feels like zero.', created_at: '2026-08-08T14:25:00Z' },
    { id: 'm4', circle_id: 'circle-web-dev-1', user_id: 'usr-4', user_display_name: 'Isha Patel', content: 'Has anyone tested Tailwind v4 CSS variables theme setup on Safari mobile? Checking if safe area insets work properly.', created_at: '2026-08-08T14:30:00Z' },
    { id: 'm5', circle_id: 'circle-web-dev-1', user_id: 'usr-5', user_display_name: 'Devansh Mehta', content: 'Yep, just add env(safe-area-inset-bottom) to your app rail container. Works like a charm!', created_at: '2026-08-08T14:32:00Z' },
    { id: 'm6', circle_id: 'circle-web-dev-1', user_id: 'usr-1', user_display_name: 'Aarav Sharma', content: 'Thanks Devansh! Let us build a quick live demo component tonight to test it out.', created_at: '2026-08-08T15:00:00Z' },
  ],
  'cybersecurity': [
    { id: 'm7', circle_id: 'circle-cybersecurity-1', user_id: 'usr-6', user_display_name: 'Kavya Nair', content: 'Who is up for the HackTheBox weekend sprint? Targeting the pwn and reverse engineering track.', created_at: '2026-08-08T16:10:00Z' },
    { id: 'm8', circle_id: 'circle-cybersecurity-1', user_id: 'usr-7', user_display_name: 'Siddharth Rao', content: 'Count me in. I have Ghidra set up with custom scripts for gdb remote debugging.', created_at: '2026-08-08T16:15:00Z' },
    { id: 'm9', circle_id: 'circle-cybersecurity-1', user_id: 'usr-8', user_display_name: 'Priya Kulkarni', content: 'Make sure we review ROP gadget chains beforehand — last challenge required a 64-bit pivot.', created_at: '2026-08-08T16:20:00Z' },
    { id: 'm10', circle_id: 'circle-cybersecurity-1', user_id: 'usr-6', user_display_name: 'Kavya Nair', content: 'Awesome! Let us hop on a screen share at 9 PM after lab hours.', created_at: '2026-08-08T16:25:00Z' },
  ],
  'poetry': [
    { id: 'm11', circle_id: 'circle-poetry-1', user_id: 'usr-11', user_display_name: 'Kabir Das', content: 'Late night thought: "We build constellations in code because the sky in the city is too bright to read."', created_at: '2026-08-08T22:00:00Z' },
    { id: 'm12', circle_id: 'circle-poetry-1', user_id: 'usr-12', user_display_name: 'Diya Sengupta', content: 'Oh wow, Kabir. That contrast between electric light and digital light hits so hard.', created_at: '2026-08-08T22:05:00Z' },
    { id: 'm13', circle_id: 'circle-poetry-1', user_id: 'usr-13', user_display_name: 'Tanmay Pillai', content: 'Try breaking the line right after "code" — gives the word "constellations" more room to breathe.', created_at: '2026-08-08T22:12:00Z' },
  ],
};

export const SEEDED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'National Student Web Engineering Hackathon 2026',
    org_name: 'DevCraft Guild India',
    tag: 'web-dev',
    type: 'hackathon',
    url: 'https://devcraft.example.org/hackathon-2026',
    event_date: '2026-09-15',
    is_expired: false,
  },
  {
    id: 'opp-2',
    title: 'Zero-Day Shield CTF Championship',
    org_name: 'CyberDefend Research Labs',
    tag: 'cybersecurity',
    type: 'competition',
    url: 'https://cyberdefend.example.org/ctf-2026',
    event_date: '2026-09-20',
    is_expired: false,
  },
  {
    id: 'opp-3',
    title: 'Inter-College Spoken Word Poetry Slam',
    org_name: 'Kavyalok Literary Forum',
    tag: 'poetry',
    type: 'competition',
    url: 'https://kavyalok.example.org/slam',
    event_date: '2026-08-30',
    is_expired: false,
  },
  {
    id: 'opp-4',
    title: 'UI/UX Design Systems Intensive Workshop',
    org_name: 'DesignCraft Collective',
    tag: 'design',
    type: 'workshop',
    url: 'https://designcraft.example.org/workshop',
    event_date: '2026-09-05',
    is_expired: false,
  },
  {
    id: 'opp-5',
    title: 'Autonomous Robotics Challenge (ROS2 & ESP32)',
    org_name: 'RoboTech Federation',
    tag: 'robotics',
    type: 'competition',
    url: 'https://robotech.example.org/challenge',
    event_date: '2026-10-01',
    is_expired: false,
  },
  {
    id: 'opp-6',
    title: 'Applied Transformers & LLM Fine-Tuning Bootcamp',
    org_name: 'DataNexus Institute',
    tag: 'data-science',
    type: 'workshop',
    url: 'https://datanexus.example.org/bootcamp',
    event_date: '2026-09-12',
    is_expired: false,
  },
  {
    id: 'opp-7',
    title: 'Summer Code & Frontend Architecture Sprint (Passed)',
    org_name: 'OpenWeb Foundation',
    tag: 'web-dev',
    type: 'hackathon',
    url: 'https://openweb.example.org/past-sprint',
    event_date: '2026-06-10',
    is_expired: true,
  },
  {
    id: 'opp-8',
    title: 'Spring Cybersecurity Penetration Testing Summit',
    org_name: 'SecNet India',
    tag: 'cybersecurity',
    type: 'workshop',
    url: 'https://secnet.example.org/spring-summit',
    event_date: '2026-05-18',
    is_expired: true,
  },
  {
    id: 'opp-9',
    title: 'National Parliamentary Debate League 2026',
    org_name: 'All India Debate Union',
    tag: 'debate',
    type: 'competition',
    url: 'https://debateunion.example.org/league',
    event_date: '2026-09-28',
    is_expired: false,
  },
  {
    id: 'opp-10',
    title: 'Synth & Audio Production Masterclass',
    org_name: 'SoundWave Labs',
    tag: 'music-production',
    type: 'workshop',
    url: 'https://soundwave.example.org/masterclass',
    event_date: '2026-09-18',
    is_expired: false,
  },
];
