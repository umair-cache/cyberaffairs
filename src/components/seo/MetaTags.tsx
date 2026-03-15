import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetaTagsProps {
  title?:         string;
  description?:   string;
  canonicalUrl?:  string;
  ogImage?:       string;
  ogType?:        "website" | "article";
  noIndex?:       boolean;
  publishedTime?: string;
  modifiedTime?:  string;
  author?:        string;
  tags?:          string[];
  category?:      string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveTitle(title?: string): string {
  if (!title) return `${siteConfig.siteName} — ${siteConfig.tagline}`;
  return `${title} | ${siteConfig.siteName}`;
}

function resolveOgImage(ogImage?: string): string {
  if (!ogImage) return `${siteConfig.url}${siteConfig.defaultOgImage}`;
  if (ogImage.startsWith("http")) return ogImage;
  return `${siteConfig.url}${ogImage}`;
}

function resolveCanonical(canonicalUrl?: string): string {
  if (!canonicalUrl) return siteConfig.url;
  if (canonicalUrl.startsWith("http")) return canonicalUrl;
  return `${siteConfig.url}${canonicalUrl}`;
}

// ─── generatePageMetadata helper ─────────────────────────────────────────────
//
// Use this in any page's `generateMetadata` function to produce a fully
// populated Next.js Metadata object from a simple props bag.
//
// Usage:
//   export async function generateMetadata(): Promise<Metadata> {
//     return generatePageMetadata({ title: "Blog", canonicalUrl: "/blog" });
//   }

export function generatePageMetadata({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType    = "website",
  noIndex   = false,
  publishedTime,
  modifiedTime,
  author,
  tags      = [],
  category,
}: MetaTagsProps): Metadata {
  const resolvedTitle     = resolveTitle(title);
  const resolvedDesc      = description ?? siteConfig.description;
  const resolvedCanonical = resolveCanonical(canonicalUrl);
  const resolvedOgImage   = resolveOgImage(ogImage);

  const metadata: Metadata = {
    title:       resolvedTitle,
    description: resolvedDesc,

    alternates: {
      canonical: resolvedCanonical,
      types: {
        "application/rss+xml": `${siteConfig.url}/rss.xml`,
      },
    },

    robots: noIndex
      ? { index: false, follow: false }
      : {
          index:  true,
          follow: true,
          googleBot: {
            index:               true,
            follow:              true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet":       -1,
          },
        },

    openGraph: {
      type:        ogType,
      url:         resolvedCanonical,
      siteName:    siteConfig.siteName,
      title:       resolvedTitle,
      description: resolvedDesc,
      locale:      siteConfig.locale,
      images: [
        {
          url:    resolvedOgImage,
          width:  1200,
          height: 630,
          alt:    resolvedTitle,
        },
      ],
      // Article-specific OG fields
      ...(ogType === "article" && {
        publishedTime: publishedTime,
        modifiedTime:  modifiedTime ?? publishedTime,
        authors:       author ? [author] : [siteConfig.author.name],
        tags:          tags,
        section:       category,
      }),
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cyberaffairs",
      creator:     "@cyberaffairs",
      title:       resolvedTitle,
      description: resolvedDesc,
      images:      [resolvedOgImage],
    },

    authors: [
      {
        name: author ?? siteConfig.author.name,
        url:  siteConfig.url,
      },
    ],

    creator:   siteConfig.siteName,
    publisher: siteConfig.siteName,

    icons: {
      icon:    siteConfig.favicon,
      shortcut: siteConfig.favicon,
      apple:   "/icons/apple-touch-icon.png",
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    },
  };

  return metadata;
}

// ─── MetaTags component ───────────────────────────────────────────────────────
//
// A server component that renders supplemental <meta> tags not covered by
// Next.js Metadata API. Drop it inside any page's JSX output alongside the
// standard metadata export.
//
// Usage:
//   <MetaTags canonicalUrl="/blog/my-article" ogType="article" ... />

export default function MetaTags({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType    = "website",
  noIndex   = false,
  author,
  tags      = [],
  category,
}: MetaTagsProps) {
  const resolvedTitle     = resolveTitle(title);
  const resolvedDesc      = description ?? siteConfig.description;
  const resolvedCanonical = resolveCanonical(canonicalUrl);
  const resolvedOgImage   = resolveOgImage(ogImage);

  return (
    <>
      {/* ── Primary ─────────────────────────────────────────────────── */}
      <meta name="description"         content={resolvedDesc} />
      <meta name="author"              content={author ?? siteConfig.author.name} />
      <meta name="generator"           content="Next.js" />
      <meta name="referrer"            content="origin-when-cross-origin" />
      <link  rel="canonical"           href={resolvedCanonical} />

      {/* ── Robots ──────────────────────────────────────────────────── */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      {/* ── Open Graph ──────────────────────────────────────────────── */}
      <meta property="og:type"         content={ogType} />
      <meta property="og:url"          content={resolvedCanonical} />
      <meta property="og:site_name"    content={siteConfig.siteName} />
      <meta property="og:title"        content={resolvedTitle} />
      <meta property="og:description"  content={resolvedDesc} />
      <meta property="og:image"        content={resolvedOgImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content={resolvedTitle} />
      <meta property="og:locale"       content={siteConfig.locale} />

      {/* ── Article-specific Open Graph ─────────────────────────────── */}
      {ogType === "article" && (
        <>
          {author && (
            <meta property="article:author" content={author} />
          )}
          {category && (
            <meta property="article:section" content={category} />
          )}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* ── Twitter Card ────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@cyberaffairs" />
      <meta name="twitter:creator"     content="@cyberaffairs" />
      <meta name="twitter:title"       content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      <meta name="twitter:image"       content={resolvedOgImage} />
      <meta name="twitter:image:alt"   content={resolvedTitle} />

      {/* ── Additional SEO signals ───────────────────────────────────── */}
      <meta name="theme-color"         content="#1E135C" />
      <meta name="color-scheme"        content="light" />
      <meta name="format-detection"    content="telephone=no" />

      {/* ── RSS feed discovery ───────────────────────────────────────── */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${siteConfig.siteName} RSS Feed`}
        href={`${siteConfig.url}/rss.xml`}
      />
    </>
  );
}