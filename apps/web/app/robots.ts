import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Bingbot",
          "Applebot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://zerochirou.com/sitemap.xml",
    host: "https://zerochirou.com",
  };
}
