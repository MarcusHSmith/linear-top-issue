"use client";
import React from "react";
import Image from "next/image";
import { useTopIssue } from "@/hooks/useTopIssue";
import { useUser } from "@/hooks/useUser";
import TopIssueBox from "./components/TopIssueBox";
import AvatarDisplay from "./components/AvatarDisplay";

const WorkspaceSection = ({
  workspaceName,
  workspaceUrl,
}: {
  workspaceName: string | null;
  workspaceUrl: string | null;
}) => {
  const { topIssue, loading: issueLoading, error: issueError } = useTopIssue();
  const { user, loading: userLoading, error: userError } = useUser();
  const loading = issueLoading || userLoading;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl items-center">
      <div className="flex items-center gap-4 p-3 rounded-lg border border-white/10 w-full justify-between">
        <a
          href={workspaceUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/Linear-Brand-Assets/linear-icon.svg"
            alt="Linear Workspace Logo"
            width={24}
            height={24}
          />
          <span className="font-semibold">{workspaceName || "Workspace"}</span>
        </a>
        {user && <AvatarDisplay avatarUrl={user.avatarUrl} url={user.url} />}
      </div>
      {loading && (
        <div className="text-center p-8">
          <p>Loading Top Issue...</p>
        </div>
      )}
      {!loading && topIssue && <TopIssueBox topIssue={topIssue} />}
      {(issueError || userError) && (
        <div className="text-center p-8 text-red-500">
          <p>
            {issueError || userError || "An error occurred."} Please try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSection;
