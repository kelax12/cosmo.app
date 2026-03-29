import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase credentials are configured
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined';

// Create Supabase client - always create one (either real or will throw clear errors)
export const supabase: SupabaseClient = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const supabaseAdmin = hasSupabaseConfig && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Demo mode: use LocalStorage when no authenticated user
// This will be checked dynamically based on auth state
export let isDemoMode = !hasSupabaseConfig;

// Function to update demo mode based on auth state
export const setDemoMode = (isDemo: boolean) => {
  isDemoMode = isDemo;
};

// Check if user is authenticated (call this after auth state changes)
export const checkAuthAndSetMode = async () => {
  if (!hasSupabaseConfig) {
    isDemoMode = true;
    return;
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  isDemoMode = !session;
};

// Export config status for error handling
export const isSupabaseConfigured = hasSupabaseConfig;
