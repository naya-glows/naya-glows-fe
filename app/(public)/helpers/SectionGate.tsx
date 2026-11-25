"use client";

import { useGetContentQuery } from "../../store/userApi";
import { isApiConfigured } from "@/lib/api";

// Hides a homepage section when an admin has switched it off from the
// Content editor (see SectionShell's visibility toggle) — shares the exact
// same ContentBlock query the section's own useSectionContent call makes
// (RTK Query dedupes it, so this is never a second network request), it
// just also checks the generic "_visible" flag that lives alongside that
// section's regular content fields.
export default function SectionGate({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: React.ReactNode;
}) {
  const { data } = useGetContentQuery(sectionKey, { skip: !isApiConfigured() });
  const visible = (data?.block?.data as { _visible?: boolean } | undefined)?._visible !== false;
  if (!visible) return null;
  return <>{children}</>;
}
