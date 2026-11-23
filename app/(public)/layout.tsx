import Script from "next/script";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import RouteTransitionCleanup from "../components/RouteTransitionCleanup";

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
      {/* Scoped to the public site only — this used to be in the root
          layout, which also wraps /admin, putting the chat bubble on every
          admin page too. */}
      <Script
        src="https://www.usesetch.xyz/widget.js"
        data-setch-site="site_1b587e16b183"
        data-setch-api="https://www.usesetch.xyz"
        strategy="afterInteractive"
      />
    </>
  );
}
