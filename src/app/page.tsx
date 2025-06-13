import Image from "next/image";
import { cookies } from "next/headers";
import { LinearClient } from "@linear/sdk";
import { useEffect, useState } from "react";

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

// Client component for workspace section and confirmation message
function WorkspaceSection({
  user,
  workspaceName,
  workspaceUrl,
}: {
  user: { name: string; avatarUrl: string };
  workspaceName: string | null;
  workspaceUrl: string | null;
}) {
  const [workspaceUpdated, setWorkspaceUpdated] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("workspaceUpdated") === "1") {
        setWorkspaceUpdated(true);
        // Optionally, remove the param from the URL after showing the message
        params.delete("workspaceUpdated");
        const newUrl =
          window.location.pathname + (params.toString() ? `?${params}` : "");
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full border border-white/20"
          unoptimized
        />
        <span className="font-bold text-lg">{user.name}</span>
      </div>
      {workspaceName && (
        <div className="mb-2 text-center">
          <span className="text-sm text-neutral-400">Connected Workspace:</span>
          <div className="font-semibold">
            {workspaceUrl ? (
              <a
                href={workspaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {workspaceName}
              </a>
            ) : (
              workspaceName
            )}
          </div>
        </div>
      )}
      <a
        href="/api/auth/linear"
        className="mb-2 px-6 py-2 rounded-full bg-black text-white font-bold text-base shadow-lg hover:bg-neutral-900 transition-colors border border-white border-opacity-10"
        style={{ letterSpacing: 1 }}
      >
        Change Linear Workspace
      </a>
      <div className="text-xs text-neutral-400 max-w-xs text-center mb-2">
        To connect a different workspace, switch workspaces in Linear before
        authorizing.
      </div>
      {workspaceUpdated && (
        <div className="text-green-400 font-semibold text-sm mt-2">
          Workspace updated successfully!
        </div>
      )}
    </>
  );
}
