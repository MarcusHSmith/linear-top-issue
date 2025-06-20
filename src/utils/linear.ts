import { LinearClient } from "@linear/sdk";
import { storeUsers } from "@/utils/supabaseClient";

interface CookieStore {
  get: (
    name: string
  ) => { name: string; value: string; [key: string]: unknown } | undefined;
}

export async function getLinearUser(cookieStore: CookieStore) {
  const token = cookieStore.get("linear_access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const client = new LinearClient({ accessToken: token });
    const user = await client.viewer;

    if (user) {
      await storeUsers({
        users: [
          {
            id: user.id,
            email: user.email,
            display_name: user.displayName,
            avatar_url: user.avatarUrl,
          },
        ],
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        displayName: user.displayName,
        url: user.url,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user from Linear", {
      error: (error as Error).message,
    });
    return null;
  }
}
