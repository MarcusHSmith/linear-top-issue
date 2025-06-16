import { NextRequest, NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  console.log("GET /api/linear/get-projects ::");
  console.log("GET /api/linear/get-projects :: req.cookies", req.cookies);

  const cookieStore = await cookies();
  console.log("GET /api/linear/get-projects :: cookieStore", cookieStore);
  const token = cookieStore.get("linear_access_token")?.value;

  // Get the access token from cookies
  // const token = req.cookies.get("linear_access_token")?.value;
  console.log("GET /api/linear/get-projects :: token", token);
  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    console.log("GET /api/linear/get-projects :: client", client);
    const projects = await client.projects({ first: 50 });
    console.log("GET /api/linear/get-projects :: projects", projects);
    return NextResponse.json({ projects: projects.nodes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: (error as Error).message },
      { status: 500 }
    );
  }
}
