import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
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
        // Cloudinary on-the-fly transforms (q_auto:good,f_jpg) — the
        // untransformed originals were 744KB/PNG, which some link-preview
        // crawlers (WhatsApp in particular) will time out on or skip
        // entirely. Same images, ~15x lighter, universally-supported JPEG.
        url: "https://res.cloudinary.com/bhozkz7o/image/upload/q_auto:good,f_jpg/v1784381892/naya-glows/legacy/naya-logo.png",
        width: 500,
        height: 500,
        alt: "Naya Glows Logo",
      },
      {
        url: "https://res.cloudinary.com/bhozkz7o/image/upload/w_1200,h_630,c_fill,q_auto:good,f_jpg/v1784381893/naya-glows/legacy/naya-radiance-body-scrub-in-focu.png",
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
    images: ["https://res.cloudinary.com/bhozkz7o/image/upload/w_1200,h_630,c_fill,q_auto:good,f_jpg/v1784381893/naya-glows/legacy/naya-radiance-body-scrub-in-focu.png"],
    creator: "@nayaglows",
    site: "@nayaglows",
  },
  // No manual `icons`/`manifest` entries here — app/favicon.ico,
  // app/icon.png, app/apple-icon.png, and app/manifest.ts are all Next.js's
  // own file-based conventions, auto-detected and auto-linked. The previous
  // manual config here pointed at /icon.png, /apple-icon.png,
  // /shortcut-icon.png, and /site.webmanifest, none of which actually
  // existed anywhere in the project — every one 404'd in production,
  // which is almost certainly why Google never picked up a favicon.
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
        <Script
          src="https://www.usesetch.xyz/widget.js"
          data-setch-site="site_1b587e16b183"
          data-setch-api="https://www.usesetch.xyz"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}