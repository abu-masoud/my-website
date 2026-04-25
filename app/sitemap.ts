import { MetadataRoute } from "next";
import { getAllProjects, getAllPosts } from "@/lib/sanity";

const BASE_URL = "https://ramadan-arch.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getAllProjects().catch(() => []),
    getAllPosts().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/blog`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map(
    (p: { slug: { current: string } }) => ({
      url: `${BASE_URL}/projects/${p.slug.current}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map(
    (p: { slug: { current: string }; publishedAt?: string }) => ({
      url: `${BASE_URL}/blog/${p.slug.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
