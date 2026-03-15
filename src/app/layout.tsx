import type { Metadata } from "next";
import { Syne, Crimson_Pro, Space_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { defaultMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@/styles/typography.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  ...defaultMetadata,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${crimsonPro.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-white font-sans text-[#111111] antialiased">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-[#4F46E5] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Global navbar */}
        <Navbar />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Global footer */}
        <Footer />

        {/* Umami analytics — Optimized with next/script */}
        {siteConfig.analytics?.umamiWebsiteId && (
          <Script
            src={siteConfig.analytics.umamiSrc}
            data-website-id={siteConfig.analytics.umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}