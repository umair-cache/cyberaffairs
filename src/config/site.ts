export const siteConfig = {
  siteName: "CyberAffairs",
  tagline: "Your Source for Cybersecurity Intelligence",
  description:
    "CyberAffairs covers the latest in cybersecurity threats, hacking techniques, digital privacy, and threat intelligence — curated for security professionals and enthusiasts.",
  url: "https://cyberaffairs.site",
  domain: "cyberaffairs.site",
  defaultOgImage: "/images/site/og-default.png",
  favicon: "/favicon.ico",
  postsPerPage: 9,
  featuredPostsCount: 1,
  relatedPostsCount: 3,
  locale: "en-US",
  timeZone: "UTC",

  author: {
    name: "CyberAffairs Editorial",
    email: "editorial@cyberaffairs.site",
  },

  socials: {
    twitter: "https://twitter.com/cyberaffairs",
    linkedin: "https://linkedin.com/company/cyberaffairs",
    github: "https://github.com/cyberaffairs",
    rss: "/rss.xml",
  },

  analytics: {
    umamiSrc: "https://analytics.umami.is/script.js",
    umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;