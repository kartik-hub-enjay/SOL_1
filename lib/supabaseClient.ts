import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://rzvhrmgvyaeoqbwxzarv.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dmhybWd2eWFlb3Fid3h6YXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyOTA2MzksImV4cCI6MjEwMTg2NjYzOX0.d13qQHozEneA4y9HrIxElPjuSpYJGaLOOC8WoAqiZx8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
