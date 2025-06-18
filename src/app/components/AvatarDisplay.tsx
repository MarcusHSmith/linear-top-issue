import React from "react";

interface AvatarDisplayProps {
  avatarUrl?: string;
  url: string;
}

export default function AvatarDisplay({ avatarUrl, url }: AvatarDisplayProps) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="avatar"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            marginRight: 8,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
    </a>
  );
}
