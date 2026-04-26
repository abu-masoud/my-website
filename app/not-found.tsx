import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.4em] uppercase text-[#6b6b6b] mb-6">
        404
      </p>
      <h1 className="font-[family-name:var(--font-syne)] text-7xl md:text-[10rem] font-800 text-[#f0ede8] leading-none mb-4">
        Lost.
      </h1>
      <div className="w-12 h-px bg-[#c9956a] mb-8" />
      <p className="font-[family-name:var(--font-inter)] font-300 text-sm leading-7 text-[#6b6b6b] max-w-xs mb-12">
        This page no longer exists — or was never here. Let&apos;s get you back.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-7 py-3.5 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300"
      >
        Return Home
        <ArrowUpRight
          size={13}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      </Link>
    </div>
  );
}
