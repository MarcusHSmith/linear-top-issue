"use client";
import Image from "next/image";
import { useTopIssue } from "../hooks/useTopIssue";
import TopIssueVisualizer from "./components/TopIssueBox";
import ConnectLinearButton from "./components/ConnectLinearButton";

export default function WorkspaceSection({
  user,
  workspaceName,
  workspaceUrl,
}: {
  user: { name: string; avatarUrl: string };
  workspaceName: string | null;
  workspaceUrl: string | null;
}) {
  const {
    topIssue,
    loading: loadingTopIssue,
    error: errorTopIssue,
  } = useTopIssue();

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
      {/* Top Issue Section */}
      <div className="mb-2 text-center">
        <span className="text-sm text-neutral-400">Top Issue:</span>
        <div className="font-semibold">
          {loadingTopIssue ? (
            <span className="text-neutral-400">Loading top issue...</span>
          ) : errorTopIssue ? (
            <span className="text-red-500">{errorTopIssue}</span>
          ) : topIssue &&
            typeof topIssue === "object" &&
            topIssue !== null &&
            "detailsFromIssue" in topIssue ? (
            <TopIssueVisualizer
              topIssue={topIssue as import("./components/TopIssueBox").TopIssue}
            />
          ) : (
            <span className="text-neutral-400">No top issue found</span>
          )}
        </div>
      </div>
      <ConnectLinearButton />
      <div className="text-xs text-neutral-400 max-w-xs text-center mb-2">
        To connect a different workspace, switch workspaces in Linear before
        authorizing.
      </div>
    </>
  );
}
