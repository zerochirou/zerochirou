import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
