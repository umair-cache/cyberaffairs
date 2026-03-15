import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.siteName} — a cybersecurity news and intelligence platform covering threats, hacking techniques, digital privacy, and security research.`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/about`,
    title: `About | ${siteConfig.siteName}`,
    description: `Learn about ${siteConfig.siteName} — a cybersecurity news and intelligence platform.`,
    siteName: siteConfig.siteName,
  },
};

// ─── Structured data ──────────────────────────────────────────────────────────

function AboutStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.siteName}`,
    url: `${siteConfig.url}/about`,
    description: siteConfig.description,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.siteName,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: <ShieldIcon />,
    title: "Accuracy First",
    description:
      "Every article is thoroughly researched and verified before publication. We cite primary sources and correct errors transparently.",
  },
  {
    icon: <EyeIcon />,
    title: "Independent Voice",
    description:
      "We are editorially independent. Our coverage is not influenced by advertisers, vendors, or any external parties.",
  },
  {
    icon: <LockIcon />,
    title: "Privacy by Default",
    description:
      "We practice what we preach. Minimal data collection, no invasive tracking, and full respect for reader privacy.",
  },
  {
    icon: <UsersIcon />,
    title: "Community Driven",
    description:
      "Built for the security community — practitioners, researchers, and enthusiasts who need actionable intelligence.",
  },
];

const coverageAreas = [
  { label: "Cybersecurity Threats", href: "/category/cybersecurity", description: "Breaking vulnerabilities, CVEs, and attack campaigns" },
  { label: "Hacking Techniques", href: "/category/hacking", description: "Offensive security, exploits, and pen testing" },
  { label: "Digital Privacy", href: "/category/privacy", description: "Surveillance, data protection, and privacy tools" },
  { label: "Threat Intelligence", href: "/category/threat-intelligence", description: "APT tracking, malware analysis, and IOCs" },
  { label: "Tech News", href: "/category/tech-news", description: "Security-relevant technology and industry updates" },
  { label: "Security Research", href: "/category/security-research", description: "Academic and industry security research findings" },
];

const stats = [
  { value: "100+", label: "Articles Published" },
  { value: "6", label: "Coverage Categories" },
  { value: "Daily", label: "Update Frequency" },
  { value: "Free", label: "Always & Forever" },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden rounded-2xl bg-[#1E135C] px-8 py-14 sm:px-14 mb-16"
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366F1, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4F46E5]" aria-hidden="true">
            <ShieldSmallIcon />
          </span>
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#818CF8]">
            About {siteConfig.siteName}
          </span>
        </div>

        {/* Heading */}
        <h1
          id="about-hero-heading"
          className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5"
        >
          Cybersecurity intelligence
          <br />
          <span className="text-[#818CF8]">for everyone.</span>
        </h1>

        {/* Description */}
        <p className="font-sans text-base sm:text-lg text-[#A5B4FC] leading-relaxed mb-8 max-w-xl">
          {siteConfig.siteName} is an independent cybersecurity publication
          delivering accurate, timely, and accessible security intelligence to
          professionals, researchers, and anyone who cares about staying safe
          online.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#4F46E5] text-white hover:bg-[#6366F1] border border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E135C]"
          >
            Read the Blog
            <ArrowRightIcon />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-5 py-2.5 rounded-lg bg-transparent text-white hover:bg-white/10 border border-white/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E135C]"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Stats ───────────────────────────────────────────────────────────

function StatsSection() {
  return (
    <section aria-label="Site statistics" className="mb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1 p-6 rounded-xl border border-[#E5E7EB] bg-white text-center"
          >
            <span className="font-sans text-3xl font-extrabold text-[#4F46E5]">
              {stat.value}
            </span>
            <span className="font-sans text-sm text-[#6B7280]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Mission ─────────────────────────────────────────────────────────

function MissionSection() {
  return (
    <section aria-labelledby="mission-heading" className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
              Our Mission
            </p>
            <h2
              id="mission-heading"
              className="font-sans text-2xl sm:text-3xl font-extrabold text-[#0D0A2E] tracking-tight"
            >
              Making cybersecurity knowledge accessible
            </h2>
          </div>

          <div className="flex flex-col gap-4 font-sans text-base text-[#6B7280] leading-relaxed">
            <p>
              The cybersecurity landscape evolves at an unprecedented pace.
              Nation-state actors, ransomware groups, and zero-day exploits
              headline the news daily — yet accurate, in-depth coverage remains
              fragmented across paywalls and specialist forums.
            </p>
            <p>
              {siteConfig.siteName} was founded to bridge that gap. We cover the
              threat landscape with the depth practitioners demand and the clarity
              that makes it accessible to everyone — from CISOs to curious
              newcomers.
            </p>
            <p>
              Every article we publish is written to be accurate, actionable, and
              free — because good security knowledge should not be locked behind
              a subscription.
            </p>
          </div>
        </div>

        {/* Visual card */}
        <div className="flex flex-col gap-3">
          {coverageAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="group flex items-start gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#4F46E5] hover:bg-[#F5F3FF] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <span
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5F3FF] group-hover:bg-[#EEF2FF] transition-colors duration-150"
                aria-hidden="true"
              >
                <ChevronIcon />
              </span>
              <div className="min-w-0">
                <span className="block font-sans text-sm font-bold text-[#0D0A2E] group-hover:text-[#4F46E5] transition-colors duration-150">
                  {area.label}
                </span>
                <span className="block font-sans text-xs text-[#9CA3AF] mt-0.5">
                  {area.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Values ──────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section aria-labelledby="values-heading" className="mb-16">
      <div className="text-center mb-10">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
          What We Stand For
        </p>
        <h2
          id="values-heading"
          className="font-sans text-2xl sm:text-3xl font-extrabold text-[#0D0A2E] tracking-tight"
        >
          Our Editorial Values
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col gap-4 p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#4F46E5] hover:shadow-[0_4px_20px_rgba(79,70,229,0.08)] transition-all duration-200"
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5F3FF]"
              aria-hidden="true"
            >
              {value.icon}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-sans text-sm font-bold text-[#0D0A2E]">
                {value.title}
              </h3>
              <p className="font-sans text-sm text-[#6B7280] leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Contact CTA ─────────────────────────────────────────────────────

function ContactCta() {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 sm:p-12 text-center"
    >
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#4F46E5] mb-3">
        Get Involved
      </p>
      <h2
        id="contact-cta-heading"
        className="font-sans text-2xl sm:text-3xl font-extrabold text-[#0D0A2E] tracking-tight mb-3"
      >
        Have a tip or story?
      </h2>
      <p className="font-sans text-base text-[#6B7280] max-w-md mx-auto mb-8 leading-relaxed">
        We welcome security researchers, industry professionals, and readers to
        share tips, submit research, or reach out for any reason.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3 rounded-lg bg-[#4F46E5] text-white hover:bg-[#1E135C] border border-transparent transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          Contact Us
          <ArrowRightIcon />
        </Link>
        
        {/* Fixed: Added missing opening <a> tag here */}
        <a
          href={`mailto:${siteConfig.author.email}`}
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-3 rounded-lg bg-white text-[#374151] border border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          aria-label="Email our editorial team"
        >
          <MailIcon />
          {siteConfig.author.email}
        </a>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <AboutStructuredData />

      <Container className="py-10 sm:py-14">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <ValuesSection />
        <ContactCta />
      </Container>
    </>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ShieldSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 1L2 4V8C2 11.31 4.55 14.41 8 15C11.45 14.41 14 11.31 14 8V4L8 1Z" fill="white" fillOpacity="0.9" />
      <path d="M6 8L7.5 9.5L10.5 6.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}