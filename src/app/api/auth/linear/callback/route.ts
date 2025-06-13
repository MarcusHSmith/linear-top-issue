import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  console.log("CALLBACK ::");

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

  // Store access token in a cookie (for demo; use secure storage in production)
  const response = NextResponse.redirect(
    "https://linear-top-issue.vercel.app/"
  );
  response.cookies.set("linear_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
