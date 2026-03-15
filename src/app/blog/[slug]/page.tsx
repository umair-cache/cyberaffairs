import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ArticleHeader from "@/components/blog/ArticleHeader";
import ArticleContent from "@/components/blog/ArticleContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from "@/lib/articles";
import { siteConfig } from "@/config/site";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const seoTitle       = article.seoTitle       ?? article.title;
  const seoDescription = article.seoDescription ?? article.excerpt;
  const canonicalUrl   = article.canonicalUrl   ?? `${siteConfig.url}/blog/${article.slug}`;
  const ogImage        = article.coverImage.startsWith("http")
    ? article.coverImage
    : `${siteConfig.url}${article.coverImage}`;

  return {
    title: seoTitle,
    description: seoDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type:        "article",
      url:         canonicalUrl,
      title:       seoTitle,
      description: seoDescription,
      siteName:    siteConfig.siteName,
      locale:      siteConfig.locale,
      publishedTime: article.date,
      modifiedTime:  article.updated ?? article.date,
      authors:     [article.author],
      tags:        article.tags,
      images: [
        {
          url:    ogImage,
          width:  1200,
          height: 630,
          alt:    seoTitle,
        },
      ],
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cyberaffairs",
      creator:     "@cyberaffairs",
      title:       seoTitle,
      description: seoDescription,
      images:      [ogImage],
    },
  };
}

// ─── Structured data (JSON-LD) ────────────────────────────────────────────────

function ArticleStructuredData({
  title,
  excerpt,
  slug,
  date,
  updated,
  author,
  coverImage,
  tags,
}: {
  title:      string;
  excerpt:    string;
  slug:       string;
  date:       string;
  updated:    string;
  author:     string;
  coverImage: string;
  tags:       string[];
}) {
  const articleUrl = `${siteConfig.url}/blog/${slug}`;
  const imageUrl   = coverImage.startsWith("http")
    ? coverImage
    : `${siteConfig.url}${coverImage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Article",
    headline:   title,
    description: excerpt,
    url:         articleUrl,
    datePublished: new Date(date).toISOString(),
    dateModified:  new Date(updated ?? date).toISOString(),
    author: {
      "@type": "Person",
      name:    author,
    },
    publisher: {
      "@type": "Organization",
      name:    siteConfig.siteName,
      url:     siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url:     `${siteConfig.url}/icons/logo.png`,
      },
    },
    image: {
      "@type": "ImageObject",
      url:     imageUrl,
      width:   1200,
      height:  630,
    },
    mainEntityOfPage: {
      "@type": "@id",
      "@id":   articleUrl,
    },
    keywords: tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Breadcrumb structured data ───────────────────────────────────────────────

function BreadcrumbStructuredData({
  category,
  title,
  slug,
}: {
  category: string;
  title:    string;
  slug:     string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      {
        "@type":    "ListItem",
        position:   1,
        name:       "Home",
        item:       siteConfig.url,
      },
      {
        "@type":    "ListItem",
        position:   2,
        name:       "Blog",
        item:       `${siteConfig.url}/blog`,
      },
      {
        "@type":    "ListItem",
        position:   3,
        name:       category.replace(/-/g, " "),
        item:       `${siteConfig.url}/category/${category}`,
      },
      {
        "@type":    "ListItem",
        position:   4,
        name:       title,
        item:       `${siteConfig.url}/blog/${slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) notFound();

  const relatedPosts = getRelatedArticles(
    article.slug,
    article.category,
    article.tags,
    siteConfig.relatedPostsCount
  );

  return (
    <>
      {/* Structured data */}
      <ArticleStructuredData
        title={article.title}
        excerpt={article.excerpt}
        slug={article.slug}
        date={article.date}
        updated={article.updated ?? article.date}
        author={article.author}
        coverImage={article.coverImage}
        tags={article.tags}
      />
      <BreadcrumbStructuredData
        category={article.category}
        title={article.title}
        slug={article.slug}
      />

      {/* Article layout */}
      <Container narrow className="py-10 sm:py-14">

        {/* Header: breadcrumb, title, meta, cover image */}
        <ArticleHeader article={article} />

        {/* Body: rendered markdown */}
        <ArticleContent
          content={article.content}
          tags={article.tags}
          slug={article.slug}
          title={article.title}
        />

        {/* Related posts */}
        <RelatedPosts
          posts={relatedPosts}
          currentSlug={article.slug}
        />

      </Container>
    </>
  );
}