import type { Metadata } from "next";
import { Syne, Crimson_Pro } from "next/font/google";
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
      className={`${syne.variable} ${crimsonPro.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Umami analytics — only injected when the env var is set */}
        {siteConfig.analytics.umamiWebsiteId && (
          <script
            defer
            src={siteConfig.analytics.umamiSrc}
            data-website-id={siteConfig.analytics.umamiWebsiteId}
          />
        )}
      </head>

      <body className="flex min-h-screen flex-col bg-white font-sans text-[#111111] antialiased">
        {/* Skip to main content — accessibility */}
        
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
      </body>
    </html>
  );
}