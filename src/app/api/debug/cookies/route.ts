import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieInfo = allCookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value ? "present" : "missing",
      hasValue: !!cookie.value,
      // Don't log actual values for security
    }));

    return NextResponse.json({
      success: true,
      totalCookies: allCookies.length,
      cookies: cookieInfo,
      hasLinearToken: !!cookieStore.get("linear_access_token")?.value,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
      { status: 500 }
    );
  }
}
