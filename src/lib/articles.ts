import path from "path";
import {
  ARTICLES_DIR,
  readAndParse,
  readAndRender,
  readAllFrontmatter,
  resolveArticleFilename,
  getMarkdownFilenames,
} from "@/lib/markdown";
import { type ArticleFrontmatter, type Article, type ArticleCardData } from "@/types/article";
import { siteConfig } from "@/config/site";

// ─── Internal helper ──────────────────────────────────────────────────────────

function normalizeArticle(
  frontmatter: ArticleFrontmatter,
  readingTime: string
): ArticleCardData {
  return {
    title:       frontmatter.title,
    slug:        frontmatter.slug,
    date:        frontmatter.date,
    author:      frontmatter.author,
    category:    frontmatter.category,
    tags:        frontmatter.tags ?? [],
    coverImage:  frontmatter.coverImage ?? "/images/site/default-cover.jpg",
    excerpt:     frontmatter.excerpt ?? "",
    featured:    frontmatter.featured ?? false,
    readingTime,
  };
}

// ─── Fetch all articles (card data only — no HTML) ────────────────────────────

/**
 * Returns all published articles sorted newest first.
 * Safe to call at build time from any Server Component or generateStaticParams.
 */
export function getAllArticles(): ArticleCardData[] {
  const filenames = getMarkdownFilenames(ARTICLES_DIR);

  const articles: ArticleCardData[] = filenames
    .map((filename) => {
      const { frontmatter, readingTime } =
        readAndParse<ArticleFrontmatter>(ARTICLES_DIR, filename);

      if (!frontmatter.published) return null;

      return normalizeArticle(frontmatter, readingTime);
    })
    .filter((a): a is ArticleCardData => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

// ─── Fetch single article (with rendered HTML) ────────────────────────────────

/**
 * Returns a fully rendered Article by slug, or null if not found / unpublished.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filename = resolveArticleFilename(slug);
  if (!filename) return null;

  const { frontmatter, htmlContent, readingTime } =
    await readAndRender<ArticleFrontmatter>(ARTICLES_DIR, filename);

  if (!frontmatter.published) return null;

  return {
    ...frontmatter,
    slug:        frontmatter.slug ?? slug,
    coverImage:  frontmatter.coverImage ?? "/images/site/default-cover.jpg",
    tags:        frontmatter.tags ?? [],
    featured:    frontmatter.featured ?? false,
    content:     htmlContent,
    readingTime,
    canonicalUrl:
      frontmatter.canonicalUrl ??
      `${siteConfig.url}/blog/${frontmatter.slug ?? slug}`,
  };
}

// ─── Fetch all static slugs (for generateStaticParams) ───────────────────────

export function getAllArticleSlugs(): string[] {
  const filenames = getMarkdownFilenames(ARTICLES_DIR);

  return filenames
    .map((filename) => {
      const { frontmatter } =
        readAndParse<ArticleFrontmatter>(ARTICLES_DIR, filename);
      if (!frontmatter.published) return null;
      return frontmatter.slug ?? filename.replace(/\.md$/, "");
    })
    .filter((slug): slug is string => slug !== null);
}

// ─── Filtered queries ─────────────────────────────────────────────────────────

export function getArticlesByCategory(category: string): ArticleCardData[] {
  return getAllArticles().filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
}

export function getArticlesByTag(tag: string): ArticleCardData[] {
  return getAllArticles().filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getFeaturedArticles(): ArticleCardData[] {
  return getAllArticles().filter((a) => a.featured);
}

export function getLatestArticles(count: number): ArticleCardData[] {
  return getAllArticles().slice(0, count);
}

// ─── Related articles ─────────────────────────────────────────────────────────

export function getRelatedArticles(
  currentSlug: string,
  category: string,
  tags: string[],
  count: number = siteConfig.relatedPostsCount
): ArticleCardData[] {
  return getAllArticles()
    .filter(
      (a) =>
        a.slug !== currentSlug &&
        (a.category === category ||
          a.tags.some((t) => tags.includes(t)))
    )
    .slice(0, count);
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedArticles {
  articles:   ArticleCardData[];
  total:      number;
  totalPages: number;
  currentPage: number;
}

export function getPaginatedArticles(
  page: number,
  perPage: number = siteConfig.postsPerPage
): PaginatedArticles {
  const all        = getAllArticles();
  const total      = all.length;
  const totalPages = Math.ceil(total / perPage);
  const current    = Math.min(Math.max(page, 1), totalPages || 1);
  const start      = (current - 1) * perPage;
  const articles   = all.slice(start, start + perPage);

  return { articles, total, totalPages, currentPage: current };
}

// ─── All unique tags ──────────────────────────────────────────────────────────

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getAllArticles().forEach((a) => a.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}