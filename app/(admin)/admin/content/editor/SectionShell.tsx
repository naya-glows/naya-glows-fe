"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Titled card wrapper every section editor renders inside. `onSave` is
// optional — the homepage group shares one sticky save bar instead (see
// page.tsx), so only the standalone sections (catalog hero, contact info,
// branches) pass save/dirty/saving here.
export function SectionShell({
  title,
  children,
  customized,
  dirty,
  onSave,
  saving,
}: {
  title: string;
  children: ReactNode;
  customized?: boolean;
  dirty?: boolean;
  onSave?: () => void;
  saving?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-white/60 bg-white/60 backdrop-blur-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#16241a]/50">
            {title}
          </p>
          {customized && (
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#4f7957] bg-[#d4e8d0] px-2 py-0.5 rounded-full">
              Customized
            </span>
          )}
        </div>
        {onSave && dirty && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-[#16241a] px-4 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 size={12} className="animate-spin" />}
            Save
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
