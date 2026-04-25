import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// ── Validate required env vars at startup ─────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID — copy .env.local.example to .env.local and fill it in."
  );
}

const isDev = process.env.NODE_ENV === "development";

// ── Client ───────────────────────────────────────────────────────────────────
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ── Image builder ─────────────────────────────────────────────────────────────
const builder = createImageUrlBuilder({ projectId, dataset });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// ── Typed fetch helper ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sanityFetch<T = any>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T> {
  // In dev: always fresh. In prod: ISR with 60s revalidation + cache tags.
  const fetchOptions = isDev
    ? { cache: "no-store" as const }
    : { next: { revalidate: 60, tags } };

  return client.fetch<T>(query, params, fetchOptions);
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function getFeaturedProjects() {
  return sanityFetch(
    `*[_type == "project" && featured == true] | order(order asc) [0...6] {
      _id, title, slug, coverImage, category, year, location, excerpt, tags
    }`,
    {}, ["projects"]
  );
}

export function getAllProjects() {
  return sanityFetch(
    `*[_type == "project"] | order(order asc, year desc) {
      _id, title, slug, coverImage, category, year, location, excerpt, tags, featured
    }`,
    {}, ["projects"]
  );
}

export function getProjectBySlug(slug: string) {
  return sanityFetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id, title, slug, coverImage, gallery, category, year, location,
      area, client, status, excerpt, body, tags
    }`,
    { slug }, ["projects", `project:${slug}`]
  );
}

export function getAllPosts() {
  return sanityFetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, coverImage, publishedAt, category, excerpt, tags, readTime, featured
    }`,
    {}, ["posts"]
  );
}

export function getPostBySlug(slug: string) {
  return sanityFetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, coverImage, publishedAt, category, excerpt, body, tags, readTime
    }`,
    { slug }, ["posts", `post:${slug}`]
  );
}

export function getFeaturedPosts() {
  return sanityFetch(
    `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      _id, title, slug, coverImage, publishedAt, category, excerpt, readTime
    }`,
    {}, ["posts"]
  );
}

export function getSiteSettings() {
  return sanityFetch(
    `*[_type == "siteSettings"][0] {
      siteName, seoDescription, email, basedIn, availableFor,
      heroLine1, heroLine2, heroLine3, heroSubtitle, heroCTALabel, heroTagline,
      aboutPhoto, aboutHeadline, aboutBody, skills, timeline,
      footerTagline, marqueeWords
    }`,
    {}, ["siteSettings"]
  );
}
