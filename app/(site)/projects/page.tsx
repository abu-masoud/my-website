import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };
export const revalidate = 60;

const CATEGORIES = [
  "All",
  "Residential",
  "Commercial",
  "Urban",
  "Interior",
  "Concept",
  "Renovation",
];

export default async function ProjectsPage() {
  const projects: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    coverImage?: unknown;
    category?: string;
    year?: string;
    location?: string;
    excerpt?: string;
    tags?: string[];
  }> = await getAllProjects().catch(() => []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <FadeIn className="mb-16">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
          Selected Work
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-800 text-[#f0ede8] leading-none">
          Projects
        </h1>
      </FadeIn>

      {/* Category pills — client-side filtering would need "use client";
          keeping it static here with all projects shown */}
      <div className="flex gap-3 flex-wrap mb-14 border-b border-[#1e1e1e] pb-8">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-[#1e1e1e] text-[#6b6b6b] first:border-[#c9956a] first:text-[#c9956a] cursor-default"
          >
            {cat}
          </span>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-[#1e1e1e] p-20 text-center">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b]">
            Coming soon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e1e]">
          {projects.map((p, i) => (

            <FadeIn key={p._id} delay={i * 0.06}>
            <Link
              href={`/projects/${p.slug.current}`}
              className="group relative bg-[#0c0c0c] overflow-hidden block aspect-[3/4] h-full"
            >
              {p.coverImage ? (
                <Image
                  src={urlFor(p.coverImage as Parameters<typeof urlFor>[0])
                    .width(600)
                    .height(800)
                    .url()}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-[#111111]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />

              <span className="absolute top-5 left-5 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] text-[#6b6b6b]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                {p.category && (
                  <p className="font-[family-name:var(--font-inter)] text-[9px] tracking-[0.25em] uppercase text-[#c9956a] mb-1">
                    {p.category}
                  </p>
                )}
                <h2 className="font-[family-name:var(--font-syne)] text-lg font-700 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors leading-tight">
                  {p.title}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {p.year && (
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6b6b]">
                      {p.year}
                    </span>
                  )}
                  {p.location && (
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6b6b]">
                      — {p.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={14} className="text-[#c9956a]" />
              </div>
            </Link>
            </FadeIn>
          ))}
          {/* Fill trailing empty grid cells so bg-[#1e1e1e] doesn't show */}
          {Array.from({ length: (3 - (projects.length % 3)) % 3 }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#0c0c0c] aspect-[3/4] hidden lg:block" />
          ))}
          {projects.length % 2 !== 0 && (
            <div className="bg-[#0c0c0c] aspect-[3/4] hidden md:block lg:hidden" />
          )}
        </div>
      )}
    </div>
  );
}
