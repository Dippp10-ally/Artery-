import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — used in components and client-side hooks
export const supabase = createClient<Database>(url, key);

// Server-side admin client — only use in /api routes (never ship to browser)
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
