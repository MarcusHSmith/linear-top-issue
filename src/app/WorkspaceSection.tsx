"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function WorkspaceSection({
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
