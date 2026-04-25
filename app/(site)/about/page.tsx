import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
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

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="mb-20">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
          The Person Behind the Work
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-800 text-[#f0ede8] leading-none">
          About
        </h1>
      </div>

      {/* Bio block */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 mb-24 pb-24 border-b border-[#1e1e1e]">
        <div className="space-y-6">
          <p className="font-[family-name:var(--font-inter)] font-300 text-xl leading-9 text-[#c0bdb8]">
            {headline}
          </p>

          {s?.aboutBody && (
            <div className="text-base leading-8 text-[#6b6b6b]">
              <PortableTextRenderer value={s.aboutBody} />
            </div>
          )}

          <div className="flex gap-6 pt-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-sm tracking-[0.15em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all duration-300"
            >
              View Projects
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-3">Based In</p>
            <p className="font-[family-name:var(--font-syne)] text-[#f0ede8]">{basedIn}</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-3">Available For</p>
            <ul className="space-y-1">
              {availableFor.map((item: string) => (
                <li key={item} className="font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b]">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#333333] mb-3">Contact</p>
            <a href={`mailto:${email}`} className="font-[family-name:var(--font-syne)] text-sm text-[#c9956a] hover:text-[#e0b48a] transition-colors">
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-24 pb-24 border-b border-[#1e1e1e]">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-10">
          Skills & Tools
        </p>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill: string) => (
            <span key={skill} className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] px-4 py-2 border border-[#1e1e1e] text-[#6b6b6b] hover:border-[#c9956a] hover:text-[#c9956a] transition-all cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-10">
          Experience & Education
        </p>
        <div className="flex flex-col divide-y divide-[#1e1e1e]">
          {timeline.map((item: { year: string; role: string; place: string; description: string }) => (
            <div key={item.year + item.role} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-8">
              <p className="font-[family-name:var(--font-inter)] text-xs text-[#333333] pt-1">{item.year}</p>
              <div>
                <p className="font-[family-name:var(--font-syne)] text-base font-600 text-[#f0ede8] mb-1">{item.role}</p>
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.1em] uppercase text-[#c9956a] mb-2">{item.place}</p>
                <p className="font-[family-name:var(--font-inter)] text-sm leading-6 text-[#6b6b6b]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
