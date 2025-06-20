import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";
import { storeUsers } from "@/utils/supabaseClient";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("linear_access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    const user = await client.viewer;

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

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      displayName: user.displayName,
      url: user.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
