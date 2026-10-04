import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { getProjectBySlug, getAllProjects } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TypingAnimation } from "@/components/ui/typing-animation";
import LightRays from "@/components/ui/LightRays";
import { cn } from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Custom components to pass to MDXRemote for typography styling
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="mt-8 font-newsreader mb-4 text-4xl tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-8 mb-4 font-newsreader text-2xl font-semibold tracking-tight text-foreground border-b border-border/10 pb-2"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="leading-7 text-muted-foreground not-first:mt-6"
      {...props}
    />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-foreground"
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* 1. LAYER BACKGROUND (Tepat di belakang segalanya) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* 2. LAYER NAVBAR (Melayang transparan di atas halaman) */}
      <Navbar />

      {/* 3. LAYER KONTEN UTAMA */}
      <article className="relative z-10 mb-20 container max-w-3xl mx-auto pt-40 px-4 sm:px-6">
        <div>
          <header className="mb-12">
            {project.frontmatter.logoUrl && (
              <div className="mb-6 relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={project.frontmatter.logoUrl}
                  alt={`${project.frontmatter.title} logo`}
                  height={project.frontmatter.height}
                  width={project.frontmatter.width}
                  className="object-contain"
                />
              </div>
            )}
            <DiaTextReveal
              once
              text={project.frontmatter.title}
              className="text-4xl font-newsreader sm:text-5xl font-semibold tracking-tight text-foreground mb-8"
            />
            <div>
              <TypingAnimation
                typeSpeed={50}
                deleteSpeed={150}
                pauseDelay={2000}
                className="text-lg sm:text-xl text-muted-foreground mb-6 mt-4"
              >
                {project.frontmatter.description}
              </TypingAnimation>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <time
                dateTime={project.frontmatter.date}
                className="text-muted-foreground"
              >
                {new Date(project.frontmatter.date).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </time>
              <div className="flex gap-2 flex-wrap">
                {project.frontmatter.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          <main className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={project.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </main>
        </div>
      </article>

      <MinimalFooter />
    </div>
  );
}
