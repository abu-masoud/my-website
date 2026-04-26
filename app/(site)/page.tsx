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
  const basedIn: string = settings?.basedIn ?? "Cairo, Egypt";
  const availableFor: string = settings?.availableFor ?? "Freelance & Collaboration";

  const marqueeWords: string[] = settings?.marqueeWords?.length
    ? [...settings.marqueeWords, ...settings.marqueeWords]
    : ["Architecture", "Engineering", "Urban Design", "Spatial Thinking", "Material Study", "Built Environment", "Architecture", "Engineering", "Urban Design", "Spatial Thinking", "Material Study", "Built Environment"];

  const stats = settings?.stats ?? [
    { label: "Years of study", value: "4+" },
    { label: "Projects completed", value: "12+" },
    { label: "Design awards", value: "3" },
    { label: "Countries studied", value: "2" },
  ];

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

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <FadeIn>
        <div className="border-y border-[#1e1e1e] px-6 md:px-10 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s: { label: string; value: string }, i: number) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-800 text-[#f0ede8]">
                  {s.value}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase text-[#333333]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-2">
                02 / Selected Work
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-800 text-[#f0ede8]">
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
          <div className="flex flex-col gap-px bg-[#1e1e1e]">
            {/* Hero project — full-width tall */}
            <FadeIn>
              <ProjectCardHero project={projects[0]} />
            </FadeIn>

            {/* Remaining — 2-col grid */}
            {projects.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1e1e1e]">
                {projects.slice(1).map((p: ProjectType, i: number) => (
                  <FadeIn key={p._id} delay={i * 0.08}>
                    <ProjectCard project={p} index={i + 1} />
                  </FadeIn>
                ))}
                {(projects.length - 1) % 2 !== 0 && (
                  <div className="bg-[#0c0c0c] aspect-[4/3] hidden md:block" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile: all projects link */}
        <div className="mt-10 flex md:hidden">
          <Link href="/projects" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#c9956a] transition-colors font-[family-name:var(--font-inter)]">
            All Projects <ArrowUpRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <div className="border-y border-[#1e1e1e] overflow-hidden py-5">
        <div className="animate-marquee">
          {marqueeWords.map((word: string, i: number) => (
            <span key={i} className="font-[family-name:var(--font-syne)] text-xs tracking-[0.3em] uppercase text-[#2a2a2a] mx-8 shrink-0">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ── About teaser ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <FadeIn>
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-6">
              03 / Studio
            </p>
            <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-800 text-[#f0ede8] leading-[1.05] mb-8">
              Where structure meets intention
            </h2>
            <p className="font-[family-name:var(--font-inter)] font-300 text-base leading-8 text-[#6b6b6b] mb-10 max-w-lg">
              {heroSubtitle}
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] uppercase text-[#f0ede8] border border-[#1e1e1e] px-6 py-3 hover:border-[#c9956a] hover:text-[#c9956a] transition-all"
              >
                About me <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="font-[family-name:var(--font-inter)] text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-5 border-b border-[#1e1e1e]">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase text-[#333333]">Based in</span>
                <span className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">{basedIn}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b border-[#1e1e1e]">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase text-[#333333]">Available for</span>
                <span className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">{availableFor}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b border-[#1e1e1e]">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase text-[#333333]">Speciality</span>
                <span className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">Architecture & Design</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b border-[#1e1e1e]">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase text-[#333333]">Focus</span>
                <span className="font-[family-name:var(--font-syne)] text-sm text-[#f0ede8]">Residential & Urban</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Disciplines ──────────────────────────────────────────────────── */}
      <section className="border-t border-[#1e1e1e] px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-14">
            04 / Disciplines
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e1e]">
          {DISCIPLINES.map((d, i) => (
            <FadeIn key={d.title} delay={i * 0.07}>
              <div className="group bg-[#0c0c0c] px-8 py-10 hover:bg-[#111111] transition-colors cursor-default">
                <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#333333] mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-700 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors mb-3">
                  {d.title}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-xs leading-6 text-[#6b6b6b]">
                  {d.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Latest Writing ────────────────────────────────────────────────── */}
      <section className="border-t border-[#1e1e1e] px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-2">
                05 / Thoughts
              </p>
              <h2 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-800 text-[#f0ede8]">
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
            {posts.map((post: PostType, i: number) => (
              <FadeIn key={post._id} delay={i * 0.06}>
                <PostRow post={post} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <FadeIn>
        <section className="border-t border-[#1e1e1e] px-6 md:px-10 py-32">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#333333]">
              06 / Let&apos;s build together
            </p>
            <h2 className="font-[family-name:var(--font-syne)] font-800 text-[clamp(2.5rem,8vw,7rem)] leading-[0.92] tracking-[-0.02em] text-[#f0ede8]">
              Have a project<br />
              <span className="text-[#c9956a]">in mind?</span>
            </h2>
            <p className="font-[family-name:var(--font-inter)] font-300 text-base text-[#6b6b6b] max-w-md leading-7">
              Open to selected collaborations, freelance work, and design conversations.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 font-[family-name:var(--font-syne)] text-sm tracking-[0.2em] uppercase text-[#0c0c0c] bg-[#f0ede8] px-8 py-4 hover:bg-[#c9956a] transition-colors"
            >
              Start a conversation
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </section>
      </FadeIn>
    </>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ProjectType {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: unknown;
  category?: string;
  year?: string;
}

interface PostType {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  category?: string;
  readTime?: number;
}

// ── Static data ──────────────────────────────────────────────────────────────

const DISCIPLINES = [
  {
    title: "Architectural Design",
    desc: "From concept to construction documentation — spatial solutions grounded in human experience and site context.",
  },
  {
    title: "Urban Design",
    desc: "Large-scale interventions that weave public space, mobility, and density into livable environments.",
  },
  {
    title: "Interior & Space",
    desc: "Material narratives and programmatic flow that define atmosphere and purpose within built form.",
  },
  {
    title: "Structural Thinking",
    desc: "Engineering principles applied early in design to achieve forms that are both daring and buildable.",
  },
  {
    title: "Landscape Integration",
    desc: "Site strategy that dissolves boundaries between building footprint and surrounding terrain.",
  },
  {
    title: "Research & Theory",
    desc: "Critical writing and academic inquiry into contemporary practice, history, and architectural discourse.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ProjectCardHero({ project }: { project: ProjectType }) {
  return (
    <Link href={`/projects/${project.slug.current}`} className="group relative bg-[#0c0c0c] overflow-hidden block aspect-[16/7]">
      {project.coverImage ? (
        <Image
          src={urlFor(project.coverImage).width(1600).height(700).url()}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-[1.03] transition-all duration-700"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[#111111]" />
      )}
      <span className="absolute top-6 left-6 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] text-[#6b6b6b]">01</span>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {project.category && (
            <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#c9956a] mb-3">
              {project.category}
            </p>
          )}
          <h3 className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-800 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors">
            {project.title}
          </h3>
          {project.year && (
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b] mt-2">{project.year}</p>
          )}
        </div>
        <div className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs tracking-[0.15em] uppercase text-[#6b6b6b] group-hover:text-[#c9956a] transition-colors shrink-0">
          View project <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function ProjectCard({ project, index }: { project: ProjectType; index: number }) {
  return (
    <Link href={`/projects/${project.slug.current}`} className="group relative bg-[#0c0c0c] overflow-hidden block aspect-[4/3]">
      {project.coverImage ? (
        <Image
          src={urlFor(project.coverImage).width(800).height(600).url()}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-[#111111]" />
      )}
      <span className="absolute top-6 left-6 font-[family-name:var(--font-syne)] text-xs tracking-[0.2em] text-[#6b6b6b]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {project.category && (
          <p className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#c9956a] mb-2">
            {project.category}
          </p>
        )}
        <h3 className="font-[family-name:var(--font-syne)] text-xl font-700 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors">
          {project.title}
        </h3>
        {project.year && (
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b] mt-1">{project.year}</p>
        )}
      </div>
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={16} className="text-[#c9956a]" />
      </div>
    </Link>
  );
}

function PostRow({ post }: { post: PostType }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;
  return (
    <Link href={`/blog/${post.slug.current}`} className="group flex items-center justify-between py-6 gap-4">
      <div className="flex items-center gap-6 min-w-0">
        {post.category && (
          <span className="hidden md:block font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b] shrink-0 w-28">
            {post.category}
          </span>
        )}
        <h3 className="font-[family-name:var(--font-syne)] text-lg font-500 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors truncate">
          {post.title}
        </h3>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        {date && (
          <span className="hidden md:block font-[family-name:var(--font-inter)] text-xs text-[#6b6b6b]">{date}</span>
        )}
        {post.readTime && (
          <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">{post.readTime} min</span>
        )}
        <ArrowUpRight size={14} className="text-[#333333] group-hover:text-[#c9956a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-[#1e1e1e] p-12 text-center">
      <p className="font-[family-name:var(--font-inter)] text-sm text-[#333333]">Coming soon</p>
    </div>
  );
}
