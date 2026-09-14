"use client";

import type { WhyChooseContent } from "@/lib/content/homeWhyChoose";
import { InlineText } from "../InlineText";

// Fixed at exactly 3 features — one per icon (FlaskConical, Rocket,
// MessageCircleHeart), which are structural, not editable (see
// lib/content/homeWhyChoose.ts). No images here — the portrait photo in
// this section is a fixed design asset, not admin content.
export function WhyChooseEditor({
  data,
  onChange,
}: {
  data: WhyChooseContent;
  onChange: (patch: Partial<WhyChooseContent>) => void;
}) {
  const updateFeature = (i: number, patch: Partial<WhyChooseContent["features"][number]>) => {
    const next = [...data.features] as WhyChooseContent["features"];
    next[i] = { ...next[i], ...patch };
    onChange({ features: next });
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-5"
      style={{ background: "linear-gradient(180deg, #ebf6ff 0%, #dde7f7 100%)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <InlineText
            value={data.headingLine1}
            onChange={(v) => onChange({ headingLine1: v })}
            className="w-fit text-2xl font-semibold text-[#1a1a2e]"
            placeholder="Heading line 1"
          />
          <InlineText
            value={data.headingLine2}
            onChange={(v) => onChange({ headingLine2: v })}
            className="w-fit text-2xl font-semibold text-[#1a1a2e]"
            placeholder="Heading line 2"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InlineText
            value={data.primaryCtaLabel}
            onChange={(v) => onChange({ primaryCtaLabel: v })}
            className="w-fit rounded-full bg-[#1a1a2e] px-4 py-2 text-xs font-semibold text-white"
            placeholder="Primary CTA"
          />
          <InlineText
            value={data.secondaryCtaLabel}
            onChange={(v) => onChange({ secondaryCtaLabel: v })}
            className="w-fit rounded-full bg-[#9bb6d5] px-4 py-2 text-xs font-semibold text-white"
            placeholder="Secondary CTA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50">
            Stat 1
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <InlineText
              value={data.stat1Value}
              onChange={(v) => onChange({ stat1Value: v })}
              className="w-fit text-lg font-semibold text-[#1a1a2e]"
              placeholder="27%"
            />
            <InlineText
              value={data.stat1Label}
              onChange={(v) => onChange({ stat1Label: v })}
              className="w-fit text-xs font-semibold text-[#1a1a2e]"
              placeholder="Label"
            />
          </div>
          <InlineText
            value={data.stat1Sublabel}
            onChange={(v) => onChange({ stat1Sublabel: v })}
            className="mt-1 w-full text-[11px] text-[#5a5a7a]"
            placeholder="Sublabel"
          />
        </div>
        <div className="rounded-2xl bg-white/70 p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50">
            Stat 2
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <InlineText
              value={data.stat2Value}
              onChange={(v) => onChange({ stat2Value: v })}
              className="w-fit text-lg font-semibold text-[#1a1a2e]"
              placeholder="23+"
            />
            <InlineText
              value={data.stat2Label}
              onChange={(v) => onChange({ stat2Label: v })}
              className="w-fit text-xs font-semibold text-[#1a1a2e]"
              placeholder="Label"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.features.map((f, i) => (
          <div key={i} className="rounded-xl bg-[#d2deee] p-4">
            <InlineText
              value={f.title}
              onChange={(v) => updateFeature(i, { title: v })}
              className="text-sm font-bold text-white"
              placeholder="Feature title"
            />
            <InlineText
              value={f.description}
              onChange={(v) => updateFeature(i, { description: v })}
              className="mt-1.5 text-xs text-white/85"
              placeholder="Feature description"
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}
