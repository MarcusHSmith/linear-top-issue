import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.SITE_URL || "https://linear-top-issue.app/";

export async function GET(req: NextRequest) {
  console.log("SITE_URL", SITE_URL);
  console.log("process.env.SITE_URL", process.env.SITE_URL);

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Validate state parameter to prevent CSRF attacks
  const storedState = req.cookies.get("linear_oauth_state")?.value;
  if (!returnedState || !storedState || returnedState !== storedState) {
    return NextResponse.json(
      { error: "Invalid state parameter" },
      { status: 400 }
    );
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://api.linear.app/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.LINEAR_CLIENT_ID!,
      client_secret: process.env.LINEAR_CLIENT_SECRET!,
      redirect_uri: process.env.LINEAR_REDIRECT_URI!,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 400 }
    );
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch workspace (organization) metadata using Linear SDK
  let workspaceName = "";
  let workspaceId = "";
  let workspaceUrl = "";
  try {
    const { LinearClient } = await import("@linear/sdk");
    const client = new LinearClient({ accessToken });
    const org = await client.organization;
    workspaceName = org.name;
    workspaceId = org.id;
    // Try to construct the workspace URL if urlKey is available
    if (org.urlKey) {
      workspaceUrl = `https://linear.app/${org.urlKey}`;
    }
  } catch {
    // fallback: leave workspace fields empty
  }

  // Store access token and workspace metadata in cookies (for demo; use secure storage in production)
  const response = NextResponse.redirect(SITE_URL + "?workspaceUpdated=1");

  // Clear the state cookie since it's no longer needed
  response.cookies.delete("linear_oauth_state");

  // Get the domain for cookies - use the current request's hostname
  const hostname = req.headers.get("host") || "";
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const domain = isLocalhost ? undefined : ".linear-top-issue.app";

  response.cookies.set("linear_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    domain: domain,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  response.cookies.set("linear_workspace_name", workspaceName, {
    path: "/",
    sameSite: "lax",
    domain: domain,
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("linear_workspace_id", workspaceId, {
    path: "/",
    sameSite: "lax",
    domain: domain,
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("linear_workspace_url", workspaceUrl, {
    path: "/",
    sameSite: "lax",
    domain: domain,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
