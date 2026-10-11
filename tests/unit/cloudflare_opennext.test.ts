import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { generateStaticParams, dynamicParams } from "@/app/projects/[slug]/page";
import { getAllProjects } from "@/lib/mdx";

describe("Cloudflare OpenNext Compatibility", () => {
  describe("Wrangler Configuration (wrangler.jsonc)", () => {
    const wranglerPath = path.join(process.cwd(), "wrangler.jsonc");

    it("exists and has valid Cloudflare Workers config", () => {
      expect(fs.existsSync(wranglerPath)).toBe(true);
      const rawContent = fs.readFileSync(wranglerPath, "utf-8");
      // Strip comments for JSON parsing
      const jsonContent = rawContent.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
      const config = JSON.parse(jsonContent);

      expect(config.main).toBe(".open-next/worker.js");
      expect(config.compatibility_flags).toContain("nodejs_compat");
      expect(config.compatibility_date).toBeDefined();
      expect(config.assets).toEqual({
        directory: ".open-next/assets",
        binding: "ASSETS",
      });
    });
  });

  describe("OpenNext Configuration (open-next.config.ts)", () => {
    const openNextConfigPath = path.join(process.cwd(), "open-next.config.ts");

    it("exists and configures staticAssetsIncrementalCache", () => {
      expect(fs.existsSync(openNextConfigPath)).toBe(true);
      const content = fs.readFileSync(openNextConfigPath, "utf-8");

      expect(content).toContain("defineCloudflareConfig");
      expect(content).toContain("staticAssetsIncrementalCache");
      expect(content).toContain("incrementalCache: staticAssetsIncrementalCache");
    });
  });

  describe("MDX Static Route Compatibility", () => {
    it("strictly disables dynamicParams to prevent runtime Worker SSR fs failures", () => {
      expect(dynamicParams).toBe(false);
    });

    it("pre-renders all project slugs via generateStaticParams", async () => {
      const params = await generateStaticParams();
      const allProjects = await getAllProjects();

      expect(params.length).toBeGreaterThan(0);
      expect(params.length).toBe(allProjects.length);

      const paramSlugs = params.map((p) => p.slug).sort();
      const projectSlugs = allProjects.map((p) => p.slug).sort();
      expect(paramSlugs).toEqual(projectSlugs);
    });

    it("ensures each MDX project has required frontmatter fields for edge rendering", async () => {
      const allProjects = await getAllProjects();
      for (const project of allProjects) {
        expect(project.slug).toBeDefined();
        expect(project.frontmatter.title).toBeTruthy();
        expect(project.frontmatter.description).toBeTruthy();
        expect(project.frontmatter.date).toBeTruthy();
        expect(Array.isArray(project.frontmatter.techStack)).toBe(true);
        expect(project.content).toBeTruthy();
      }
    });
  });

  describe("GitHub Actions Deploy Workflow (.github/workflows/deploy.yml)", () => {
    const workflowPath = path.join(process.cwd(), ".github/workflows/deploy.yml");

    it("uses pnpm strictly and avoids npm ci", () => {
      expect(fs.existsSync(workflowPath)).toBe(true);
      const content = fs.readFileSync(workflowPath, "utf-8");

      expect(content).toContain("pnpm");
      expect(content).not.toContain("npm ci");
    });
  });
});
