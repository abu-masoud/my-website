import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings, urlFor } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };
export const revalidate = 60;

export default async function AboutPage() {
  const s = await getSiteSettings().catch(() => null);

  const headline = s?.aboutHeadline ?? "I am an architecture engineer working at the intersection of spatial design, structural thinking, and human experience.";
  const skills: string[] = s?.skills ?? ["Architectural Design", "Structural Engineering", "Urban Planning", "BIM / Revit", "AutoCAD", "Rhino 3D", "SketchUp", "Sustainability", "Construction Management", "Interior Design", "Site Analysis", "3D Visualization"];
  const timeline = s?.timeline ?? [
    { year: "2020 — Present", role: "Senior Architect", place: "Independent Practice", description: "Leading residential and commercial projects across the region, with a focus on sustainable design." },
    { year: "2016 — 2020", role: "Project Architect", place: "Architecture Firm", description: "Overseeing design development and construction documentation for mixed-use developments." },
    { year: "2010 — 2014", role: "B.Arch — Architecture", place: "University of Architecture", description: "Bachelor of Architecture with honors." },
  ];
  const availableFor: string[] = s?.availableFor ?? ["New projects", "Consultations", "Collaborations"];
  const basedIn: string = s?.basedIn ?? "Your City, Country";
  const email: string = s?.email ?? "hello@yourdomain.com";
  const photo = s?.aboutPhoto ?? null;
  const stats: { number: string; label: string }[] = s?.stats ?? [
    { number: "10+", label: "Years of practice" },
    { number: "40+", label: "Projects delivered" },
    { number: "3",   label: "Countries worked" },
  ];
  const aboutCTAHeadline: string = s?.aboutCTAHeadline ?? "Let's build something worth keeping.";

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <FadeIn className="mb-20">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
          The Person Behind the Work
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-800 text-[#f0ede8] leading-none">
          About
        </h1>
      </FadeIn>

      {/* ── Hero block: photo + intro ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 mb-24 pb-24 border-b border-[#1e1e1e]">
        <FadeIn delay={0.1}>
          <div className="space-y-8">
            <p className="font-[family-name:var(--font-inter)] font-300 text-xl md:text-2xl leading-10 text-[#c0bdb8]">
              {headline}
            </p>

            {s?.aboutBody && (
              <div className="text-base leading-8 text-[#6b6b6b]">
                <PortableTextRenderer value={s.aboutBody} />
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1e1e1e]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-700 text-[#c9956a]">
                    {stat.number}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] uppercase text-[#333333] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2 flex-wrap">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.15em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300"
              >
                View Projects
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.15em] uppercase text-[#6b6b6b] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300"
              >
                Get in Touch
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col gap-8">
            {/* Profile photo */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
              {photo ? (
                <Image
                  src={urlFor(photo).width(760).height(1013).url()}
                  alt="Profile"
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#1e1e1e] flex items-center justify-center">
                    <span className="font-[family-name:var(--font-syne)] text-xl text-[#333333]">R</span>
                  </div>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase text-[#2a2a2a]">
                    Add photo in Studio
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/40 to-transparent pointer-events-none" />
            </div>

            {/* Contact info card */}
            <div className="border border-[#1e1e1e] p-6 space-y-5">
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-1.5">Based In</p>
                <p className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">{basedIn}</p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-1.5">Available For</p>
                <ul className="space-y-1">
                  {availableFor.map((item: string) => (
                    <li key={item} className="font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b] flex items-center gap-2 before:content-['—'] before:text-[#c9956a] before:text-xs">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-1.5">Email</p>
                <a href={`mailto:${email}`} className="font-[family-name:var(--font-syne)] text-sm text-[#c9956a] hover:text-[#e0b48a] transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      <FadeIn className="mb-24 pb-24 border-b border-[#1e1e1e]">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-10">
          Skills & Tools
        </p>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill: string, i: number) => (
            <span
              key={skill}
              style={{ animationDelay: `${i * 30}ms` }}
              className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] px-4 py-2 border border-[#1e1e1e] text-[#6b6b6b] hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </FadeIn>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <div className="mb-24 pb-24 border-b border-[#1e1e1e]">
        <FadeIn>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-10">
            Experience & Education
          </p>
        </FadeIn>
        <div className="flex flex-col divide-y divide-[#1e1e1e]">
          {timeline.map((item: { year: string; role: string; place: string; description: string }, i: number) => (
            <FadeIn key={item.year + item.role} delay={i * 0.1}>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-10">
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#333333] pt-1">{item.year}</p>
                <div>
                  <p className="font-[family-name:var(--font-syne)] text-lg font-600 text-[#f0ede8] mb-1">{item.role}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.15em] uppercase text-[#c9956a] mb-3">{item.place}</p>
                  <p className="font-[family-name:var(--font-inter)] text-sm leading-7 text-[#6b6b6b]">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
              Start a conversation
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-700 text-[#f0ede8] leading-tight">
              {aboutCTAHeadline}
            </h2>
          </div>
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-3 font-[family-name:var(--font-syne)] text-sm tracking-[0.15em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-8 py-4 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300 shrink-0"
          >
            Write to me
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </FadeIn>

    </div>
  );
}
