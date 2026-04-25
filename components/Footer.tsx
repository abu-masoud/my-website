import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

  return (
    <footer className="border-t border-[#1e1e1e] mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-12 pb-12 border-b border-[#1e1e1e]">
          {/* Wordmark + tagline */}
          <div>
            <Link
              href="/"
              className="font-[family-name:var(--font-syne)] text-sm font-700 tracking-[0.2em] uppercase text-[#f0ede8] hover:text-[#c9956a] transition-colors block mb-2"
            >
              {tagline}
            </Link>
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
              {subtitle}
            </p>
          </div>

          {/* CTA */}
          {email && (
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all"
            >
              Start a project
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] text-[#333333]">
            © {year} — All rights reserved
          </p>

          <div className="flex items-center gap-8">
            {/* Nav links */}
            {[
              { href: "/projects", label: "Projects" },
              { href: "/blog", label: "Writing" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-[family-name:var(--font-inter)] text-xs tracking-[0.12em] uppercase text-[#333333] hover:text-[#c9956a] transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Social links */}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-xs tracking-[0.12em] uppercase text-[#333333] hover:text-[#c9956a] transition-colors"
              >
                IG
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-xs tracking-[0.12em] uppercase text-[#333333] hover:text-[#c9956a] transition-colors"
              >
                LI
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
