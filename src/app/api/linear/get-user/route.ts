import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";

export async function GET() {
  console.log("GET /api/linear/get-user ::");
  const cookieStore = await cookies();
  console.log("GET /api/linear/get-user :: cookieStore", cookieStore);
  const token = cookieStore.get("linear_access_token")?.value;
  console.log("GET /api/linear/get-user :: token", token);
  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    console.log("GET /api/linear/get-user :: client", client);
    const user = await client.viewer;
    console.log("GET /api/linear/get-user :: user", user);
    // You can select which fields to return, here we return a subset
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
