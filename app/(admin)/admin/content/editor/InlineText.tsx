"use client";

import { useState } from "react";

// Click-to-edit text: renders as plain text matching the live page's own
// classes; clicking swaps it for a real input/textarea so an admin can type
// over or erase it in place, in context, instead of in a separate form.
export function InlineText({
  value,
  onChange,
  className = "",
  placeholder = "",
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value || "");

  const startEdit = () => {
    setLocal(value || "");
    setEditing(true);
  };

  const commit = () => {
    onChange(local);
    setEditing(false);
  };

  if (editing) {
    // The preview className often carries a light text colour (cards on
    // dark or coloured backgrounds). Strip anything that would make the
    // text invisible once it's on the white editing field, and force
    // readable colours.
    const safe = className
      .split(/\s+/)
      .filter(
        (c) =>
          !/^!?text-(white|black)(\/\d+)?$/.test(c) &&
          !/^!?text-white\b/.test(c) &&
          !/^!?bg-/.test(c),
      )
      .join(" ");
    const editStyles =
      "w-full rounded-[4px] border border-[#8ab88e] bg-white! px-1.5 py-1 text-[#16241a]! outline-none";
    if (multiline) {
      return (
        <textarea
          autoFocus
          rows={3}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          className={`${safe} resize-none ${editStyles}`}
        />
      );
    }
    return (
      <input
        autoFocus
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className={`${safe} ${editStyles}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={`${className} cursor-text rounded-[4px] px-1.5 py-0.5 text-left outline-dashed outline-1 outline-transparent transition-colors hover:bg-white/15 hover:outline-white/50`}
    >
      {value || <span className="opacity-60">{placeholder}</span>}
    </button>
  );
}
