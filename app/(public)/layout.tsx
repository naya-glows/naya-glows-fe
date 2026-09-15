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
    </>
  );
}
