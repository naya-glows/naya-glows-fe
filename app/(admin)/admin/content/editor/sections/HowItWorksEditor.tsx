"use client";

import Image from "next/image";
import type { HowItWorksContent } from "@/lib/content/homeHowItWorks";
import { InlineText } from "../InlineText";
import { ImageEditButton } from "../ImageEditButton";
import { DimensionHint } from "../DimensionHint";

// Fixed at exactly 3 steps — the connector/dot UI assumes 3 (see
// lib/content/homeHowItWorks.ts).
export function HowItWorksEditor({
  data,
  onChange,
}: {
  data: HowItWorksContent;
  onChange: (patch: Partial<HowItWorksContent>) => void;
}) {
  const updateStep = (i: number, patch: Partial<HowItWorksContent["steps"][number]>) => {
    const next = [...data.steps] as HowItWorksContent["steps"];
    next[i] = { ...next[i], ...patch };
    onChange({ steps: next });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#fafafa] p-5">
      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <InlineText
          value={data.headingPart1}
          onChange={(v) => onChange({ headingPart1: v })}
          className="w-fit text-xl font-semibold text-[#1a1a2e]"
          placeholder="Heading part 1"
        />
        <InlineText
          value={data.headingPart2}
          onChange={(v) => onChange({ headingPart2: v })}
          className="w-fit text-xl font-semibold text-[#1a1a2e]"
          placeholder="Heading part 2"
        />
        <InlineText
          value={data.headingPart3}
          onChange={(v) => onChange({ headingPart3: v })}
          className="w-fit text-xl font-light text-[#1a1a2e]/40"
          placeholder="Heading part 3"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="group relative h-20 w-20 overflow-hidden rounded-full bg-[#f5f5f5]">
              {step.image && <Image src={step.image} alt="" fill className="object-cover" />}
              <ImageEditButton onPick={(url) => updateStep(i, { image: url })} aspect={1} />
            </div>
            <InlineText
              value={step.title}
              onChange={(v) => updateStep(i, { title: v })}
              className="w-full text-base font-bold text-[#1a1a2e]"
              placeholder="Step title"
            />
            <InlineText
              value={step.description}
              onChange={(v) => updateStep(i, { description: v })}
              className="w-full text-sm text-[#5a5a7a]"
              placeholder="Step description"
              multiline
            />
          </div>
        ))}
      </div>
      <DimensionHint text="square (fits inside a circle)" />

      <InlineText
        value={data.footerNote}
        onChange={(v) => onChange({ footerNote: v })}
        className="w-fit text-xs text-[#b09088]"
        placeholder="Footer note"
      />
    </div>
  );
}
