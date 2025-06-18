import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeUsers({
  users,
}: {
  users: {
    id: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
  }[];
}) {
  // Upsert users into the 'linear_top_issue_users' table
  const { data, error } = await supabase
    .from("linear_top_issue_users")
    .upsert(users, { onConflict: "id" })
    .select();
  return { data, error };
}
