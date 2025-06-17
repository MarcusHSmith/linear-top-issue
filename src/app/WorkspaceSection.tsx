"use client";
import Image from "next/image";
import { useProjects } from "../hooks/useProjects";
import { useTopIssue } from "../hooks/useTopIssue";
import TopIssueBox from "./TopIssueBox";

export default function WorkspaceSection({
  user,
  workspaceName,
  workspaceUrl,
}: {
  user: { name: string; avatarUrl: string };
  workspaceName: string | null;
  workspaceUrl: string | null;
}) {
  const { projects, loading, error } = useProjects();
  const {
    topIssue,
    loading: loadingTopIssue,
    error: errorTopIssue,
  } = useTopIssue();

  console.log("WorkspaceSection :: topIssue", topIssue);
  console.log(
    "WorkspaceSection :: topIssue",
    JSON.stringify(topIssue, null, 2)
  );

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
      {loading ? (
        <div className="mb-2 text-center text-neutral-400">
          Loading projects...
        </div>
      ) : error ? (
        <div className="mb-2 text-center text-red-500">{error}</div>
      ) : (
        projects.length > 0 && (
          <div className="mb-2 text-center">
            <span className="text-sm text-neutral-400">Projects:</span>
            <div className="font-semibold">
              {projects.map((project) => (
                <div key={project.id}>{project.name}</div>
              ))}
            </div>
          </div>
        )
      )}
      {/* Top Issue Section */}
      <div className="mb-2 text-center">
        <span className="text-sm text-neutral-400">Top Initiative:</span>
        <div className="font-semibold">
          {loadingTopIssue ? (
            <span className="text-neutral-400">Loading top initiative...</span>
          ) : errorTopIssue ? (
            <span className="text-red-500">{errorTopIssue}</span>
          ) : topIssue &&
            typeof topIssue === "object" &&
            topIssue !== null &&
            "detailsFromIssue" in topIssue ? (
            <TopIssueBox
              topIssue={topIssue as import("./TopIssueBox").TopIssue}
            />
          ) : (
            <span className="text-neutral-400">No top issue found</span>
          )}
        </div>
      </div>
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
    </>
  );
}
