import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLinearUser } from "@/utils/linear";

export async function GET() {
  const cookieStore = await cookies();

  // Debug: Log all available cookies
  const allCookies = cookieStore.getAll();

  const user = await getLinearUser(cookieStore);

  if (!user) {
    return NextResponse.json(
      {
        error: "No Linear access token found or user fetch failed",
        debug: { availableCookies: allCookies.map((c) => c.name) },
      },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
}
