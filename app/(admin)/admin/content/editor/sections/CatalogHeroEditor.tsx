"use client";

import type { CatalogHeroContent } from "@/lib/content/catalogHero";
import { InlineText } from "../InlineText";

export function CatalogHeroEditor({
  data,
  onChange,
}: {
  data: CatalogHeroContent;
  onChange: (patch: Partial<CatalogHeroContent>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-2xl bg-[#eafbf0] p-5">
        <InlineText
          value={data.skincareToggleLabel}
          onChange={(v) => onChange({ skincareToggleLabel: v })}
          className="w-fit rounded-full bg-[#16241a] px-3 py-1 text-xs font-semibold text-white"
          placeholder="Toggle label"
        />
        <InlineText
          value={data.skincareEyebrow}
          onChange={(v) => onChange({ skincareEyebrow: v })}
          className="mt-2 w-fit text-xs uppercase tracking-[0.3em] text-[#6a9a72] font-medium"
          placeholder="Eyebrow"
        />
        <InlineText
          value={data.skincareHeadlineLine1}
          onChange={(v) => onChange({ skincareHeadlineLine1: v })}
          className="w-fit text-2xl font-light text-[#16241a]"
          placeholder="Headline line 1"
        />
        <InlineText
          value={data.skincareHeadlineLine2}
          onChange={(v) => onChange({ skincareHeadlineLine2: v })}
          className="w-fit text-2xl font-semibold text-[#16241a]"
          placeholder="Headline line 2"
        />
        <InlineText
          value={data.skincareSubheading}
          onChange={(v) => onChange({ skincareSubheading: v })}
          className="max-w-sm text-sm text-[#16241a]/60"
          placeholder="Subheading"
          multiline
        />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-[#0e0e0e] p-5">
        <InlineText
          value={data.scentToggleLabel}
          onChange={(v) => onChange({ scentToggleLabel: v })}
          className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0e0e0e]"
          placeholder="Toggle label"
        />
        <InlineText
          value={data.scentEyebrow}
          onChange={(v) => onChange({ scentEyebrow: v })}
          className="mt-2 w-fit text-xs uppercase tracking-[0.3em] text-white/50 font-medium"
          placeholder="Eyebrow"
        />
        <InlineText
          value={data.scentHeadlineLine1}
          onChange={(v) => onChange({ scentHeadlineLine1: v })}
          className="w-fit text-2xl font-light text-white"
          placeholder="Headline line 1"
        />
        <InlineText
          value={data.scentHeadlineLine2}
          onChange={(v) => onChange({ scentHeadlineLine2: v })}
          className="w-fit text-2xl font-semibold text-white"
          placeholder="Headline line 2"
        />
        <InlineText
          value={data.scentSubheading}
          onChange={(v) => onChange({ scentSubheading: v })}
          className="max-w-sm text-sm text-white/60"
          placeholder="Subheading"
          multiline
        />
      </div>
    </div>
  );
}
