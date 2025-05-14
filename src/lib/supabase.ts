
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yuaszulmvjmnxzcdlfhy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YXN6dWxtdmptbnh6Y2RsZmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjA5NjYsImV4cCI6MjA2Mjc5Njk2Nn0.CzK8JT0J6ege2wOtcQYKRhtZJb5sl__FQOuX96N0ruw';

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
