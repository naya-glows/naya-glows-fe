"use client";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import RouteTransitionCleanup from "../components/RouteTransitionCleanup";
import { useUserAuth } from "../store/useUserAuth";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserAuth();

  return (
    <>
      <RouteTransitionCleanup />
      <Navbar />
      <main className={`overflow-x-hidden ${user ? "pb-18.5 lg:pb-0" : ""}`}>
        {children}
      </main>
      <Footer />
      {user && <MobileBottomNav />}
    </>
  );
}
