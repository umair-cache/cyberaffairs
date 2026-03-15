import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/blog/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import { getAllArticles, getPaginatedArticles } from "@/lib/articles";
import { getCategoriesWithCount } from "@/lib/categories";
import { siteConfig } from "@/config/site";
import type { CategoryWithCount } from "@/types/category";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog",
  description: `Browse all cybersecurity articles, threat intelligence reports, and security research published by ${siteConfig.siteName}.`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: `Blog | ${siteConfig.siteName}`,
    description: `Browse all cybersecurity articles, threat intelligence reports, and security research published by ${siteConfig.siteName}.`,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

// ─── Page props ───────────────────────────────────────────────────────────────

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

// ─── Category filter bar ──────────────────────────────────────────────────────

interface CategoryFilterProps {
  categories: CategoryWithCount[];
  activeCategory?: string;
}

function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="list"
      aria-label="Filter by category"
    >
      {/* All */}
      <Link
        href="/blog"
        role="listitem"
        aria-current={!activeCategory ? "page" : undefined}
        className={`inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 ${
          !activeCategory
            ? "bg-[#4F46E5] text-white border-[#4F46E5]"
            : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5]"
        }`}
      >
        All
        <span
          className={`inline-flex items-center justify-center text-[10px] min-w-[18px] h-[18px] px-1 rounded-full font-bold ${
            !activeCategory
              ? "bg-white/20 text-white"
              : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          {getAllArticles().length}
        </span>
      </Link>

      {/* Per-category */}
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          role="listitem"
          aria-label={`Filter by ${cat.title} (${cat.count} articles)`}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          style={{ "--cat-color": cat.accentColor } as React.CSSProperties}
        >
          {/* Color dot */}
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: cat.accentColor ?? "#4F46E5" }}
            aria-hidden="true"
          />
          {cat.title}
          <span className="inline-flex items-center justify-center text-[10px] min-w-[18px] h-[18px] px-1 rounded-full bg-[#F3F4F6] text-[#6B7280] font-bold">
            {cat.count}
          </span>
        </Link>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
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
        No articles yet
      </h2>
      <p className="font-sans text-sm text-[#6B7280] max-w-sm">
        Articles are on their way. Check back soon for the latest cybersecurity
        news and research.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage   = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const perPage       = siteConfig.postsPerPage;

  const { articles, total, totalPages } = getPaginatedArticles(
    currentPage,
    perPage
  );

  const categories = getCategoriesWithCount();

  return (
    <Container className="py-10 sm:py-14">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="mb-10">
        {/* Eyebrow */}
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
          All Articles
        </p>

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0D0A2E] tracking-tight mb-2">
              CyberAffairs Blog
            </h1>
            <p className="font-sans text-base text-[#6B7280] max-w-xl">
              In-depth articles on cybersecurity threats, hacking techniques,
              digital privacy, and threat intelligence.
            </p>
          </div>

          {/* Article count */}
          {total > 0 && (
            <span className="font-sans text-sm text-[#9CA3AF] flex-shrink-0">
              {total} {total === 1 ? "article" : "articles"}
            </span>
          )}
        </div>
      </div>

      {/* ── Category filter ───────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="mb-8 pb-8 border-b border-[#F3F4F6]">
          <CategoryFilter categories={categories} />
        </div>
      )}

      {/* ── Articles grid ─────────────────────────────────────────────── */}
      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Articles list"
          >
            {articles.map((article, index) => (
              <ArticleCard
                key={article.slug}
                article={article}
                priority={index < 3}
              />
            ))}
          </div>

          {/* ── Pagination ─────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/blog"
              />

              {/* Page info */}
              <p className="font-sans text-xs text-[#9CA3AF]">
                Page {currentPage} of {totalPages} &mdash; {total} total articles
              </p>
            </div>
          )}
        </>
      )}
    </Container>
  );
}