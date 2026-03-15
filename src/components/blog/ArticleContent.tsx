"use client";

import { useState } from "react";
import Link from "next/link";
import Tag from "@/components/ui/Tag";

interface ArticleContentProps {
  content: string;
  tags?: string[];
  slug: string;
  title: string;
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

// ─── Post share footer ────────────────────────────────────────────────────────

interface ArticleFooterProps {
  tags: string[];
  slug: string;
  title: string;
}

function ArticleFooter({ tags, slug, title }: ArticleFooterProps) {
  const encoded = encodeURIComponent(`https://cyberaffairs.site/blog/${slug}`);
  const text    = encodeURIComponent(title);

  return (
    <footer className="mt-12 pt-8 border-t border-[#E5E7EB] flex flex-col gap-6">
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
            Tags
          </span>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Article tags">
            {tags.map((tag) => (
              <div key={tag} role="listitem">
                <Tag
                  label={tag}
                  variant="outline"
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#F5F3FF] border border-[#E5E7EB]">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-sm font-bold text-[#0D0A2E]">
            Found this article useful?
          </span>
          <span className="font-sans text-xs text-[#6B7280]">
            Share it with your network
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Twitter - Fixed opening tag */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter / X"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            <TwitterIcon />
            Share
          </a>

          {/* LinkedIn - Fixed opening tag */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2"
          >
            <LinkedInIcon />
            Share
          </a>

          {/* Copy link */}
          <CopyLinkButton slug={slug} />
        </div>
      </div>

      {/* Back to blog */}
      <div className="flex justify-start">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#4F46E5] hover:text-[#1E135C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
        >
          <ArrowLeftIcon />
          Back to all articles
        </Link>
      </div>
    </footer>
  );
}

// ─── Copy link button (client interaction) ────────────────────────────────────

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `https://cyberaffairs.site/blog/${slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copied" : "Copy article link"}
      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F5F3FF] hover:text-[#4F46E5] hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}

// ─── Article content ──────────────────────────────────────────────────────────

export default function ArticleContent({
  content,
  tags = [],
  slug,
  title,
}: ArticleContentProps) {
  return (
    <div className="w-full">
      {/* Rendered markdown */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Article footer: tags + share + back */}
      <ArticleFooter tags={tags} slug={slug} title={title} />
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.31H5.078z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}