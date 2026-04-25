import { defineType, defineField } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General" },
    { name: "hero", title: "Hero Section" },
    { name: "about", title: "About Page" },
    { name: "footer", title: "Footer & Marquee" },
  ],
  fields: [
    // ── General ────────────────────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site Name (shown in navbar & footer)",
      type: "string",
      group: "general",
      initialValue: "Studio",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      group: "general",
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "basedIn",
      title: "Based In (city, country)",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
      group: "general",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
      group: "general",
    }),
    defineField({
      name: "availableFor",
      title: "Available For (list)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "general",
      initialValue: ["New projects", "Consultations", "Collaborations"],
    }),

    // ── Hero ───────────────────────────────────────────────────────────────
    defineField({
      name: "heroLine1",
      title: "Hero — Line 1",
      type: "string",
      group: "hero",
      initialValue: "Space.",
    }),
    defineField({
      name: "heroLine2",
      title: "Hero — Line 2 (shown in copper color)",
      type: "string",
      group: "hero",
      initialValue: "Form.",
    }),
    defineField({
      name: "heroLine3",
      title: "Hero — Line 3",
      type: "string",
      group: "hero",
      initialValue: "Purpose.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero — Subtitle paragraph",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue:
        "Architecture that bridges the gap between human experience and structural precision — designed with intention, built to endure.",
    }),
    defineField({
      name: "heroCTALabel",
      title: "Hero — Button label",
      type: "string",
      group: "hero",
      initialValue: "View Work",
    }),
    defineField({
      name: "heroTagline",
      title: "Hero — Small label above headline",
      type: "string",
      group: "hero",
      initialValue: "Architecture & Engineering",
    }),

    // ── About ──────────────────────────────────────────────────────────────
    defineField({
      name: "aboutPhoto",
      title: "About — Profile Photo",
      type: "image",
      options: { hotspot: true },
      group: "about",
    }),
    defineField({
      name: "aboutHeadline",
      title: "About — Large opening paragraph",
      type: "text",
      rows: 4,
      group: "about",
      initialValue:
        "I am an architecture engineer working at the intersection of spatial design, structural thinking, and human experience. My practice is built around the belief that great architecture solves real problems without sacrificing beauty.",
    }),
    defineField({
      name: "aboutBody",
      title: "About — Additional paragraphs",
      type: "array",
      of: [{ type: "block" }],
      group: "about",
    }),
    defineField({
      name: "skills",
      title: "Skills & Tools",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "about",
      initialValue: [
        "Architectural Design",
        "Structural Engineering",
        "Urban Planning",
        "BIM / Revit",
        "AutoCAD",
        "Rhino 3D",
        "SketchUp",
        "Sustainability",
        "Construction Management",
        "Interior Design",
        "Site Analysis",
        "3D Visualization",
      ],
    }),
    defineField({
      name: "timeline",
      title: "Experience & Education",
      type: "array",
      group: "about",
      of: [
        {
          type: "object",
          fields: [
            { name: "year", title: "Year / Period", type: "string" },
            { name: "role", title: "Role / Degree", type: "string" },
            { name: "place", title: "Company / Institution", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "role", subtitle: "place" },
          },
        },
      ],
    }),

    // ── Footer & Marquee ───────────────────────────────────────────────────
    defineField({
      name: "footerTagline",
      title: "Footer — Tagline (shown next to copyright)",
      type: "string",
      group: "footer",
      initialValue: "Architecture & Design",
    }),
    defineField({
      name: "marqueeWords",
      title: "Marquee — Scrolling words strip",
      description: "Words that scroll across the homepage banner",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "footer",
      initialValue: [
        "Architecture",
        "Engineering",
        "Urban Design",
        "Spatial Thinking",
        "Material Study",
        "Built Environment",
      ],
    }),
  ],
  preview: {
    select: { title: "siteName" },
  },
});
