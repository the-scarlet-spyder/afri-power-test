
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseUser = {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
};

// Helper function to get name from user
export const getUserName = (user: SupabaseUser | null): string => {
  if (!user) return '';
  return user.user_metadata?.name || user.email?.split('@')[0] || '';
};
