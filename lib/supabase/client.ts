import { createClient } from '@supabase/supabase-js';

// Supabase Client (Client-side)
// For use in Client Components and API Routes
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
