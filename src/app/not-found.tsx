import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: `404 — Page Not Found | ${siteConfig.siteName}`,
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: false },
};

// ─── Quick links ──────────────────────────────────────────────────────────────

const quickLinks = [
  { label: "Home",          href: "/",                         description: "Back to the homepage"              },
  { label: "Blog",          href: "/blog",                     description: "Browse all articles"               },
  { label: "Cybersecurity", href: "/category/cybersecurity",   description: "Cybersecurity news & research"     },
  { label: "Privacy",       href: "/category/privacy",         description: "Digital privacy guides"            },
  { label: "Threat Intel",  href: "/category/threat-intelligence", description: "Threat intelligence reports"   },
  { label: "About",         href: "/about",                    description: "Learn about CyberAffairs"          },
];

// ─── 404 page ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-24 sm:py-32 text-center">

      {/* Graphic */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Glow ring */}
        <span
          className="absolute inline-block w-40 h-40 rounded-full bg-[#4F46E5]/10 blur-2xl"
          aria-hidden="true"
        />

        {/* Shield icon */}
        <span
          className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-[#F5F3FF] border-2 border-[#E5E7EB]"
          aria-hidden="true"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M24 4L6 12V24C6 33.94 13.65 43.24 24 46C34.35 43.24 42 33.94 42 24V12L24 4Z"
              fill="#EEF2FF"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M24 18V26"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="24" cy="32" r="1.5" fill="#4F46E5" />
          </svg>
        </span>
      </div>

      {/* Error code */}
      <p className="font-mono text-sm font-bold tracking-[0.3em] uppercase text-[#4F46E5] mb-3">
        Error 404
      </p>

      {/* Heading */}
      <h1 className="font-sans text-4xl sm:text-5xl font-extrabold text-[#0D0A2E] mb-4 tracking-tight">
        Page Not Found
      </h1>

      {/* Description */}
      <p className="font-sans text-base sm:text-lg text-[#6B7280] max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for has been moved, deleted, or never existed.
        It may also have been taken offline by a threat actor.
      </p>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#4F46E5] text-white border border-transparent hover:bg-[#1E135C] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          <HomeIcon />
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg bg-white text-[#374151] border border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#F5F3FF] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          <ArticleIcon />
          Browse Articles
        </Link>
      </div>

      {/* Quick links */}
      <div className="w-full max-w-lg">
        <p className="font-sans text-xs font-bold tracking-widest uppercase text-[#9CA3AF] mb-4">
          Explore
        </p>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left"
          role="list"
        >
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#F3F4F6] bg-white hover:border-[#4F46E5] hover:bg-[#F5F3FF] transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <ChevronIcon />
                <span>
                  <span className="block font-sans text-sm font-semibold text-[#111111] group-hover:text-[#4F46E5] transition-colors duration-150">
                    {link.label}
                  </span>
                  <span className="block font-sans text-xs text-[#9CA3AF] mt-0.5">
                    {link.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-[#4F46E5]" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}