// This file has been moved to src/app/components/IconDisplay.tsx

import React from "react";
// @ts-expect-error: No types for emoji-dictionary
import emoji from "emoji-dictionary";

export default function IconDisplay({ icon }: { icon?: string }) {
  if (!icon) return null;
  // Emoji format: :smile:
  if (/^:[^:]+:$/.test(icon)) {
    const unicodeEmoji = emoji.getUnicode(icon);
    if (unicodeEmoji) {
      return (
        <span style={{ fontSize: 24, marginRight: 10 }}>{unicodeEmoji}</span>
      );
    }
    // fallback: show the shortcode if not found
    return <span style={{ fontSize: 24, marginRight: 10 }}>{icon}</span>;
  }
  // Otherwise, treat as asset path or URL
  return (
    <img
      src={icon}
      alt="icon"
      style={{
        width: 24,
        height: 24,
        marginRight: 10,
        verticalAlign: "middle",
      }}
    />
  );
}
