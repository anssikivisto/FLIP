import React from "react";

// Renders the "image" for a vocabulary item depending on topic kind.
// kind: "emoji" | "color" | "number"
export function ItemImage({ item, kind, size = "text-7xl sm:text-8xl" }) {
  if (kind === "color") {
    return (
      <div
        className="rounded-full border-4 border-white shadow-inner"
        style={{
          width: "3.6rem",
          height: "3.6rem",
          backgroundColor: item.hex,
          boxShadow: "inset 0 3px 8px rgba(0,0,0,0.18), 0 3px 6px rgba(0,0,0,0.12)",
        }}
        aria-label={item.en}
      />
    );
  }
  if (kind === "number") {
    return (
      <span className={`font-fredoka font-bold leading-none ${size}`} style={{ color: "#0369A1" }}>
        {item.display}
      </span>
    );
  }
  return (
    <span className={`leading-none ${size}`} role="img" aria-label={item.en}>
      {item.emoji}
    </span>
  );
}
