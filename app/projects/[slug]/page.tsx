import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const iconUrl = project.frontmatter.logoUrl || "/favicon.ico";

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    icons: {
      icon: [{ url: iconUrl }],
      apple: [{ url: iconUrl }],
    },
    openGraph: {
      title: `${project.frontmatter.title} | Zerochirou`,
      description: project.frontmatter.description,
      type: "article",
      images: iconUrl ? [{ url: iconUrl, alt: project.frontmatter.title }] : undefined,
    },
  };
}

export const mdxComponents = {
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "mt-8 mb-4 font-newsreader text-4xl tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-8 mb-4 border-b border-border/10 pb-2 font-newsreader text-2xl tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn(
        "leading-7 text-muted-foreground not-first:mt-6",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }: React.ComponentProps<"a">) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        className={cn(
          "font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80",
          className,
        )}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  },
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc text-muted-foreground [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  ),

  // 1. Komponen PRE untuk membungkus blok kode (Code Block)
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "relative my-6 max-h-[650px] overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground",
        // CSS Reset: hilangkan styling inline code jika berada di dalam tag pre
        "[&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit [&>code]:text-xs md:[&>code]:text-sm",
        className,
      )}
      {...props}
    />
  ),

  // 2. Komponen CODE khusus untuk teks kode sebaris (Inline Code)
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code
      className={cn(
        "relative rounded-md border border-border/50 bg-muted px-[0.35rem] py-[0.15rem] font-mono text-[0.875em] font-normal text-foreground",
        className,
      )}
      {...props}
    />
  ),

  // 3. Perbaikan pembungkus tabel: overflow-x-auto
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr
      className={cn(
        "m-0 border-t border-border/40 p-0 transition-colors even:bg-muted/30 hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "border border-border/40 px-4 py-2 text-left font-semibold text-foreground [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "border border-border/40 px-4 py-2 text-left text-muted-foreground [[align=center]]:text-center [[align=right]]:text-right",
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
      <Navbar
        logoSrc={project.frontmatter.logoUrl || "/favicon.ico"}
        subtitle={project.frontmatter.title}
      />

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
              className="text-4xl font-newsreader sm:text-5xl tracking-tight text-foreground mb-8"
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
                  <Badge key={tech} variant="default" className="font-normal">
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
