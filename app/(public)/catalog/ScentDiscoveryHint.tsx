"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const SHOW_DELAY_MS = 1000;
const AUTO_DISMISS_MS = 6000;

// A nudge toward the Scent tab, shown once per page load (not gated by
// localStorage, so a full reload always brings it back) — a magnifying
// glass slides in from the search bar up to the Scent toggle, a ring
// pulses around the button, and a small callout explains why. No
// full-page overlay: that used to sit on top of the real toggle buttons
// and swallow clicks meant for them. Once dismissed — by clicking either
// tab, the callout, or the auto-dismiss timeout — it stays gone for the
// rest of this page's lifetime; only a reload re-arms it.
export default function ScentDiscoveryHint({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!active || dismissedRef.current) return;
    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [active]);

  const dismiss = () => {
    dismissedRef.current = true;
    setVisible(false);
  };

  // `active` flips to false the moment the visitor actually clicks the
  // Scent tab — that's the hint doing its job, so it should disappear
  // immediately rather than linger for its own auto-dismiss timeout.
  useEffect(() => {
    if (!active) dismiss();
  }, [active]);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Pulsing ring around the Scent button. The entrance/loop
              transition has repeat: Infinity, which — if left as the only
              transition on this element — also governs the exit animation,
              so AnimatePresence waits forever for an exit that never
              "completes" and the ring never actually unmounts. Giving the
              exit its own finite transition fixes that. */}
          <motion.span
            className="pointer-events-none absolute -inset-1 z-20 rounded-full"
            style={{ boxShadow: "0 0 0 2px #8ab88e" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.9, 0.2, 0.9], scale: [0.95, 1.08, 0.95] }}
            exit={{ opacity: 0, transition: { duration: 0.25, repeat: 0 } }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Magnifying glass sliding up from the search bar to the button. */}
          <motion.div
            className="pointer-events-none absolute z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg"
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
            className="absolute left-1/2 top-full z-20 mt-3 w-56 -translate-x-1/2 cursor-pointer rounded-xl bg-[#16241a] px-4 py-3 text-center text-xs text-white shadow-xl"
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
