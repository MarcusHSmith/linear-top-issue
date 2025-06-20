import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

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
  try {
    const { data, error } = await supabase
      .from("linear_top_issue_users")
      .upsert(users, { onConflict: "id" })
      .select();
    console.log("storeUsers :: Data", JSON.stringify(data, null, 2));
    console.log("storeUsers :: Error", JSON.stringify(error, null, 2));
    return { data, error };
  } catch (error) {
    console.error("storeUsers :: Error", JSON.stringify(error, null, 2));
    return { data: null, error: error };
  }
}
