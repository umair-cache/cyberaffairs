import type { Metadata } from "next";
import { siteConfig } from "./site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },

  description: siteConfig.description,

  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],

  creator: siteConfig.siteName,
  publisher: siteConfig.siteName,

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
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.siteName} — ${siteConfig.tagline}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@cyberaffairs",
    creator: "@cyberaffairs",
    title: `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },

  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },

  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: "/icons/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};