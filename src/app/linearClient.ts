import { cookies } from "next/headers";
import { LinearClient } from "@linear/sdk";

/**
 * Retrieves the Linear access token from cookies and returns a LinearClient instance.
 * Returns null if the token is missing or invalid.
 */
export async function getLinearClientFromCookies(): Promise<LinearClient | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("linear_access_token");
  if (
    tokenCookie &&
    typeof tokenCookie.value === "string" &&
    tokenCookie.value
  ) {
    try {
      return new LinearClient({ accessToken: tokenCookie.value });
    } catch {
      return null;
    }
  }
  return null;
}

export async function getProjects() {
  console.log("getProjects ::");
  const client = await getLinearClientFromCookies();
  console.log("getProjects :: client", client);
  if (!client) {
    console.log("getProjects :: no client");
    return [];
  }
  const projects = await client.projects({ first: 50 });
  console.log("getProjects :: projects", projects);
  return projects.nodes;
}
