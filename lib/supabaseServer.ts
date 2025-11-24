import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ANON_KEY) {
  throw new Error("❌ Missing Supabase environment variables");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ANON_KEY,
  {
    auth: {
      persistSession: false, // since we're using Clerk for auth
    },
  }
);

export default supabase;
