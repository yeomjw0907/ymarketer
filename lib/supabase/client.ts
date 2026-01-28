import { createBrowserClient } from '@supabase/ssr';

// Supabase Client (Client-side)
// For use in Client Components - uses cookies for SSR compatibility
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
