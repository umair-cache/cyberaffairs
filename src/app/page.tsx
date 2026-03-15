import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/blog/ArticleCard";
import Tag from "@/components/ui/Tag";
import Badge from "@/components/ui/Badge";
import { getAllArticles, getFeaturedArticles, getLatestArticles, getArticlesByCategory } from "@/lib/articles";
import { getCategoriesWithCount } from "@/lib/categories";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import type { ArticleCardData } from "@/types/article";
import type { CategoryWithCount } from "@/types/category";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.siteName} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type:        "website",
    url:         siteConfig.url,
    title:       `${siteConfig.siteName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName:    siteConfig.siteName,
  },
};

// ─── Website structured data ──────────────────────────────────────────────────

function WebsiteStructuredData() {
  const jsonLd = {
    "@context":  "https://schema.org",
    "@type":     "WebSite",
    name:        siteConfig.siteName,
    description: siteConfig.description,
    url:         siteConfig.url,
    potentialAction: {
      "@type":       "SearchAction",
      target:        `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Category color map ───────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  cybersecurity:         "#4F46E5",
  hacking:               "#DC2626",
  privacy:               "#0891B2",
  "threat-intelligence": "#D97706",
  "tech-news":           "#059669",
  "security-research":   "#7C3AED",
};

function getCategoryColor(category: string): string {
  return categoryColors[category.toLowerCase()] ?? "#4F46E5";
}

// ─── Hero section ─────────────────────────────────────────────────────────────

function HeroSection({ article }: { article: ArticleCardData }) {
  const accentColor = getCategoryColor(article.category);

  return (
    <section aria-label="Featured article" className="w-full mb-16">
      <article className="group relative w-full rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white hover:border-[#4F46E5] hover:shadow-[0_8px_40px_rgba(79,70,229,0.12)] transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Cover image - Hidden from screen readers to prevent redundant link announcements */}
          <Link
            href={`/blog/${article.slug}`}
            aria-hidden="true"
            className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-[#F5F3FF] focus-visible:outline-none"
            tabIndex={-1}
          >
            <Image
              src={article.coverImage}
              alt={`Cover image for ${article.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Category strip */}
            <span
              className="absolute top-0 left-0 w-full h-1.5"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />
            {/* Featured badge overlay */}
            <div className="absolute top-4 left-4">
              <Badge variant="warning" dot>
                Featured
              </Badge>
            </div>
          </Link>

          {/* Content */}
          <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
            {/* Category + reading time */}
            <div className="flex items-center gap-3 flex-wrap">
              <Tag
                label={article.category.replace(/-/g, " ")}
                href={`/category/${article.category}`}
                variant="solid"
                color={accentColor}
              />
              {article.readingTime && (
                <span className="font-sans text-xs text-[#9CA3AF] flex items-center gap-1">
                  <ClockIcon />
                  {article.readingTime}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D0A2E] leading-tight tracking-tight group-hover:text-[#4F46E5] transition-colors duration-150">
              <Link
                href={`/blog/${article.slug}`}
                className="focus-visible:outline-none focus-visible:underline"
              >
                {article.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="font-serif text-base sm:text-lg text-[#6B7280] leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>

            {/* Author + date */}
            <div className="flex items-center gap-3">
              <AuthorAvatar name={article.author} className="w-10 h-10 text-base" />
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-sm font-semibold text-[#111111]">
                  {article.author}
                </span>
                <time
                  dateTime={article.date}
                  className="font-sans text-xs text-[#9CA3AF]"
                >
                  {formatDate(article.date)}
                </time>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-2">
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#4F46E5] text-white border border-transparent hover:bg-[#1E135C] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                aria-label={`Read full article: ${article.title}`}
              >
                Read Article
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow:  string;
  title:    string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

function SectionHeader({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div className="flex flex-col gap-1">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
          {eyebrow}
        </p>
        <h2 className="font-sans text-2xl font-extrabold text-[#0D0A2E] tracking-tight">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden sm:inline-flex items-center gap-1 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm flex-shrink-0 ml-4"
        >
          {viewAllLabel}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}

// ─── Latest articles section ──────────────────────────────────────────────────

function LatestArticlesSection({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading" className="mb-16">
      <SectionHeader
        eyebrow="Latest"
        title="Recent Articles"
        viewAllHref="/blog"
        viewAllLabel="View all articles"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.slug}
            article={article}
            priority={index < 3}
          />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="flex sm:hidden justify-center mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
        >
          View all articles
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

// ─── Category spotlight section ───────────────────────────────────────────────

interface CategorySpotlightProps {
  category: CategoryWithCount;
  articles: ArticleCardData[];
}

function CategorySpotlight({ category, articles }: CategorySpotlightProps) {
  if (articles.length === 0) return null;

  const accentColor = category.accentColor ?? getCategoryColor(category.slug);
  const [hero, ...rest] = articles;

  return (
    <section
      aria-labelledby={`category-${category.slug}-heading`}
      className="mb-16"
    >
      <SectionHeader
        eyebrow="Topic"
        title={category.title}
        viewAllHref={`/category/${category.slug}`}
        viewAllLabel={`All ${category.title}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Hero card */}
        {hero && (
          <ArticleCard
            article={hero}
            variant="default"
            priority={false}
          />
        )}

        {/* Side stack */}
        {rest.length > 0 && (
          <div className="flex flex-col divide-y divide-[#F3F4F6] border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
            {/* Stack header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: `3px solid ${accentColor}` }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              />
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#6B7280]">
                More in {category.title}
              </span>
            </div>

            {/* Side articles */}
            {rest.slice(0, 3).map((article) => (
              <SideArticleRow key={article.slug} article={article} />
            ))}

            {/* Footer link */}
            <div className="px-4 py-3 bg-[#F9FAFB]">
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                View all {category.title} articles
                <ArrowRightIcon size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Side article row ─────────────────────────────────────────────────────────

function SideArticleRow({ article }: { article: ArticleCardData }) {
  return (
    <article className="group flex items-start gap-3 p-4 hover:bg-[#F5F3FF] transition-colors duration-150">
      {/* Thumbnail - Hidden from screen readers to prevent redundant link announcements */}
      <Link
        href={`/blog/${article.slug}`}
        aria-hidden="true"
        className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#F5F3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        tabIndex={-1}
      >
        <Image
          src={article.coverImage}
          alt={`Cover for ${article.title}`}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>

      {/* Text */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-sans text-sm font-bold text-[#0D0A2E] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-150">
          <Link
            href={`/blog/${article.slug}`}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {article.title}
          </Link>
        </h3>
        <time
          dateTime={article.date}
          className="font-sans text-[11px] text-[#9CA3AF]"
        >
          {formatDate(article.date)}
        </time>
      </div>
    </article>
  );
}

// ─── Categories overview section ──────────────────────────────────────────────

function CategoriesSection({ categories }: { categories: CategoryWithCount[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="topics-heading" className="mb-16">
      <SectionHeader eyebrow="Explore" title="Browse by Topic" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const color = cat.accentColor ?? getCategoryColor(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E5E7EB] bg-white text-center hover:border-[#4F46E5] hover:shadow-[0_4px_20px_rgba(79,70,229,0.10)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              aria-label={`Browse ${cat.title} (${cat.count} articles)`}
            >
              {/* Icon circle */}
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${color}18` }}
                aria-hidden="true"
              >
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </span>

              {/* Label */}
              <span className="font-sans text-xs font-bold text-[#374151] group-hover:text-[#4F46E5] transition-colors duration-150 leading-tight">
                {cat.title}
              </span>

              {/* Count */}
              <span className="font-sans text-[10px] text-[#9CA3AF]">
                {cat.count} {cat.count === 1 ? "article" : "articles"}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Newsletter / CTA banner ──────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mb-16 relative overflow-hidden rounded-2xl bg-[#1E135C] px-8 py-12 sm:px-12"
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3"
        style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3"
        style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        {/* Text */}
        <div className="flex flex-col gap-3 max-w-lg">
          <div className="flex items-center gap-2">
            <ShieldIcon />
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#818CF8]">
              Stay Informed
            </span>
          </div>
          <h2
            id="cta-heading"
            className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            Stay ahead of the threat landscape
          </h2>
          <p className="font-sans text-sm text-[#A5B4FC] leading-relaxed">
            Get the latest cybersecurity news, threat intelligence, and security
            research delivered straight to your inbox.
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-5 py-3 rounded-lg bg-[#4F46E5] text-white hover:bg-[#6366F1] border border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E135C]"
          >
            Read Latest Articles
            <ArrowRightIcon />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-5 py-3 rounded-lg bg-transparent text-white hover:bg-white/10 border border-white/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E135C]"
          >
            About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Author avatar ────────────────────────────────────────────────────────────

// Optimized fix: Tailwind CSS dynamic class compilation bug removed
function AuthorAvatar({ name, className = "w-8 h-8 text-sm" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#4F46E5] text-white font-sans font-semibold flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

// ─── No articles fallback ─────────────────────────────────────────────────────

function NoArticlesFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span
        className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5F3FF] border border-[#E5E7EB] mb-5"
        aria-hidden="true"
      >
        <ShieldIcon size={28} color="#4F46E5" />
      </span>
      <h2 className="font-sans text-xl font-bold text-[#0D0A2E] mb-2">
        Content coming soon
      </h2>
      <p className="font-sans text-sm text-[#6B7280] max-w-sm">
        CyberAffairs is being set up. Check back shortly for the latest
        cybersecurity news and research.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const allArticles    = getAllArticles();
  const featuredList   = getFeaturedArticles();
  const latestArticles = getLatestArticles(6);
  const categories     = getCategoriesWithCount();

  // Pick hero: first featured, fallback to first published
  const heroArticle = featuredList[0] ?? allArticles[0] ?? null;

  // Latest excluding the hero article
  const latestExcludingHero = latestArticles.filter(
    (a) => a.slug !== heroArticle?.slug
  ).slice(0, 6);

  // Top 2 categories with articles for spotlight sections
  const topCategories = categories.filter((c) => c.count > 0).slice(0, 2);

  return (
    <>
      <WebsiteStructuredData />

      <Container className="py-10 sm:py-14">

        {allArticles.length === 0 ? (
          <NoArticlesFallback />
        ) : (
          <>
            {/* ── Hero ──────────────────────────────────────────────────── */}
            {heroArticle && <HeroSection article={heroArticle} />}

            {/* ── Latest articles ───────────────────────────────────────── */}
            {latestExcludingHero.length > 0 && (
              <LatestArticlesSection articles={latestExcludingHero} />
            )}

            {/* ── Categories overview ───────────────────────────────────── */}
            {categories.length > 0 && (
              <CategoriesSection categories={categories} />
            )}

            {/* ── Category spotlights ───────────────────────────────────── */}
            {topCategories.map((cat) => {
              const catArticles = getArticlesByCategory(cat.slug).slice(0, 4);
              return (
                <CategorySpotlight
                  key={cat.slug}
                  category={cat}
                  articles={catArticles}
                />
              );
            })}

            {/* ── CTA banner ────────────────────────────────────────────── */}
            <CtaBanner />
          </>
        )}
      </Container>
    </>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShieldIcon({
  size = 20,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}