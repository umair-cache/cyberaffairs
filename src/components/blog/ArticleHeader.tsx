import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/article";
import Tag from "@/components/ui/Tag";
import Badge from "@/components/ui/Badge";

interface ArticleHeaderProps {
  article: Article;
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

// ─── Author avatar ────────────────────────────────────────────────────────────

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#4F46E5] text-white font-sans font-semibold text-sm flex-shrink-0"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

// ─── Share buttons ────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  title: string;
  slug: string;
}

function ShareButtons({ title, slug }: ShareButtonsProps) {
  const encoded  = encodeURIComponent(`https://cyberaffairs.site/blog/${slug}`);
  const text     = encodeURIComponent(title);

  const links = [
    {
      label: "Share on Twitter / X",
      href:  `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      icon:  <TwitterIcon />,
    },
    {
      label: "Share on LinkedIn",
      href:  `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      icon:  <LinkedInIcon />,
    },
  ];

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <span className="font-sans text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mr-1">
        Share
      </span>
      {links.map((link) => (
        
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-white hover:bg-[#4F46E5] hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbProps {
  category: string;
  title: string;
}

function Breadcrumb({ category, title }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
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
        <li>
          <Link
            href={`/category/${category}`}
            className="hover:text-[#4F46E5] transition-colors duration-150 focus-visible:outline-none focus-visible:underline capitalize"
          >
            {category.replace(/-/g, " ")}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronIcon />
        </li>
        <li
          className="text-[#374151] font-medium truncate max-w-[200px] sm:max-w-xs"
          aria-current="page"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}

// ─── Article header ───────────────────────────────────────────────────────────

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const accentColor = getCategoryColor(article.category);

  return (
    <header className="w-full">
      {/* Breadcrumb */}
      <Breadcrumb category={article.category} title={article.title} />

      {/* Category + featured badge */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <Tag
          label={article.category.replace(/-/g, " ")}
          href={`/category/${article.category}`}
          variant="solid"
          color={accentColor}
        />
        {article.featured && (
          <Badge variant="warning" dot>
            Featured
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D0A2E] leading-tight tracking-tight mb-5">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="font-serif text-lg sm:text-xl text-[#6B7280] leading-relaxed mb-8 max-w-2xl">
        {article.excerpt}
      </p>

      {/* Meta row: author + date + reading time + share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E5E7EB] mb-8">
        {/* Author + date + reading time */}
        <div className="flex items-center gap-3">
          <AuthorAvatar name={article.author} />
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-sm font-semibold text-[#111111]">
              {article.author}
            </span>
            <div className="flex items-center gap-2 font-sans text-xs text-[#9CA3AF]">
              <time dateTime={article.date}>
                {formatDate(article.date)}
              </time>
              {article.updated && article.updated !== article.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated{" "}
                    <time dateTime={article.updated}>
                      {formatDate(article.updated)}
                    </time>
                  </span>
                </>
              )}
              {article.readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon />
                    {article.readingTime}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <ShareButtons title={article.title} slug={article.slug} />
      </div>

      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#F5F3FF] mb-10 shadow-md">
        <Image
          src={article.coverImage}
          alt={`Cover image for ${article.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 750px"
          className="object-cover"
          priority
        />
        {/* Category color strip */}
        <span
          className="absolute top-0 left-0 w-full h-1.5"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function TwitterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}