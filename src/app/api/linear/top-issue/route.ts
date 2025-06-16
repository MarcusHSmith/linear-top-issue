import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";

export async function GET() {
  console.log("GET /api/linear/top-issue ::");
  const cookieStore = await cookies();
  const token = cookieStore.get("linear_access_token")?.value;
  console.log("GET /api/linear/top-issue :: token", token);

  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    console.log("GET /api/linear/top-issue :: client", client);
    const initiatives = await client.initiatives({ first: 10 });
    console.log("GET /api/linear/top-issue :: initiatives", initiatives);

    const projects = await client.projects({ first: 10 });
    console.log("GET /api/linear/top-issue :: projects", projects);

    const issues = await client.issues({ first: 10 });
    console.log("GET /api/linear/top-issue :: issues", issues);

    // For now, just return the first initiative as the 'top issue'
    const topIssue = initiatives.nodes[0] || null;
    return NextResponse.json({ topIssue });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top issue", details: (error as Error).message },
      { status: 500 }
    );
  }
}
