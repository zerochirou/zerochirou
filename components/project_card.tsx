import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectFrontmatter } from "@/lib/mdx";

interface ProjectCardProps {
  slug: string;
  project: ProjectFrontmatter;
  className?: string;
}

export function ProjectCard({ slug, project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className={cn("block group", className)}>
      <Card className="h-full rounded-xl bg-background border border-border/40 hover:border-border transition-colors duration-300 ease-in-out shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="p-6 pb-4 shrink-0">
          <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs px-2 py-0.5 font-normal"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
