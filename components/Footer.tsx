import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { safeExternalUrl, safeMailto } from "@/lib/security";

interface Props {
  tagline?: string;
  subtitle?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
}

export default function Footer({
  tagline = "Architecture & Design",
  subtitle = "Designing spaces that endure.",
  email,
  instagram,
  linkedin,
}: Props) {
  const year = new Date().getFullYear();
  const mailto = safeMailto(email);
  const instagramHref = safeExternalUrl(instagram);
  const linkedinHref = safeExternalUrl(linkedin);

  return (
    <footer className="border-t border-[#1e1e1e] mt-0">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-[#1e1e1e]">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="font-[family-name:var(--font-syne)] text-sm font-700 tracking-[0.25em] uppercase text-[#f0ede8] hover:text-[#c9956a] transition-colors block mb-4"
            >
              {tagline}
            </Link>
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b] leading-6 max-w-xs mb-8">
              {subtitle}
            </p>
            {email && mailto && (
              <a
                href={mailto}
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] text-[#6b6b6b] hover:text-[#c9956a] transition-colors"
              >
                {email}
                <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#6b6b6b] mb-6">
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/about", label: "About" },
                { href: "/blog", label: "Writing" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-[family-name:var(--font-syne)] text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines */}
          <div className="md:col-span-2">
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#6b6b6b] mb-6">
              Disciplines
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Architectural Design",
                "Urban Design",
                "Interior & Space",
                "Structural Thinking",
                "Landscape Integration",
                "Research & Theory",
              ].map((d) => (
                <li key={d}>
                  <span className="font-[family-name:var(--font-syne)] text-sm text-[#6b6b6b]">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + availability */}
          <div className="md:col-span-2">
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#6b6b6b] mb-6">
              Connect
            </p>
            <ul className="flex flex-col gap-3">
              {instagramHref && (
                <li>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-[family-name:var(--font-syne)] text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
                  >
                    Instagram
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              )}
              {linkedinHref && (
                <li>
                  <a
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-[family-name:var(--font-syne)] text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
                  >
                    LinkedIn
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              )}
              {email && mailto && (
                <li>
                  <a
                    href={mailto}
                    className="group inline-flex items-center gap-1 font-[family-name:var(--font-syne)] text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
                  >
                    Email
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-8 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.15em] uppercase text-[#6b6b6b]">
                Available for work
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8">
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] text-[#6b6b6b]">
            © {year} {tagline}. All rights reserved.
          </p>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] text-[#6b6b6b]">
            Designed & built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
