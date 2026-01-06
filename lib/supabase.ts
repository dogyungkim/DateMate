import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Event = {
  id: string;
  title: string;
  date_range_start: string;
  date_range_end: string;
  created_at: string;
};

export type Vote = {
  id: string;
  event_id: string;
  user_name: string;
  available_date: string;
  created_at: string;
};

export type DateVoteCount = {
  date: string;
  count: number;
  voters: string[];
};
