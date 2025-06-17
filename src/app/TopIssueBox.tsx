import React from "react";

interface Initiative {
  id: string;
  name: string;
  slugId?: string;
}

interface Project {
  id: string;
  name: string;
  slugId?: string;
  initiatives?: { nodes: Initiative[] };
}

interface Issue {
  id: string;
  title?: string;
  name?: string;
  project?: Project;
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
  // Stubbed data for development
  topIssue = {
    detailsFromIssue: {
      issue: {
        id: "e553f28d-c265-4ff7-b5d7-e72661b78937",
        project: {
          name: "Create a shared Db for user info",
          id: "6a1c006d-cdcd-488a-a49d-a18ee120f094",
          slugId: "4129dd050a3a",
          initiatives: {
            nodes: [
              {
                name: "Store User info in db",
                id: "019ff3f6-b9a6-44d1-a350-e1a31fe070cb",
                slugId: "32c08c63ef57",
              },
            ],
          },
        },
      },
    },
  };

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
        <div style={{ ...boxStyle, minWidth: 220 }}>
          <span style={labelStyle}>INITIATIVE</span>
          <span>{initiative?.name?.toUpperCase() || "-"}</span>
        </div>
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
        <div style={{ ...boxStyle, minWidth: 220 }}>
          <span style={labelStyle}>PROJECT</span>
          <span>{project?.name?.toUpperCase() || "-"}</span>
        </div>
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
        <div style={{ ...boxStyle, minWidth: 220 }}>
          <span style={labelStyle}>ISSUE</span>
          <span>{issue.title?.toUpperCase() || issue.id}</span>
        </div>
      </div>
    </div>
  );
}
