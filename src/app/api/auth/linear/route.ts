import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const clientId = process.env.LINEAR_CLIENT_ID;
  const redirectUri = process.env.LINEAR_REDIRECT_URI;

  // Generate a random state parameter for CSRF protection
  const state = randomBytes(32).toString("hex");
  const scope = "read,write";

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri!,
    response_type: "code",
    scope,
    state,
  });

  const response = NextResponse.redirect(
    `https://linear.app/oauth/authorize?${params.toString()}`
  );

  // Store the state in a secure cookie for validation in callback
  response.cookies.set("linear_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes (should be enough for OAuth flow)
  });

  return response;
}
