import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects, urlFor } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import GalleryLightbox from "@/components/GalleryLightbox";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Not Found" };
  return { title: project.title };
}

export async function generateStaticParams() {
  const projects = await getAllProjects().catch(() => []);
  return projects.map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const statusLabel: Record<string, string> = {
    completed: "Completed",
    in_progress: "In Progress",
    concept: "Concept",
  };

  const meta = [
    { label: "Year", value: project.year },
    { label: "Location", value: project.location },
    { label: "Area", value: project.area ? `${project.area} m²` : null },
    { label: "Client", value: project.client },
    { label: "Status", value: project.status ? statusLabel[project.status] : null },
  ].filter((m) => m.value);

  const galleryImages = (project.gallery ?? []).map((img: unknown, i: number) => ({
    url: urlFor(img).width(1400).height(1050).url(),
    alt: `${project.title} — ${i + 1}`,
  }));

  return (
    <article className="pt-28 pb-24">
      {/* Back */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto mb-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors font-[family-name:var(--font-inter)]"
        >
          <ArrowLeft size={12} /> Back to Projects
        </Link>
      </div>

      {/* Cover image — full width */}
      {project.coverImage && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-0">
          <Image
            src={urlFor(project.coverImage).width(1600).height(700).url()}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/10 to-transparent" />
        </div>
      )}

      {/* ── Two-column sticky layout ───────────────────────────────────── */}
      <div className="px-6 md:px-10 max-w-7xl mx-auto mt-0">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 relative">

          {/* ── Sticky sidebar — project info ─────────────────────────── */}
          <aside className="lg:w-72 xl:w-80 shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 pt-12 pb-12 border-b lg:border-b-0 border-[#1e1e1e]">
              {/* Category */}
              {project.category && (
                <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] uppercase text-[#c9956a] mb-4">
                  {project.category}
                </p>
              )}

              {/* Title */}
              <h1 className="font-[family-name:var(--font-syne)] text-3xl xl:text-4xl font-800 text-[#f0ede8] leading-tight mb-5">
                {project.title}
              </h1>

              {/* Excerpt */}
              {project.excerpt && (
                <p className="font-[family-name:var(--font-inter)] font-300 text-sm leading-7 text-[#6b6b6b] mb-8">
                  {project.excerpt}
                </p>
              )}

              {/* Divider */}
              <div className="w-8 h-px bg-[#c9956a] mb-8" />

              {/* Meta */}
              <div className="flex flex-col gap-5">
                {meta.map((m) => (
                  <div key={m.label}>
                    <p className="font-[family-name:var(--font-inter)] text-[9px] tracking-[0.3em] uppercase text-[#333333] mb-1">
                      {m.label}
                    </p>
                    <p className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-inter)] text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1e1e1e] text-[#6b6b6b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ── Scrollable content ────────────────────────────────────── */}
          <div className="flex-1 order-1 lg:order-2 pt-12 border-t border-[#1e1e1e] lg:border-t-0 lg:border-l lg:border-[#1e1e1e] lg:pl-16">
            {/* Description body */}
            {project.body && (
              <div className="mb-16">
                <PortableTextRenderer value={project.body} />
              </div>
            )}

            {/* Gallery with lightbox */}
            {galleryImages.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-6">
                  Gallery — {galleryImages.length} images
                </p>
                <GalleryLightbox images={galleryImages} />
              </div>
            )}

            {/* Empty state if no body and no gallery */}
            {!project.body && galleryImages.length === 0 && (
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#333333] italic">
                No content added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
