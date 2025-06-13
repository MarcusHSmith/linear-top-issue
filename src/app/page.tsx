import { cookies } from "next/headers";
import { LinearClient } from "@linear/sdk";
import WorkspaceSection from "./WorkspaceSection";

export default async function Home() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("linear_access_token");
  const workspaceName = cookieStore.get("linear_workspace_name")?.value || null;
  const workspaceUrl = cookieStore.get("linear_workspace_url")?.value || null;
  let user: { name: string; avatarUrl: string } | null = null;

  if (
    tokenCookie &&
    typeof tokenCookie.value === "string" &&
    tokenCookie.value
  ) {
    try {
      const client = new LinearClient({
        accessToken: tokenCookie.value as string,
      });
      const viewer = await client.viewer;
      user = { name: viewer.name, avatarUrl: viewer.avatarUrl ?? "" };
    } catch {
      user = null;
    }
  }

  // Workspace update confirmation will be handled in a client component

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        {/* User info or Connect button */}
        {user ? (
          <WorkspaceSection
            user={user}
            workspaceName={workspaceName}
            workspaceUrl={workspaceUrl}
          />
        ) : (
          <a
            href="/api/auth/linear"
            className="mb-8 px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition-colors border border-white border-opacity-10"
            style={{ letterSpacing: 1 }}
          >
            Connect Linear
          </a>
        )}
        {/* Add your custom content here */}
      </main>
    </div>
  );
}
