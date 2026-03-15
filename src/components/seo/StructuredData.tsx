import { siteConfig } from "@/config/site";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleSchemaProps {
  title:       string;
  description: string;
  slug:        string;
  date:        string;
  updated?:    string;
  author:      string;
  coverImage:  string;
  tags?:       string[];
  category?:   string;
}

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

interface CategorySchemaProps {
  title:       string;
  description: string;
  slug:        string;
}

interface FaqItem {
  question: string;
  answer:   string;
}

interface FaqSchemaProps {
  items: FaqItem[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function resolveImageUrl(src: string): string {
  if (src.startsWith("http")) return src;
  return `${siteConfig.url}${src}`;
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  );
}

// ─── WebSite schema ───────────────────────────────────────────────────────────

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${siteConfig.url}/#website`,
    name:        siteConfig.siteName,
    description: siteConfig.description,
    url:         siteConfig.url,
    inLanguage:  "en-US",
    potentialAction: {
      "@type":       "SearchAction",
      target:        `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      "@id":   `${siteConfig.url}/#organization`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
      logo: {
        "@type":   "ImageObject",
        url:       `${siteConfig.url}/icons/logo.png`,
        width:     512,
        height:    512,
      },
      sameAs: [
        siteConfig.socials.twitter,
        siteConfig.socials.linkedin,
        siteConfig.socials.github,
      ],
    },
  };

  return <JsonLd data={data} />;
}

// ─── Organization schema ──────────────────────────────────────────────────────

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${siteConfig.url}/#organization`,
    name:        siteConfig.siteName,
    url:         siteConfig.url,
    email:       siteConfig.author.email,
    description: siteConfig.description,
    logo: {
      "@type":   "ImageObject",
      url:       `${siteConfig.url}/icons/logo.png`,
      width:     512,
      height:    512,
    },
    sameAs: [
      siteConfig.socials.twitter,
      siteConfig.socials.linkedin,
      siteConfig.socials.github,
    ],
    contactPoint: {
      "@type":           "ContactPoint",
      contactType:       "editorial",
      email:             siteConfig.author.email,
      availableLanguage: "English",
    },
  };

  return <JsonLd data={data} />;
}

// ─── Article schema ───────────────────────────────────────────────────────────

export function ArticleSchema({
  title,
  description,
  slug,
  date,
  updated,
  author,
  coverImage,
  tags     = [],
  category,
}: ArticleSchemaProps) {
  const articleUrl  = `${siteConfig.url}/blog/${slug}`;
  const imageUrl    = resolveImageUrl(coverImage);

  const data = {
    "@context": "https://schema.org",
    "@type":    "Article",
    "@id":      `${articleUrl}/#article`,
    headline:    title,
    description,
    url:         articleUrl,
    datePublished: new Date(date).toISOString(),
    dateModified:  new Date(updated ?? date).toISOString(),
    inLanguage:    "en-US",

    author: {
      "@type": "Person",
      name:    author,
      url:     siteConfig.url,
    },

    publisher: {
      "@type": "Organization",
      "@id":   `${siteConfig.url}/#organization`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url:     `${siteConfig.url}/icons/logo.png`,
        width:   512,
        height:  512,
      },
    },

    image: {
      "@type":  "ImageObject",
      url:      imageUrl,
      width:    1200,
      height:   630,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":   articleUrl,
    },

    isPartOf: {
      "@type": "WebSite",
      "@id":   `${siteConfig.url}/#website`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },

    keywords:        tags.join(", "),
    articleSection:  category,
    wordCount:       undefined,
  };

  return <JsonLd data={data} />;
}

// ─── Breadcrumb schema ────────────────────────────────────────────────────────

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type":   "ListItem",
      position:  index + 1,
      name:      item.name,
      item:      item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };

  return <JsonLd data={data} />;
}

// ─── Category (CollectionPage) schema ─────────────────────────────────────────

export function CategorySchema({
  title,
  description,
  slug,
}: CategorySchemaProps) {
  const categoryUrl = `${siteConfig.url}/category/${slug}`;

  const data = {
    "@context":  "https://schema.org",
    "@type":     "CollectionPage",
    "@id":       `${categoryUrl}/#collectionpage`,
    name:         title,
    description,
    url:          categoryUrl,
    inLanguage:   "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id":   `${siteConfig.url}/#website`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },
  };

  return <JsonLd data={data} />;
}

// ─── FAQ schema ───────────────────────────────────────────────────────────────

export function FaqSchema({ items }: FaqSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: items.map((item) => ({
      "@type":        "Question",
      name:           item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:    item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// ─── About page schema ────────────────────────────────────────────────────────

export function AboutPageSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "AboutPage",
    "@id":      `${siteConfig.url}/about/#aboutpage`,
    name:       `About ${siteConfig.siteName}`,
    description: siteConfig.description,
    url:        `${siteConfig.url}/about`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id":   `${siteConfig.url}/#website`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },
    about: {
      "@type": "Organization",
      "@id":   `${siteConfig.url}/#organization`,
    },
  };

  return <JsonLd data={data} />;
}

// ─── Contact page schema ──────────────────────────────────────────────────────

export function ContactPageSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "ContactPage",
    "@id":      `${siteConfig.url}/contact/#contactpage`,
    name:       `Contact ${siteConfig.siteName}`,
    description: `Get in touch with the ${siteConfig.siteName} editorial team.`,
    url:        `${siteConfig.url}/contact`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id":   `${siteConfig.url}/#website`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },
  };

  return <JsonLd data={data} />;
}

// ─── Blog listing schema ──────────────────────────────────────────────────────

export function BlogListingSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type":    "Blog",
    "@id":      `${siteConfig.url}/blog/#blog`,
    name:       `${siteConfig.siteName} Blog`,
    description: `Cybersecurity articles, threat intelligence reports, and security research published by ${siteConfig.siteName}.`,
    url:        `${siteConfig.url}/blog`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id":   `${siteConfig.url}/#website`,
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      "@id":   `${siteConfig.url}/#organization`,
    },
  };

  return <JsonLd data={data} />;
}