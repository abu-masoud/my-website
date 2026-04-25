import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects, getFeaturedPosts, getSiteSettings, urlFor } from "@/lib/sanity";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import AnimatedHero from "@/components/AnimatedHero";

export const revalidate = 60;

export default async function HomePage() {
  const [projects, posts, settings] = await Promise.all([
    getFeaturedProjects().catch(() => []),
    getFeaturedPosts().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const heroLine1 = settings?.heroLine1 ?? "Space.";
  const heroLine2 = settings?.heroLine2 ?? "Form.";
  const heroLine3 = settings?.heroLine3 ?? "Purpose.";
  const heroSubtitle = settings?.heroSubtitle ?? "Architecture that bridges the gap between human experience and structural precision — designed with intention, built to endure.";
  const heroCTALabel = settings?.heroCTALabel ?? "View Work";
  const heroTagline = settings?.heroTagline ?? "Architecture & Engineering";
  const marqueeWords: string[] = settings?.marqueeWords?.length
    ? [...settings.marqueeWords, ...settings.marqueeWords]
    : ["Architecture", "Engineering", "Urban Design", "Spatial Thinking", "Material Study", "Built Environment", "Architecture", "Engineering", "Urban Design", "Spatial Thinking", "Material Study", "Built Environment"];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <AnimatedHero
        heroLine1={heroLine1}
        heroLine2={heroLine2}
        heroLine3={heroLine3}
        heroSubtitle={heroSubtitle}
        heroCTALabel={heroCTALabel}
        heroTagline={heroTagline}
      />

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-2">
                02 / Selected Work
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-700 text-[#f0ede8]">
                Projects
              </h2>
            </div>
            <Link href="/projects" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#c9956a] transition-colors font-[family-name:var(--font-inter)]">
              All Projects <ArrowUpRight size={12} />
            </Link>
          </div>
        </FadeIn>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e1e]">
            {projects.map((p: { _id: string; title: string; slug: { current: string }; coverImage?: unknown; category?: string; year?: string }, i: number) => (
              <FadeIn key={p._id} delay={i * 0.08}>
                <ProjectCard project={p} index={i} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <div className="border-y border-[#1e1e1e] overflow-hidden py-4">
        <div className="flex gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap w-max">
          {marqueeWords.map((word: string, i: number) => (
            <span key={i} className="font-[family-name:var(--font-syne)] text-xs tracking-[0.3em] uppercase text-[#2a2a2a]">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ── Latest Writing ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-2">
                03 / Thoughts
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-700 text-[#f0ede8]">
                Writing
              </h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#c9956a] transition-colors font-[family-name:var(--font-inter)]">
              All Posts <ArrowUpRight size={12} />
            </Link>
          </div>
        </FadeIn>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col divide-y divide-[#1e1e1e]">
            {posts.map((post: { _id: string; title: string; slug: { current: string }; publishedAt?: string; category?: string; readTime?: number }, i: number) => (
              <FadeIn key={post._id} delay={i * 0.06}>
                <PostRow post={post} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProjectCard({ project, index }: { project: { title: string; slug: { current: string }; coverImage?: unknown; category?: string; year?: string }; index: number }) {
  return (
    <Link href={`/projects/${project.slug.current}`} className="group relative bg-[#0c0c0c] overflow-hidden block aspect-[4/3]">
      {project.coverImage ? (
        <Image src={urlFor(project.coverImage).width(800).height(600).url()} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
      ) : (
        <div className="absolute inset-0 bg-[#111111]" />
      )}
      <span className="absolute top-6 left-6 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] text-[#6b6b6b]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {project.category && <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#c9956a] mb-2">{project.category}</p>}
        <h3 className="font-[family-name:var(--font-syne)] text-xl font-700 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors">{project.title}</h3>
        {project.year && <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b] mt-1">{project.year}</p>}
      </div>
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={16} className="text-[#c9956a]" />
      </div>
    </Link>
  );
}

function PostRow({ post }: { post: { title: string; slug: { current: string }; publishedAt?: string; category?: string; readTime?: number } }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null;
  return (
    <Link href={`/blog/${post.slug.current}`} className="group flex items-center justify-between py-6 gap-4">
      <div className="flex items-center gap-6 min-w-0">
        {post.category && <span className="hidden md:block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b] shrink-0 w-28">{post.category}</span>}
        <h3 className="font-[family-name:var(--font-syne)] text-lg font-500 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors truncate">{post.title}</h3>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        {date && <span className="hidden md:block font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b]">{date}</span>}
        {post.readTime && <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">{post.readTime} min</span>}
        <ArrowUpRight size={14} className="text-[#333333] group-hover:text-[#c9956a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#1e1e1e] p-12 text-center">
      <p className="font-[family-name:var(--font-inter)] text-sm text-[#333333]">
        Coming soon
      </p>
    </div>
  );
}
