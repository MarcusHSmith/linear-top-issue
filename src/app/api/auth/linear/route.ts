import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.LINEAR_CLIENT_ID;
  const redirectUri = process.env.LINEAR_REDIRECT_URI;
  const state = "linear_demo_state"; // In production, generate a random string and store in session/cookie
  const scope = "read,write";

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri!,
    response_type: "code",
    scope,
    state,
  });

  return NextResponse.redirect(
    `https://linear.app/oauth/authorize?${params.toString()}`
  );
}
