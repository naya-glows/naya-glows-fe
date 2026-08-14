import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import StoreProvider from "./store/StoreProvider";
import CartFlyOverlay from "./components/CartFlyOverlay";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nayaglows.skin"),
  title: "Naya Glows | Radiance-Boosting Skincare for Healthy, Glowing Skin",
  description: "Discover clean, potent skincare designed to brighten, hydrate, and renew your complexion. Shop serums, creams, cleansers, and body care for radiant results.",
  keywords: [
    "skincare",
    "brightening skincare",
    "kojic acid",
    "niacinamide",
    "hyaluronic acid",
    "face serum",
    "body scrub",
    "clean beauty",
    "cruelty-free skincare",
    "hyperpigmentation treatment",
    "glowing skin",
    "Naya Glows",
  ],
  authors: [{ name: "Naya Glows" }],
  creator: "Naya Glows",
  publisher: "Naya Glows",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Naya Glows | Radiance-Boosting Skincare",
    description: "Reveal your natural glow with clean, potent ingredients. Kojic acid, niacinamide, and hyaluronic acid for brighter, healthier skin.",
    url: "https://nayaglows.skin",
    siteName: "Naya Glows",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381892/naya-glows/legacy/naya-logo.png",
        width: 500,
        height: 500,
        alt: "Naya Glows Logo",
      },
      {
        url: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381893/naya-glows/legacy/naya-radiance-body-scrub-in-focu.png",
        width: 1200,
        height: 630,
        alt: "Naya Radiance Exfoliating Body Scrub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naya Glows | Radiance-Boosting Skincare",
    description: "Clean, potent skincare for brighter, healthier skin. Free shipping on orders ₦120,000+",
    images: ["https://res.cloudinary.com/bhozkz7o/image/upload/v1784381893/naya-glows/legacy/naya-radiance-body-scrub-in-focu.png"],
    creator: "@nayaglows",
    site: "@nayaglows",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/shortcut-icon.png"],
  },
  manifest: "/site.webmanifest",
  verification: {
    // Add your verification tokens when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "beauty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          {children}
          <Toaster richColors position="top-center" />
          <CartFlyOverlay />
        </StoreProvider>
      </body>
    </html>
  );
}