"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetContentQuery } from "@/app/store/userApi";
import { useUpsertContentMutation } from "@/app/store/adminApi";
import { getApiErrorMessage } from "@/app/store/apiError";
import { mergeContent } from "@/app/store/useSectionContent";
import { isApiConfigured } from "@/lib/api";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// One standalone section's own load-once-then-edit-locally-then-save draft,
// independent of the homepage group's shared batch save (see
// HomepageGroup.tsx) — used for the smaller, less-related content keys
// (catalog hero, contact info, branches) that each get their own inline
// Save button instead.
export function useSectionDraft<T extends Record<string, unknown>>(key: string, defaults: T) {
  const { data, isLoading } = useGetContentQuery(key, { skip: !isApiConfigured() });
  const [upsertContent, { isLoading: saving }] = useUpsertContentMutation();
  const [draft, setDraft] = useState<T | null>(null);
  const [saved, setSaved] = useState<T | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || isLoading) return;
    const initial = mergeContent(defaults, data?.block?.data);
    setDraft(clone(initial));
    setSaved(clone(initial));
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data]);

  const update = (patch: Partial<T>) => setDraft((prev) => (prev ? { ...prev, ...patch } : prev));

  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  const save = async () => {
    if (!draft) return;
    try {
      await upsertContent({ key, data: draft }).unwrap();
      setSaved(clone(draft));
      toast.success("Section saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not save this section."));
    }
  };

  return { draft, update, dirty, save, saving, loading: isLoading && !hydrated.current };
}
