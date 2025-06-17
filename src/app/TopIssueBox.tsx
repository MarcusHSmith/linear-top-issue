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

export default function TopIssueBox({ topIssue }: { topIssue: TopIssue }) {
  const issue = topIssue?.detailsFromIssue?.issue;
  if (!issue) return null;

  const project = issue.project;
  const initiative = project?.initiatives?.nodes?.[0];

  // Sectors: Initiative (top left), Project (bottom right), Issue (top right)
  // If only issue, show one sector; if project, two; if initiative, three.
  // We'll use SVG for the circular/sector layout.

  // Determine which sectors to show
  const sectors = [
    { key: "initiative", label: initiative?.name, present: !!initiative },
    { key: "project", label: project?.name, present: !!project },
    {
      key: "issue",
      label: issue.title || issue.name || issue.id,
      present: true,
    },
  ].filter((s) => s.present);

  // Angles for sectors (equal split)
  const sectorAngle = 360 / sectors.length;

  // Helper to describe an SVG arc sector
  function describeArc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Colors and style
  const bg = "#18191b";
  const line = "#e5e7eb";
  const accent = "#fff";
  const labelStyle: React.CSSProperties = {
    fill: line,
    fontSize: 16,
    fontFamily: "monospace",
    letterSpacing: 2,
    textAnchor: "middle",
    dominantBaseline: "middle",
    opacity: 0.8,
  };

  // SVG size
  const size = 260;
  const r = 100;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = 40;

  return (
    <div
      style={{
        background: bg,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: size + 48,
        margin: "0 auto",
      }}
    >
      <svg width={size} height={size} style={{ display: "block" }}>
        {/* Outer circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={line}
          strokeWidth={1}
        />
        {/* Inner circle */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke={line}
          strokeWidth={1}
        />
        {/* Sectors */}
        {sectors.map((sector, i) => {
          const startAngle = i * sectorAngle;
          const endAngle = (i + 1) * sectorAngle;
          return (
            <path
              key={sector.key}
              d={describeArc(cx, cy, r, startAngle, endAngle)}
              fill="#232325"
              stroke={accent}
              strokeWidth={i === 0 ? 2 : 1}
              opacity={0.18 + 0.18 * i}
            />
          );
        })}
        {/* Crosshair lines */}
        <line
          x1={cx}
          y1={cy - r}
          x2={cx}
          y2={cy + r}
          stroke={line}
          strokeWidth={0.5}
          opacity={0.3}
        />
        <line
          x1={cx - r}
          y1={cy}
          x2={cx + r}
          y2={cy}
          stroke={line}
          strokeWidth={0.5}
          opacity={0.3}
        />
        {/* Center cross */}
        <line
          x1={cx - 8}
          y1={cy}
          x2={cx + 8}
          y2={cy}
          stroke={accent}
          strokeWidth={1}
        />
        <line
          x1={cx}
          y1={cy - 8}
          x2={cx}
          y2={cy + 8}
          stroke={accent}
          strokeWidth={1}
        />
        {/* Labels */}
        {sectors.map((sector, i) => {
          // Place label at the middle angle of the sector, outside the circle
          const angle = (i + 0.5) * sectorAngle;
          const labelPos = polarToCartesian(cx, cy, r + 36, angle);
          return (
            <text
              key={sector.key + "-label"}
              x={labelPos.x}
              y={labelPos.y}
              style={labelStyle}
            >
              {sector.label?.toUpperCase()}
            </text>
          );
        })}
      </svg>
      <div
        style={{
          color: line,
          fontSize: 13,
          opacity: 0.5,
          marginTop: 16,
          letterSpacing: 2,
          fontFamily: "monospace",
        }}
      >
        {sectors.map((sector, i) => (
          <span key={sector.key + "-desc"} style={{ marginRight: 18 }}>
            {`0${i + 1}. ${sector.key.toUpperCase()}`}
          </span>
        ))}
      </div>
    </div>
  );
}
