import Link from "next/link";
import Image from "next/image";
import { getAllPosts, urlFor } from "@/lib/sanity";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Writing" };
export const revalidate = 60;

export default async function BlogPage() {
  const posts: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    coverImage?: unknown;
    publishedAt?: string;
    category?: string;
    excerpt?: string;
    readTime?: number;
    featured?: boolean;
  }> = await getAllPosts().catch(() => []);

  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured || p._id !== featured?._id);

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.3em] uppercase text-[#6b6b6b] mb-3">
          Thoughts & Theory
        </p>
        <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-800 text-[#f0ede8] leading-none">
          Writing
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-[#1e1e1e] p-20 text-center">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b6b6b] mb-4">
            No posts yet. Write your first one in Sanity Studio.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-[#c9956a]"
          >
            Open Studio <ArrowUpRight size={11} />
          </Link>
        </div>
      ) : (
        <>
          {/* Featured post — large card */}
          {featured && (
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group relative flex flex-col md:flex-row gap-0 bg-[#111111] overflow-hidden mb-px"
            >
              <div className="relative md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
                {featured.coverImage ? (
                  <Image
                    src={urlFor(featured.coverImage as Parameters<typeof urlFor>[0])
                      .width(800)
                      .height(500)
                      .url()}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#1a1a1a]" />
                )}
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.25em] uppercase text-[#c9956a] mb-4 block">
                    Featured
                  </span>
                  <h2 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-700 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors leading-tight mb-4">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="font-[family-name:var(--font-inter)] text-sm leading-7 text-[#6b6b6b]">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-8">
                  <div className="flex gap-4">
                    {featured.publishedAt && (
                      <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
                        {new Date(featured.publishedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {featured.readTime && (
                      <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
                        {featured.readTime} min read
                      </span>
                    )}
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-[#333333] group-hover:text-[#c9956a] transition-colors"
                  />
                </div>
              </div>
            </Link>
          )}

          {/* Rest as rows */}
          <div className="flex flex-col divide-y divide-[#1e1e1e] border-y border-[#1e1e1e]">
            {rest.map((post) => {
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : null;
              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group flex items-start md:items-center justify-between py-7 gap-6"
                >
                  <div className="flex gap-4 min-w-0">
                    {!!post.coverImage && (
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden hidden md:block">
                        <Image
                          src={urlFor(post.coverImage)
                            .width(128)
                            .height(128)
                            .url()}
                          alt={post.title}
                          fill
                          sizes="64px"
                          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      {post.category && (
                        <p className="font-[family-name:var(--font-inter)] text-[9px] tracking-[0.25em] uppercase text-[#6b6b6b] mb-1">
                          {post.category}
                        </p>
                      )}
                      <h3 className="font-[family-name:var(--font-syne)] text-lg font-500 text-[#f0ede8] group-hover:text-[#c9956a] transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    {date && (
                      <span className="hidden md:block font-[family-name:var(--font-inter)] text-xs text-[#333333]">
                        {date}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
                        {post.readTime}m
                      </span>
                    )}
                    <ArrowUpRight
                      size={14}
                      className="text-[#333333] group-hover:text-[#c9956a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
