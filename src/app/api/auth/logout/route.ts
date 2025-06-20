import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  // Clear all Linear-related cookies
  const cookiesToClear = [
    "linear_access_token",
    "linear_workspace_name",
    "linear_workspace_id",
    "linear_workspace_url",
  ];

  cookiesToClear.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      path: "/",
      expires: new Date(0), // Set to past date to expire immediately
      maxAge: 0,
    });
  });

  return response;
}
