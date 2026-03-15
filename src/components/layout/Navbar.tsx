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
      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-[#4F46E5] group-hover:bg-[#1E135C] transition-colors duration-150 flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 1L2 4V8C2 11.31 4.55 14.41 8 15C11.45 14.41 14 11.31 14 8V4L8 1Z" fill="white" fillOpacity="0.9" />
          <path d="M6 8L7.5 9.5L10.5 6.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-sans font-extrabold text-lg tracking-tight text-[#0D0A2E] group-hover:text-[#4F46E5] transition-colors duration-150">
        Cyber<span className="text-[#4F46E5] group-hover:text-[#1E135C] transition-colors duration-150">Affairs</span>
      </span>
    </Link>
  );
}

// ─── Nav Components ───────────────────────────────────────────────────────────

function DesktopNavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative font-sans text-sm font-semibold tracking-wide transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-sm",
        isActive ? "text-[#4F46E5]" : "text-[#374151] hover:text-[#4F46E5]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      <span className={cn("absolute -bottom-0.5 left-0 h-0.5 bg-[#4F46E5] rounded-full transition-all duration-200", isActive ? "w-full" : "w-0")} aria-hidden="true" />
    </Link>
  );
}

function MobileNavLink({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block w-full font-sans text-base font-semibold px-4 py-3 rounded-lg transition-all duration-150",
        isActive ? "bg-[#F5F3FF] text-[#4F46E5]" : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#4F46E5]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

// ─── Navbar Logic ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Close menu on route change safely
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ✅ ENHANCED: Passive scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Handle Outside Clicks & Escape Key
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Prevent background scroll
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm py-2" 
          : "bg-white border-b border-transparent py-4"
      )}
    >
      <div ref={menuRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
              />
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white text-sm font-bold hover:bg-[#4338CA] hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 active:scale-95"
            >
              <RssIcon />
              Read Latest
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", menuOpen && "rotate-45 translate-y-2")} />
              <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", menuOpen && "opacity-0")} />
              <span className={cn("w-full h-0.5 bg-current rounded-full transition-all", menuOpen && "-rotate-45 -translate-y-2")} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden absolute left-0 right-0 bg-white border-b shadow-xl transition-all duration-300 ease-in-out px-4",
            menuOpen ? "top-full opacity-100 visible py-6" : "top-[120%] opacity-0 invisible"
          )}
        >
          <nav className="space-y-2">
            {mainNav.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
                onClick={() => setMenuOpen(false)}
              />
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo-600 text-white font-bold"
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

function RssIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}