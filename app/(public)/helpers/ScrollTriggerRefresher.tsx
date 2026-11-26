"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Every homepage section calculates its own GSAP ScrollTrigger entrance
// animation independently, in its own mount-time effect — each one's
// start/end boundaries are resolved from the page's layout at that exact
// moment. A section whose content settles into place *after* a sibling's
// trigger was already calculated (a later-mounting block above it, a
// content-editor fetch resolving, late-loading images/fonts) leaves that
// sibling's boundaries stale: the classic symptom is a section staying
// invisible until the visitor scrolls past it and back up slowly.
// Recalculating every registered trigger once the page has actually
// settled fixes that without touching any individual section's own
// animation.
export default function ScrollTriggerRefresher() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    // Images/fonts/the initial resource set.
    window.addEventListener("load", refresh);
    // Client-side data (content-editor overrides, product fetches) resolves
    // after hydration and isn't covered by `load` — a couple of delayed
    // passes catches the common cases without wiring every section itself.
    const timers = [setTimeout(refresh, 800), setTimeout(refresh, 2000)];
    return () => {
      window.removeEventListener("load", refresh);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
