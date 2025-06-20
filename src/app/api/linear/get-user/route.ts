import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLinearUser } from "@/utils/linear";

export async function GET() {
  console.log("GET-USER :: GET");
  const cookieStore = await cookies();

  // Debug: Log all available cookies
  const allCookies = cookieStore.getAll();
  console.log(
    "GET-USER :: All cookies:",
    allCookies.map((c) => ({
      name: c.name,
      value: c.value ? "present" : "missing",
    }))
  );

  const token = cookieStore.get("linear_access_token")?.value;
  console.log("GET-USER :: token", token ? "present" : "missing");

  const user = await getLinearUser(cookieStore);

  if (!user) {
    console.log(
      "GET-USER :: No token found or failed to fetch user - returning 401"
    );
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
