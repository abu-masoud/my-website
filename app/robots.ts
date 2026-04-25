import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio-login", "/api/"],
      },
    ],
    sitemap: "https://ramadan-arch.netlify.app/sitemap.xml",
  };
}
