export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  heading: string;
  links: NavLink[];
}

export const mainNav: NavLink[] = [
  { label: "Home",             href: "/"                             },
  { label: "Blog",             href: "/blog"                         },
  { label: "Cybersecurity",    href: "/category/cybersecurity"       },
  { label: "Privacy",          href: "/category/privacy"             },
  { label: "Threat Intel",     href: "/category/threat-intelligence" },
  { label: "About",            href: "/about"                        },
];

export const footerNav: FooterGroup[] = [
  {
    heading: "Topics",
    links: [
      { label: "Cybersecurity",        href: "/category/cybersecurity"        },
      { label: "Hacking",              href: "/category/hacking"              },
      { label: "Privacy",              href: "/category/privacy"              },
      { label: "Threat Intelligence",  href: "/category/threat-intelligence"  },
      { label: "Tech News",            href: "/category/tech-news"            },
      { label: "Security Research",    href: "/category/security-research"    },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about"   },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms"          },
    ],
  },
];