import Script from "next/script";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import RouteTransitionCleanup from "../components/RouteTransitionCleanup";
import SpinToWinPopup from "./helpers/SpinToWinPopup";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RouteTransitionCleanup />
      <Navbar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
      <SpinToWinPopup />
      {/* Scoped to the public site only — this used to be in the root
          layout, which also wraps /admin, putting the chat bubble on every
          admin page too. Also configured as the inline search widget (see
          the <div data-setch-search> slots in Navbar.tsx/CatalogClient.tsx)
          — one script, not two, since it's the same Setch instance; Setch
          hides its own floating pill/tab automatically whenever a
          data-setch-search slot is present on the page. Colors/radius match
          this site's own sage-green accent (#4f7957) and cream background
          (#fdf8f3, the --background token in globals.css); radius 9999 is
          a fully pill-shaped bar, matching the catalog page's own search
          field before this swap. */}
      <Script
        src="https://www.usesetch.xyz/widget.js"
        data-setch-site="site_1b587e16b183"
        data-setch-api="https://www.usesetch.xyz"
        data-setch-widget="search"
        data-setch-color="#4f7957"
        data-setch-inner="#fdf8f3"
        data-setch-radius="9999"
        strategy="afterInteractive"
      />
    </>
  );
}
