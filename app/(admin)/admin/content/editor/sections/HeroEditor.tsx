"use client";

import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import type { HeroContent } from "@/lib/content/homeHero";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

export function HeroEditor({
  data,
  onChange,
}: {
  data: HeroContent;
  onChange: (patch: Partial<HeroContent>) => void;
}) {
  const updateImage = (i: number, url: string) => {
    const next = [...data.backgroundImages];
    next[i] = url;
    onChange({ backgroundImages: next });
  };
  const addImage = () => onChange({ backgroundImages: [...data.backgroundImages, ""] });
  const removeImage = (i: number) =>
    onChange({ backgroundImages: data.backgroundImages.filter((_, idx) => idx !== i) });

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1a1a1a]">
        {data.backgroundImages[0] && (
          <Image src={data.backgroundImages[0]} alt="" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
        <div className="relative z-10 flex h-full flex-col justify-end gap-3 px-5 pb-6 sm:px-8 sm:pb-8">
          <InlineText
            value={data.eyebrow}
            onChange={(v) => onChange({ eyebrow: v })}
            className="w-fit text-[11px] tracking-[0.3em] uppercase text-[#e8ddd0] font-medium"
            placeholder="Eyebrow text"
          />
          <InlineText
            value={data.headline}
            onChange={(v) => onChange({ headline: v })}
            className="max-w-lg text-2xl sm:text-4xl font-bold leading-[1.05] text-white"
            placeholder="Headline"
          />
          <InlineText
            value={data.taglines.join(", ")}
            onChange={(v) => onChange({ taglines: v.split(",").map((t) => t.trim()).filter(Boolean) })}
            className="max-w-lg text-sm text-white/80"
            placeholder="Rotating taglines, comma-separated"
          />
          <InlineText
            value={data.body}
            onChange={(v) => onChange({ body: v })}
            className="max-w-md text-sm text-white/70"
            placeholder="Body text"
            multiline
          />
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <InlineText
              value={data.primaryCtaLabel}
              onChange={(v) => onChange({ primaryCtaLabel: v })}
              className="w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1a1a1a]"
              placeholder="Primary label"
            />
            <InlineText
              value={data.secondaryCtaLabel}
              onChange={(v) => onChange({ secondaryCtaLabel: v })}
              className="w-fit rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white"
              placeholder="Secondary label"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <InlineText
              value={data.primaryCtaHref}
              onChange={(v) => onChange({ primaryCtaHref: v })}
              className="w-fit text-[11px] text-white/60"
              placeholder="Primary link"
            />
            <InlineText
              value={data.secondaryCtaHref}
              onChange={(v) => onChange({ secondaryCtaHref: v })}
              className="w-fit text-[11px] text-white/60"
              placeholder="Secondary link"
            />
          </div>
        </div>
      </div>
      <DimensionHint text="full-bleed, ~16:9 or taller — crops to fill on every screen" />

      <div className="flex flex-col gap-2">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[#16241a]/50">
          Background photos (auto-advancing slider)
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.backgroundImages.map((img, i) => (
            <div key={i} className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-[#eafbf0]">
              {img && <Image src={img} alt="" fill className="object-cover" />}
              <ImageEditButton onPick={(url) => updateImage(i, url)} aspect={16 / 9} />
              {data.backgroundImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  aria-label="Remove photo"
                  className="absolute left-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white hover:bg-red-600"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="flex aspect-[16/9] items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#16241a]/25 text-[11.5px] font-medium text-[#4f7957] hover:border-[#4f7957]"
          >
            <Plus size={14} />
            Add photo
          </button>
        </div>
      </div>
    </div>
  );
}
