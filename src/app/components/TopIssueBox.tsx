// This file has been moved to src/app/components/TopIssueBox.tsx

import React from "react";
import IconDisplay from "./IconDisplay";
import AvatarDisplay from "./AvatarDisplay";

interface State {
  name: string;
  type: string;
}

interface Assignee {
  id: string;
  avatarUrl: string;
  displayName: string;
  url?: string;
}

interface Initiative {
  id: string;
  name: string;
  icon?: string;
  url?: string;
  status?: string;
}

interface ProjectStatus {
  id: string;
  name: string;
  type: string;
  position: number;
}

interface Project {
  id: string;
  name: string;
  icon?: string;
  url?: string;
  status?: ProjectStatus;
  initiatives?: { nodes: Initiative[] };
}

interface Issue {
  id: string;
  title?: string;
  name?: string;
  project?: Project;
  url?: string;
  assignee?: Assignee | null;
  customerTicketCount?: number;
  priority?: number;
  prioritySortOrder?: number;
  state?: State;
}

export type TopIssue = {
  detailsFromIssue: {
    issue: Issue;
  };
};

export default function TopIssueVisualizer({
  topIssue,
}: {
  topIssue: TopIssue;
}) {
  const issue = topIssue?.detailsFromIssue?.issue;
  if (!issue) return null;

  const project = issue.project;
  const initiative = project?.initiatives?.nodes?.[0];

  // Colors and style
  const bg = "#18191b";
  const line = "#e5e7eb";
  const accent = "#fff";
  const boxStyle: React.CSSProperties = {
    background: "#232325",
    border: `1.5px solid ${line}`,
    borderRadius: 12,
    padding: "24px 32px",
    minWidth: 120,
    minHeight: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    fontSize: 16,
    color: accent,
    letterSpacing: 1.5,
    fontWeight: 600,
    boxShadow: "0 2px 8px #0002",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: line,
    opacity: 0.7,
    marginBottom: 6,
    letterSpacing: 2,
    fontWeight: 400,
  };

  // Helper to render a box, optionally as a link
  function Box({
    label,
    value,
    url,
    icon,
    leftAddon,
  }: {
    label: string;
    value: string;
    url?: string;
    icon?: string;
    leftAddon?: React.ReactNode;
  }) {
    const content = (
      <>
        <span style={labelStyle}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {leftAddon}
          <IconDisplay icon={icon} />
          {value}
        </span>
      </>
    );
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...boxStyle,
          minWidth: 220,
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {content}
      </a>
    ) : (
      <div style={{ ...boxStyle, minWidth: 220 }}>{content}</div>
    );
  }

  return (
    <div
      style={{
        background: bg,
        borderRadius: 16,
        padding: 32,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Initiative */}
        <Box
          label="INITIATIVE"
          value={initiative?.name?.toUpperCase() || "-"}
          url={initiative?.url}
          icon={initiative?.icon}
        />
        {/* Arrow 1 */}
        <svg width="60" height="24" style={{ margin: "0 8px" }}>
          <line
            x1="0"
            y1="12"
            x2="48"
            y2="12"
            stroke={line}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="48,6 60,12 48,18" fill={line} />
        </svg>
        {/* Project */}
        <Box
          label="PROJECT"
          value={project?.name?.toUpperCase() || "-"}
          url={project?.url}
          icon={project?.icon}
        />
        {/* Arrow 2 */}
        <svg width="60" height="24" style={{ margin: "0 8px" }}>
          <line
            x1="0"
            y1="12"
            x2="48"
            y2="12"
            stroke={line}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="48,6 60,12 48,18" fill={line} />
        </svg>
        {/* Issue */}
        <Box
          label="ISSUE"
          value={(issue.title || issue.name || issue.id).toUpperCase()}
          url={issue.url}
          leftAddon={
            issue.assignee?.avatarUrl && issue.assignee?.url ? (
              <AvatarDisplay
                avatarUrl={issue.assignee.avatarUrl}
                url={issue.assignee.url}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}
