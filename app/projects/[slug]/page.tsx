import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getAllProjects } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

import React from "react";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";

// Custom components to pass to MDXRemote for typography styling
const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="mt-8 mb-4 text-4xl tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground border-b border-border/10 pb-2"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6"
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
    <>
      <Navbar />
      <article className="container max-w-3xl mx-auto pt-40 px-4 sm:px-6">
        <header className="mb-12">
          <DiaTextReveal
            once
            text={project.frontmatter.title}
            className="text-4xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4"
          />
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            {project.frontmatter.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <time
              dateTime={project.frontmatter.date}
              className="text-muted-foreground"
            >
              {new Date(project.frontmatter.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
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
          <MDXRemote source={project.content} components={mdxComponents} />
        </main>
      </article>
      <MinimalFooter />
    </>
  );
}
