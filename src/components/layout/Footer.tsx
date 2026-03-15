import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";

// ─── Social icons ─────────────────────────────────────────────────────────────

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function RssIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 1L2 4V8C2 11.31 4.55 14.41 8 15C11.45 14.41 14 11.31 14 8V4L8 1Z" fill="white" fillOpacity="0.9" />
      <path d="M6 8L7.5 9.5L10.5 6.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Social link ──────────────────────────────────────────────────────────────

interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#4F46E5] border border-[#E5E7EB] hover:border-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-[#0D0A2E] text-white mt-auto"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top section */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 group w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-md"
              aria-label={`${siteConfig.siteName} — Home`}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#4F46E5] group-hover:bg-[#6366F1] transition-colors duration-150 flex-shrink-0">
                <ShieldIcon />
              </span>
              <span className="font-sans font-extrabold text-lg tracking-tight text-white group-hover:text-[#6366F1] transition-colors duration-150">
                Cyber<span className="text-[#6366F1] group-hover:text-white transition-colors duration-150">Affairs</span>
              </span>
            </Link>

            {/* Description */}
            <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2" aria-label="Social media links">
              <SocialLink href={siteConfig.socials.twitter} label="Follow us on Twitter">
                <TwitterIcon />
              </SocialLink>
              <SocialLink href={siteConfig.socials.linkedin} label="Connect on LinkedIn">
                <LinkedInIcon />
              </SocialLink>
              <SocialLink href={siteConfig.socials.github} label="View on GitHub">
                <GitHubIcon />
              </SocialLink>
              <SocialLink href={siteConfig.socials.rss} label="Subscribe to RSS feed">
                <RssIcon />
              </SocialLink>
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((group) => (
            <div key={group.heading} className="flex flex-col gap-4">
              <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-[#6B7280]">
                {group.heading}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-[#9CA3AF] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white/10" />

      {/* Bottom bar */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="font-sans text-xs text-[#6B7280]">
            &copy; {currentYear}{" "}
            <Link
              href="/"
              className="hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm"
            >
              {siteConfig.siteName}
            </Link>
            . All rights reserved.
          </p>

          {/* Right: domain + security note */}
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-sans text-xs text-[#6B7280]">
              <LockIcon />
              {siteConfig.domain}
            </span>
            <span className="font-sans text-xs text-[#4B5563]">
              Built with Next.js · Hosted on Cloudflare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Lock icon ────────────────────────────────────────────────────────────────

function LockIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}