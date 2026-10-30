import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();

  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `https://zerochirou.com/projects/${project.slug}`,
    lastModified: new Date(project.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://zerochirou.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          id: "https://zerochirou.com",
          en: "https://zerochirou.com",
        },
      },
    },
    {
      url: "https://zerochirou.com/human",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          id: "https://zerochirou.com/human",
          en: "https://zerochirou.com/human",
        },
      },
    },
    ...projectUrls,
  ];
}
