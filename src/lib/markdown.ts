import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { type ArticleFrontmatter } from "@/types/article";
import { calculateReadingTime } from "@/lib/utils";

// ─── Directory roots ──────────────────────────────────────────────────────────

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const ARTICLES_DIR = path.join(CONTENT_ROOT, "articles");
export const AUTHORS_DIR = path.join(CONTENT_ROOT, "authors");
export const CATEGORIES_DIR = path.join(CONTENT_ROOT, "categories");

// ─── Low-level file helpers ───────────────────────────────────────────────────

/**
 * Returns every `.md` filename inside a given directory.
 */
export function getMarkdownFilenames(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"));
}

/**
 * Reads a single markdown file and returns the raw string.
 */
export function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

export interface ParsedMarkdown<TFrontmatter> {
  frontmatter: TFrontmatter;
  rawContent: string;
  readingTime: string;
}

/**
 * Parses a raw markdown string with gray-matter and returns typed
 * frontmatter, the raw markdown body, and a calculated reading time.
 */
export function parseMarkdown<TFrontmatter>(
  raw: string
): ParsedMarkdown<TFrontmatter> {
  const { data, content } = matter(raw);
  return {
    frontmatter: data as TFrontmatter,
    rawContent: content,
    readingTime: calculateReadingTime(content),
  };
}

// ─── Markdown → HTML ──────────────────────────────────────────────────────────

/**
 * Converts a raw markdown string to an HTML string using remark.
 * Supports GitHub Flavoured Markdown (tables, strikethrough, task lists).
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}

// ─── Composed helpers ─────────────────────────────────────────────────────────

/**
 * Reads a markdown file from `directory/filename.md`, parses it, and
 * returns typed frontmatter + raw content + reading time.
 */
export function readAndParse<TFrontmatter>(
  directory: string,
  filename: string
): ParsedMarkdown<TFrontmatter> {
  const filePath = path.join(directory, filename.endsWith(".md") ? filename : `${filename}.md`);
  const raw = readMarkdownFile(filePath);
  return parseMarkdown<TFrontmatter>(raw);
}

/**
 * Reads a markdown file and returns typed frontmatter + rendered HTML
 * content + reading time.
 */
export async function readAndRender<TFrontmatter>(
  directory: string,
  filename: string
): Promise<{ frontmatter: TFrontmatter; htmlContent: string; readingTime: string }> {
  const { frontmatter, rawContent, readingTime } =
    readAndParse<TFrontmatter>(directory, filename);
  const htmlContent = await markdownToHtml(rawContent);
  return { frontmatter, htmlContent, readingTime };
}

/**
 * Reads every `.md` file in a directory and returns an array of parsed
 * frontmatter objects — without rendering HTML (useful for listing pages).
 */
export function readAllFrontmatter<TFrontmatter>(
  directory: string
): Array<TFrontmatter & { _filename: string }> {
  const filenames = getMarkdownFilenames(directory);
  return filenames.map((filename) => {
    const { frontmatter } = readAndParse<TFrontmatter>(directory, filename);
    return { ...frontmatter, _filename: filename };
  });
}

/**
 * Convenience: parse a single article file by its slug.
 * Tries `slug.md` first, then falls back to scanning all files for a
 * matching `slug` field in frontmatter.
 */
export function resolveArticleFilename(slug: string): string | null {
  const direct = path.join(ARTICLES_DIR, `${slug}.md`);
  if (fs.existsSync(direct)) return `${slug}.md`;

  // Fallback: scan all files for a matching frontmatter slug
  const filenames = getMarkdownFilenames(ARTICLES_DIR);
  for (const filename of filenames) {
    const { frontmatter } = readAndParse<ArticleFrontmatter>(
      ARTICLES_DIR,
      filename
    );
    if (frontmatter.slug === slug) return filename;
  }

  return null;
}