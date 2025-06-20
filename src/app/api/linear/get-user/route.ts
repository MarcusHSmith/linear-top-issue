import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";
import { storeUsers } from "@/utils/supabaseClient";

export async function GET() {
  console.log("GET-USER :: GET");
  const cookieStore = await cookies();

  // Debug: Log all available cookies
  const allCookies = cookieStore.getAll();
  console.log(
    "GET-USER :: All cookies:",
    allCookies.map((c) => ({
      name: c.name,
      value: c.value ? "present" : "missing",
    }))
  );

  const token = cookieStore.get("linear_access_token")?.value;
  console.log("GET-USER :: token", token ? "present" : "missing");

  if (!token) {
    console.log("GET-USER :: No token found - returning 401");
    return NextResponse.json(
      {
        error: "No Linear access token found",
        debug: { availableCookies: allCookies.map((c) => c.name) },
      },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    const user = await client.viewer;

    console.log("GET-USER :: StoreUsers", JSON.stringify(user, null, 2));
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
    console.log("GET-USER :: Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
