import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Config ───────────────────────────────────────────────────────────────────

const SITE_URL      = "https://cyberaffairs.site";
const OUTPUT_PATH   = path.join(process.cwd(), "public", "sitemap.xml");
const ARTICLES_DIR  = path.join(process.cwd(), "content", "articles");
const CATEGORIES_DIR = path.join(process.cwd(), "content", "categories");

// ─── Types ────────────────────────────────────────────────────────────────────

interface SitemapUrl {
  loc:        string;
  lastmod?:   string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority:   number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function readMarkdownFiles(directory: string): Array<Record<string, string>> {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw        = fs.readFileSync(path.join(directory, file), "utf-8");
      const { data }   = matter(raw);
      return data as Record<string, string>;
    });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&apos;");
}

function buildUrlTag(entry: SitemapUrl): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    entry.lastmod
      ? `    <lastmod>${entry.lastmod}</lastmod>`
      : "",
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority.toFixed(1)}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── URL collectors ───────────────────────────────────────────────────────────

function getStaticUrls(): SitemapUrl[] {
  const today = new Date().toISOString().slice(0, 10);

  return [
    {
      loc:        `${SITE_URL}/`,
      lastmod:    today,
      changefreq: "daily",
      priority:   1.0,
    },
    {
      loc:        `${SITE_URL}/blog`,
      lastmod:    today,
      changefreq: "daily",
      priority:   0.9,
    },
    {
      loc:        `${SITE_URL}/about`,
      lastmod:    today,
      changefreq: "monthly",
      priority:   0.6,
    },
    {
      loc:        `${SITE_URL}/contact`,
      lastmod:    today,
      changefreq: "monthly",
      priority:   0.5,
    },
  ];
}

function getArticleUrls(): SitemapUrl[] {
  const articles = readMarkdownFiles(ARTICLES_DIR);

  return articles
    .filter((fm) => fm.published === true || fm.published === "true")
    .map((fm) => ({
      loc:        `${SITE_URL}/blog/${fm.slug}`,
      lastmod:    toISODate(fm.updated ?? fm.date),
      changefreq: "weekly" as const,
      priority:   fm.featured === true || fm.featured === "true" ? 0.9 : 0.8,
    }));
}

function getCategoryUrls(): SitemapUrl[] {
  const categories = readMarkdownFiles(CATEGORIES_DIR);
  const today      = new Date().toISOString().slice(0, 10);

  return categories.map((fm) => ({
    loc:        `${SITE_URL}/category/${fm.slug}`,
    lastmod:    today,
    changefreq: "weekly" as const,
    priority:   0.7,
  }));
}

// ─── Sitemap builder ──────────────────────────────────────────────────────────

function buildSitemap(urls: SitemapUrl[]): string {
  const urlTags = urls.map(buildUrlTag).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    "",
    urlTags,
    "",
    "</urlset>",
  ].join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generateSitemap(): Promise<void> {
  console.log("🗺️  Generating sitemap…");

  try {
    const staticUrls   = getStaticUrls();
    const articleUrls  = getArticleUrls();
    const categoryUrls = getCategoryUrls();

    const allUrls = [
      ...staticUrls,
      ...articleUrls,
      ...categoryUrls,
    ];

    // Deduplicate by loc
    const seen    = new Set<string>();
    const uniqueUrls = allUrls.filter((u) => {
      if (seen.has(u.loc)) return false;
      seen.add(u.loc);
      return true;
    });

    const xml = buildSitemap(uniqueUrls);

    // Ensure public/ exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, xml, "utf-8");

    console.log(`✅ Sitemap generated → ${OUTPUT_PATH}`);
    console.log(`   Static URLs:   ${staticUrls.length}`);
    console.log(`   Article URLs:  ${articleUrls.length}`);
    console.log(`   Category URLs: ${categoryUrls.length}`);
    console.log(`   Total URLs:    ${uniqueUrls.length}`);
  } catch (error) {
    console.error("❌ Failed to generate sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();