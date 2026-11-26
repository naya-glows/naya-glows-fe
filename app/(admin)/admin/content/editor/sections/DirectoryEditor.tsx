"use client";

import Image from "next/image";
import type { DirectoryContent } from "@/lib/content/homeDirectory";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

// Shared by both tile-grid homepage sections (Services & Programmes, For
// Businesses) — identical shape, see lib/content/homeDirectory.ts.
export function DirectoryEditor({
  data,
  onChange,
}: {
  data: DirectoryContent;
  onChange: (patch: Partial<DirectoryContent>) => void;
}) {
  const updateTile = (i: number, patch: Partial<DirectoryContent["tiles"][number]>) => {
    const next = [...data.tiles] as DirectoryContent["tiles"];
    next[i] = { ...next[i], ...patch };
    onChange({ tiles: next });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InlineText
          value={data.eyebrow}
          onChange={(v) => onChange({ eyebrow: v })}
          className="w-fit text-xs font-semibold uppercase tracking-[0.2em] text-[#9a9ab8]"
          placeholder="Eyebrow"
        />
        <InlineText
          value={data.headingBold}
          onChange={(v) => onChange({ headingBold: v })}
          className="w-fit text-xl font-semibold text-[#1a1a2e]"
          placeholder="Heading (bold)"
        />
        <InlineText
          value={data.headingLight}
          onChange={(v) => onChange({ headingLight: v })}
          className="w-fit text-xl font-light text-[#9a9ab8]"
          placeholder="Heading (light)"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.tiles.map((tile, i) => (
          <div key={i} className="group relative h-[260px] overflow-hidden rounded-2xl bg-[#eafbf0]">
            {tile.image && <Image src={tile.image} alt="" fill className="object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <ImageEditButton onPick={(url) => updateTile(i, { image: url })} aspect={4 / 3} />
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
              <InlineText
                value={tile.title}
                onChange={(v) => updateTile(i, { title: v })}
                className="w-fit text-base font-semibold text-white"
                placeholder="Title"
              />
              <InlineText
                value={tile.copy}
                onChange={(v) => updateTile(i, { copy: v })}
                className="text-[11px] text-white/80"
                placeholder="One-line copy"
                multiline
              />
              <InlineText
                value={tile.href}
                onChange={(v) => updateTile(i, { href: v })}
                className="w-fit text-[10px] text-white/55"
                placeholder="Link (e.g. /consultation)"
              />
            </div>
          </div>
        ))}
      </div>
      <DimensionHint text="landscape, ~4:3 (wider than tall)" />
    </div>
  );
}
