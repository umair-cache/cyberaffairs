import path from "path";
import {
  CATEGORIES_DIR,
  readAndParse,
  getMarkdownFilenames,
} from "@/lib/markdown";
import { type Category, type CategoryWithCount } from "@/types/category";
import { getAllArticles } from "@/lib/articles";

// ─── Internal helper ──────────────────────────────────────────────────────────

interface CategoryFrontmatter {
  title:        string;
  slug:         string;
  description:  string;
  accentColor?: string;
}

function parseCategory(filename: string): Category | null {
  try {
    const { frontmatter } =
      readAndParse<CategoryFrontmatter>(CATEGORIES_DIR, filename);

    return {
      title:        frontmatter.title,
      slug:         frontmatter.slug ?? filename.replace(/\.md$/, ""),
      description:  frontmatter.description ?? "",
      accentColor:  frontmatter.accentColor,
    };
  } catch {
    return null;
  }
}

// ─── Fetch all categories ─────────────────────────────────────────────────────

/**
 * Returns all categories defined in content/categories/*.md
 */
export function getAllCategories(): Category[] {
  const filenames = getMarkdownFilenames(CATEGORIES_DIR);
  return filenames
    .map(parseCategory)
    .filter((c): c is Category => c !== null);
}

// ─── Fetch single category by slug ───────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | null {
  const filenames = getMarkdownFilenames(CATEGORIES_DIR);

  for (const filename of filenames) {
    const category = parseCategory(filename);
    if (category && category.slug === slug) return category;
  }

  return null;
}

// ─── Categories with article counts ──────────────────────────────────────────

/**
 * Returns every category enriched with how many published articles belong to it.
 * Categories with zero articles are included.
 */
export function getCategoriesWithCount(): CategoryWithCount[] {
  const categories = getAllCategories();
  const articles   = getAllArticles();

  return categories.map((category) => ({
    ...category,
    count: articles.filter(
      (a) => a.category.toLowerCase() === category.slug.toLowerCase()
    ).length,
  }));
}

// ─── All category slugs (for generateStaticParams) ───────────────────────────

export function getAllCategorySlugs(): string[] {
  return getAllCategories().map((c) => c.slug);
}