import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Config ───────────────────────────────────────────────────────────────────

const SITE_URL      = "https://cyberaffairs.site";
const SITE_NAME     = "CyberAffairs";
const SITE_DESC     = "Your Source for Cybersecurity Intelligence — covering threats, hacking techniques, digital privacy, and threat intelligence.";
const AUTHOR_EMAIL  = "editorial@cyberaffairs.site";
const AUTHOR_NAME   = "CyberAffairs Editorial";
const OUTPUT_PATH   = path.join(process.cwd(), "public", "rss.xml");
const ARTICLES_DIR  = path.join(process.cwd(), "content", "articles");
const MAX_ITEMS     = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleFrontmatter {
  title:       string;
  slug:        string;
  date:        string;
  updated?:    string;
  author:      string;
  category:    string;
  tags?:       string[];
  excerpt:     string;
  coverImage?: string;
  published:   boolean;
  featured?:   boolean;
  seoDescription?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&apos;");
}

function toRfc822(dateStr: string): string {
  try {
    return new Date(dateStr).toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

function resolveImageUrl(src?: string): string | null {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src}`;
}

// ─── Article loader ───────────────────────────────────────────────────────────

function loadPublishedArticles(): ArticleFrontmatter[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const filenames = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"));

  return filenames
    .map((filename) => {
      const raw      = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return data as ArticleFrontmatter;
    })
    .filter((fm) => fm.published === true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_ITEMS);
}

// ─── RSS item builder ─────────────────────────────────────────────────────────

function buildItem(article: ArticleFrontmatter): string {
  const articleUrl  = `${SITE_URL}/blog/${article.slug}`;
  const description = article.seoDescription ?? article.excerpt;
  const imageUrl    = resolveImageUrl(article.coverImage);
  const tags        = article.tags ?? [];

  const enclosure = imageUrl
    ? `    <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />`
    : "";

  const categoryTags = [article.category, ...tags]
    .map((t) => `    <category>${escapeXml(t)}</category>`)
    .join("\n");

  const mediaContent = imageUrl
    ? `    <media:content url="${escapeXml(imageUrl)}" medium="image" />`
    : "";

  return [
    "  <item>",
    `    <title>${escapeXml(article.title)}</title>`,
    `    <link>${escapeXml(articleUrl)}</link>`,
    `    <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <pubDate>${toRfc822(article.date)}</pubDate>`,
    article.updated
      ? `    <dc:modified>${toRfc822(article.updated)}</dc:modified>`
      : "",
    `    <author>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(article.author)})</author>`,
    `    <dc:creator>${escapeXml(article.author)}</dc:creator>`,
    categoryTags,
    enclosure,
    mediaContent,
    "  </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Feed builder ─────────────────────────────────────────────────────────────

function buildFeed(articles: ArticleFrontmatter[]): string {
  const buildDate   = new Date().toUTCString();
  const lastBuildDate = articles.length > 0
    ? toRfc822(articles[0].date)
    : buildDate;

  const items = articles.map(buildItem).join("\n\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '  xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '  xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '  xmlns:media="http://search.yahoo.com/mrss/"',
    '  xmlns:atom="http://www.w3.org/2005/Atom">',
    "",
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(SITE_DESC)}</description>`,
    `    <language>en-us</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <pubDate>${buildDate}</pubDate>`,
    `    <ttl>60</ttl>`,
    `    <copyright>Copyright ${new Date().getFullYear()} ${SITE_NAME}</copyright>`,
    `    <managingEditor>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(AUTHOR_NAME)})</managingEditor>`,
    `    <webMaster>${escapeXml(AUTHOR_EMAIL)} (${escapeXml(AUTHOR_NAME)})</webMaster>`,
    "",
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    "",
    `    <image>`,
    `      <url>${SITE_URL}/icons/logo.png</url>`,
    `      <title>${escapeXml(SITE_NAME)}</title>`,
    `      <link>${SITE_URL}</link>`,
    `      <width>144</width>`,
    `      <height>144</height>`,
    `    </image>`,
    "",
    items,
    "",
    "  </channel>",
    "</rss>",
  ].join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generateRssFeed(): Promise<void> {
  console.log("📡 Generating RSS feed…");

  try {
    const articles = loadPublishedArticles();
    const feed     = buildFeed(articles);

    // Ensure public/ exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, feed, "utf-8");

    console.log(`✅ RSS feed generated → ${OUTPUT_PATH}`);
    console.log(`   Articles included: ${articles.length}`);
    console.log(`   Feed URL:          ${SITE_URL}/rss.xml`);
  } catch (error) {
    console.error("❌ Failed to generate RSS feed:", error);
    process.exit(1);
  }
}

generateRssFeed();