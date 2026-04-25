import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, urlFor } from "@/lib/sanity";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Not Found" };
  return { title: post.title };
}

export async function generateStaticParams() {
  const posts = await getAllPosts().catch(() => []);
  return posts.map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="pt-28 pb-24">
      {/* Back */}
      <div className="px-6 md:px-10 max-w-4xl mx-auto mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#f0ede8] transition-colors font-[family-name:var(--font-inter)]"
        >
          <ArrowLeft size={12} /> Writing
        </Link>
      </div>

      {/* Header */}
      <div className="px-6 md:px-10 max-w-4xl mx-auto mb-12">
        {post.category && (
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-[0.25em] uppercase text-[#c9956a] mb-4">
            {post.category}
          </p>
        )}
        <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-800 text-[#f0ede8] leading-tight mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-[family-name:var(--font-inter)] font-300 text-lg leading-8 text-[#6b6b6b]">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-6 mt-6 border-t border-[#1e1e1e] pt-6">
          {date && (
            <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
              {date}
            </span>
          )}
          {post.readTime && (
            <span className="font-[family-name:var(--font-inter)] text-xs text-[#333333]">
              {post.readTime} min read
            </span>
          )}
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image
            src={urlFor(post.coverImage).width(1600).height(700).url()}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/60 to-transparent" />
        </div>
      )}

      {/* Body */}
      {post.body && (
        <div className="px-6 md:px-10 max-w-4xl mx-auto">
          <PortableTextRenderer value={post.body} />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-6 md:px-10 max-w-4xl mx-auto mt-16 pt-8 border-t border-[#1e1e1e] flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1e1e1e] text-[#6b6b6b]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
