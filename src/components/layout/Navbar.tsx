"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-md"
      aria-label={`${siteConfig.siteName} — Home`}
    >
      {/* Icon mark */}
      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#4F46E5] group-hover:bg-[#1E135C] transition-colors duration-150 flex-shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 1L2 4V8C2 11.31 4.55 14.41 8 15C11.45 14.41 14 11.31 14 8V4L8 1Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M6 8L7.5 9.5L10.5 6.5"
            stroke="#4F46E5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="font-sans font-800 text-lg tracking-tight text-[#0D0A2E] group-hover:text-[#4F46E5] transition-colors duration-150">
        Cyber<span className="text-[#4F46E5] group-hover:text-[#1E135C] transition-colors duration-150">Affairs</span>
      </span>
    </Link>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function DesktopNavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-sans text-sm font-semibold tracking-wide transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm",
        isActive
          ? "text-[#4F46E5]"
          : "text-[#374151] hover:text-[#4F46E5]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      {/* Active underline */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-0.5 bg-[#4F46E5] rounded-full transition-all duration-200",
          isActive ? "w-full" : "w-0"
        )}
        aria-hidden="true"
      />
    </Link>
  );
}

// ─── Mobile nav link ──────────────────────────────────────────────────────────

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ href, label, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block w-full font-sans text-base font-semibold px-4 py-3 rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]",
        isActive
          ? "bg-[#F5F3FF] text-[#4F46E5]"
          : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────

interface HamburgerProps {
  open: boolean;
  onClick: () => void;
}

function Hamburger({ open, onClick }: HamburgerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      className="flex items-center justify-center w-9 h-9 rounded-lg text-[#374151] hover:text-[#4F46E5] hover:bg-[#F5F3FF] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {open ? (
          /* X icon */
          <path
            d="M5 5L15 15M5 15L15 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        ) : (
          /* Hamburger icon */
          <>
            <path d="M3 5H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M3 10H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M3 15H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname            = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef             = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b transition-all duration-200",
        scrolled ? "border-[#E5E7EB] shadow-sm" : "border-transparent"
      )}
      role="banner"
    >
      <div
        ref={menuRef}
        className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Main bar */}
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-6"
          >
            {mainNav.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-[#4F46E5] text-white border border-transparent hover:bg-[#1E135C] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              <RssIcon />
              Read Latest
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 py-3 pb-5 border-t border-[#F3F4F6]"
          >
            {mainNav.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                }
                onClick={() => setMenuOpen(false)}
              />
            ))}

            {/* Mobile CTA */}
            <div className="mt-3 pt-3 border-t border-[#F3F4F6] px-4">
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full font-sans text-sm font-semibold px-4 py-3 rounded-lg bg-[#4F46E5] text-white hover:bg-[#1E135C] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <RssIcon />
                Read Latest
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ─── RSS icon ─────────────────────────────────────────────────────────────────

function RssIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}