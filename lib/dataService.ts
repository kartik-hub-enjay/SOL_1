import { supabase } from './supabaseClient';
import {
  SEEDED_UNIVERSITIES,
  SEEDED_COMMUNITIES,
  SEEDED_STUDENTS,
  SEEDED_CIRCLES,
  SEEDED_MESSAGES,
  SEEDED_OPPORTUNITIES,
  University,
  Community,
  UserProfile,
  Circle,
  CircleMessage,
  Opportunity,
} from './seedData';

// Local storage cache keys for browser demo state persistence
const STORAGE_KEYS = {
  USER: 'spark_current_user',
  MEMBERSHIPS: 'spark_community_memberships',
  MESSAGES: 'spark_custom_messages',
  ANSWERS: 'spark_fingerprint_answers',
  PROFILE: 'spark_fingerprint_profile',
};

// --- Universities ---
export async function getUniversities(): Promise<University[]> {
  try {
    const { data, error } = await supabase.from('universities').select('*');
    if (!error && data && data.length > 0) return data as University[];
  } catch {}
  return SEEDED_UNIVERSITIES;
}

// --- Communities ---
export async function getCommunities(): Promise<Community[]> {
  try {
    const { data, error } = await supabase.from('communities').select('*');
    if (!error && data && data.length > 0) return data as Community[];
  } catch {}
  return SEEDED_COMMUNITIES;
}

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  const communities = await getCommunities();
  return communities.find((c) => c.slug === slug) || null;
}

// --- Community Memberships ---
export function getJoinedCommunityIds(): string[] {
  if (typeof window === 'undefined') return ['comm-1', 'comm-3'];
  const stored = localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  const defaultJoined = ['comm-1', 'comm-3'];
  localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(defaultJoined));
  return defaultJoined;
}

export function toggleCommunityMembership(communityId: string): string[] {
  const current = getJoinedCommunityIds();
  const exists = current.includes(communityId);
  const next = exists ? current.filter((id) => id !== communityId) : [...current, communityId];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIPS, JSON.stringify(next));
  }
  return next;
}

// --- Circles & Messages ---
export async function getCircleForCommunity(communityId: string): Promise<Circle> {
  try {
    const { data, error } = await supabase
      .from('circles')
      .select('*')
      .eq('community_id', communityId)
      .single();
    if (!error && data) return data as Circle;
  } catch {}
  
  const found = SEEDED_CIRCLES.find((c) => c.community_id === communityId);
  if (found) return found;

  return {
    id: `circle-${communityId}`,
    community_id: communityId,
    tier: 'starter_pod',
    created_at: new Date().toISOString(),
  };
}

export async function getCircleMessages(tagOrCircleId: string): Promise<CircleMessage[]> {
  const tagKey = tagOrCircleId.replace('circle-', '').replace('-1', '');
  const seeded = SEEDED_MESSAGES[tagKey] || SEEDED_MESSAGES['web-dev'] || [];

  let localExtra: CircleMessage[] = [];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${tagKey}`);
    if (stored) {
      try {
        localExtra = JSON.parse(stored);
      } catch {}
    }
  }

  try {
    const { data, error } = await supabase
      .from('circle_messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      return [...data as CircleMessage[], ...localExtra];
    }
  } catch {}

  return [...seeded, ...localExtra];
}

export async function sendCircleMessage(
  tagOrCircleId: string,
  user: UserProfile,
  content: string
): Promise<CircleMessage> {
  const tagKey = tagOrCircleId.replace('circle-', '').replace('-1', '');
  const circle = await getCircleForCommunity(tagKey);

  const newMessage: CircleMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    circle_id: circle.id,
    user_id: user.id,
    user_display_name: user.display_name,
    content,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('circle_messages').insert([newMessage]);
  } catch {}

  if (typeof window !== 'undefined') {
    const key = `${STORAGE_KEYS.MESSAGES}_${tagKey}`;
    const existing = localStorage.getItem(key);
    const list: CircleMessage[] = existing ? JSON.parse(existing) : [];
    list.push(newMessage);
    localStorage.setItem(key, JSON.stringify(list));
  }

  return newMessage;
}

// --- Opportunities ---
export async function getOpportunities(tagFilter?: string): Promise<Opportunity[]> {
  let list = SEEDED_OPPORTUNITIES;
  try {
    const { data, error } = await supabase.from('opportunities').select('*');
    if (!error && data && data.length > 0) {
      list = data as Opportunity[];
    }
  } catch {}

  if (tagFilter && tagFilter !== 'all') {
    list = list.filter((o) => o.tag === tagFilter);
  }
  return list;
}

// --- Auth & Session ---
export function getCurrentUser(): UserProfile {
  if (typeof window === 'undefined') return SEEDED_STUDENTS[0];
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  const defaultUser = SEEDED_STUDENTS[0];
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  return defaultUser;
}

export function setCurrentUser(user: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}
