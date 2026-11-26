"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const STORAGE_KEY = "naya-catalog-scent-hint-seen";
const AUTO_DISMISS_MS = 6000;

// First-visit-only nudge toward the Scent tab, shown once per browser —
// a magnifying glass slides in from the search bar up to the Scent toggle
// (literally "you're searching — here's something to discover"), a ring
// pulses around the button, and a small callout explains why. Dismissed by
// clicking the Scent tab itself, clicking anywhere else, or a timeout —
// whichever comes first never shows it again.
export default function ScentDiscoveryHint({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {
      // localStorage unavailable — fall through and show it anyway; worst
      // case it shows again on a later visit, which is harmless.
    }
    const showTimer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(showTimer);
  }, [active]);

  // `active` flips to false the moment the visitor actually clicks the
  // Scent tab — that's the hint doing its job, so it should disappear
  // immediately rather than linger for its own auto-dismiss timeout.
  useEffect(() => {
    if (!active && visible) dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Best-effort only — see the comment above.
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Catches a click anywhere else on the page to dismiss. */}
          <motion.div
            className="fixed inset-0 z-40"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Pulsing ring around the Scent button. */}
          <motion.span
            className="pointer-events-none absolute -inset-1 z-40 rounded-full"
            style={{ boxShadow: "0 0 0 2px #8ab88e" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.9, 0.2, 0.9], scale: [0.95, 1.08, 0.95] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Magnifying glass sliding up from the search bar to the button. */}
          <motion.div
            className="pointer-events-none absolute z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg"
            initial={{ opacity: 0, x: -18, y: 180, rotate: -20, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, y: -4, rotate: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ right: -6, top: -6 }}
          >
            <Search size={16} className="text-[#4f7957]" />
          </motion.div>

          {/* Callout bubble. */}
          <motion.div
            role="button"
            tabIndex={0}
            onClick={dismiss}
            className="absolute left-1/2 top-full z-40 mt-3 w-56 -translate-x-1/2 cursor-pointer rounded-xl bg-[#16241a] px-4 py-3 text-center text-xs text-white shadow-xl"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Looking for fragrance? Try our Scent collection
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#16241a]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
