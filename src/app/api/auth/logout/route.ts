import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear all Linear-related cookies
  const cookiesToClear = [
    "linear_access_token",
    "linear_workspace_name",
    "linear_workspace_id",
    "linear_workspace_url",
  ];

  // Match the domain logic used when setting the cookies so they are
  // properly cleared in production and local environments
  const hostname = req.headers.get("host") || "";
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const domain = isLocalhost ? undefined : ".linear-top-issue.app";

  cookiesToClear.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      path: "/",
      expires: new Date(0), // Set to past date to expire immediately
      maxAge: 0,
      domain,
    });
  });

  return response;
}
