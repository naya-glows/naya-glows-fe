import { useEffect } from "react";

// A full-page redirect to Paystack never unmounts the checkout page — it
// just navigates away. If the shopper cancels (or hits "back") on Paystack's
// hosted page, the browser can restore this exact page from bfcache with
// whatever "Redirecting to Paystack…" state it had right before the
// redirect, since nothing ever re-ran to reset it. `pageshow`'s `persisted`
// flag is true specifically for that bfcache-restore case (not a normal
// fresh load), which is what distinguishes it from the page's own effects
// simply re-running on mount.
export function usePaystackReturnReset(onReturn: () => void) {
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) onReturn();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [onReturn]);
}
