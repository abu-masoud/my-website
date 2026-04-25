import Link from "next/link";

export default function Footer({ tagline = "Architecture & Design" }: { tagline?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#1e1e1e] mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase text-[#6b6b6b]">
            © {year} — {tagline}
          </p>
        </div>

        <nav className="flex gap-8">
          {[
            { href: "/projects", label: "Projects" },
            { href: "/blog", label: "Writing" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.12em] uppercase text-[#6b6b6b] hover:text-[#c9956a] transition-colors font-[family-name:var(--font-inter)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
