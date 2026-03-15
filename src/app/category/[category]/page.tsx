import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/blog/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import { getArticlesByCategory, getPaginatedArticles } from "@/lib/articles";
import { getAllCategories, getCategoryBySlug, getCategoriesWithCount } from "@/lib/categories";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import type { CategoryWithCount } from "@/types/category";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface PageProps {
  params:       { category: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    return {
      title:       "Category Not Found",
      description: "The requested category could not be found.",
      robots:      { index: false, follow: false },
    };
  }

  const title       = `${category.title} Articles`;
  const description = category.description || `Browse all ${category.title} articles on ${siteConfig.siteName}.`;
  const canonical   = `${siteConfig.url}/category/${category.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type:        "website",
      url:         canonical,
      title:       `${title} | ${siteConfig.siteName}`,
      description,
      siteName:    siteConfig.siteName,
    },

    twitter: {
      card:        "summary_large_image",
      site:        "@cyberaffairs",
      title:       `${title} | ${siteConfig.siteName}`,
      description,
    },
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────

function CategoryStructuredData({
  title,
  description,
  slug,
}: {
  title:       string;
  description: string;
  slug:        string;
}) {
  const jsonLd = {
    "@context":   "https://schema.org",
    "@type":      "CollectionPage",
    name:         title,
    description,
    url:          `${siteConfig.url}/category/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name:    siteConfig.siteName,
      url:     siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbStructuredData({
  title,
  slug,
}: {
  title: string;
  slug:  string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      {
        "@type":   "ListItem",
        position:  1,
        name:      "Home",
        item:      siteConfig.url,
      },
      {
        "@type":   "ListItem",
        position:  2,
        name:      "Blog",
        item:      `${siteConfig.url}/blog`,
      },
      {
        "@type":   "ListItem",
        position:  3,
        name:      title,
        item:      `${siteConfig.url}/category/${slug}`,
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

// ─── Category sidebar ─────────────────────────────────────────────────────────

interface CategorySidebarProps {
  categories:     CategoryWithCount[];
  activeSlug:     string;
}

function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  return (
    <aside aria-label="All categories" className="w-full">
      <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">
        All Topics
      </h2>
      <ul className="flex flex-col gap-1" role="list">
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                  isActive
                    ? "bg-[#4F46E5] text-white"
                    : "text-[#374151] hover:bg-[#F5F3FF] hover:text-[#4F46E5]"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {/* Color dot */}
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.7)"
                        : (cat.accentColor ?? "#4F46E5"),
                    }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{cat.title}</span>
                </span>
                {/* Article count */}
                <span
                  className={`inline-flex items-center justify-center text-[10px] min-w-[20px] h-5 px-1 rounded-full font-bold flex-shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {cat.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ categoryTitle }: { categoryTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span
        className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5F3FF] border border-[#E5E7EB] mb-5"
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </span>
      <h2 className="font-sans text-xl font-bold text-[#0D0A2E] mb-2">
        No articles in {categoryTitle} yet
      </h2>
      <p className="font-sans text-sm text-[#6B7280] max-w-sm mb-6">
        We&apos;re working on articles for this category. Check back soon or
        browse other topics.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#1E135C] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
      >
        Browse all articles
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoryPage({ params, searchParams }: PageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) notFound();

  const currentPage  = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const perPage      = siteConfig.postsPerPage;
  const allArticles  = getArticlesByCategory(params.category);
  const total        = allArticles.length;
  const totalPages   = Math.ceil(total / perPage);
  const start        = (currentPage - 1) * perPage;
  const articles     = allArticles.slice(start, start + perPage);
  const categories   = getCategoriesWithCount();

  return (
    <>
      {/* Structured data */}
      <CategoryStructuredData
        title={category.title}
        description={category.description}
        slug={category.slug}
      />
      <BreadcrumbStructuredData
        title={category.title}
        slug={category.slug}
      />

      <Container className="py-10 sm:py-14">

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 flex-wrap font-sans text-sm text-[#9CA3AF]">
            <li>
              <Link
                href="/"
                className="hover:text-[#4F46E5] transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon />
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-[#4F46E5] transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon />
            </li>
            <li
              className="font-medium text-[#374151]"
              aria-current="page"
            >
              {category.title}
            </li>
          </ol>
        </nav>

        {/* ── Main layout: sidebar + content ────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <div className="w-full lg:w-56 xl:w-64 flex-shrink-0">
            <CategorySidebar
              categories={categories}
              activeSlug={params.category}
            />
          </div>

          {/* ── Content column ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Category header */}
            <div className="mb-8 pb-8 border-b border-[#F3F4F6]">
              {/* Color strip + eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.accentColor ?? "#4F46E5" }}
                  aria-hidden="true"
                />
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
                  Topic
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0D0A2E] tracking-tight mb-2">
                    {category.title}
                  </h1>
                  {category.description && (
                    <p className="font-sans text-base text-[#6B7280] max-w-xl leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Article count */}
                {total > 0 && (
                  <span className="font-sans text-sm text-[#9CA3AF] flex-shrink-0">
                    {total} {total === 1 ? "article" : "articles"}
                  </span>
                )}
              </div>
            </div>

            {/* ── Articles grid ──────────────────────────────────────────── */}
            {articles.length === 0 ? (
              <EmptyState categoryTitle={category.title} />
            ) : (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  aria-label={`${category.title} articles`}
                >
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      priority={index < 3}
                    />
                  ))}
                </div>

                {/* ── Pagination ─────────────────────────────────────────── */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={`/category/${params.category}`}
                    />
                    <p className="font-sans text-xs text-[#9CA3AF]">
                      Page {currentPage} of {totalPages} &mdash; {total} total articles
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}