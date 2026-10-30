"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TextAnimate } from "@/components/ui/text_animate";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { MagicCard } from "@/components/ui/magic_card";
import { FEATURED_PROJECTS } from "../constants";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-label="Projects and Software"
      className="bg-background min-h-screen h-auto py-20 sm:py-28 md:py-40"
    >
      <div className="flex items-center justify-center flex-col px-4 text-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2 tracking-tight font-normal">
          <div className="flex items-center gap-2 sm:gap-3">
            <span>Open</span>
            <span>Source</span>
          </div>
          <DiaTextReveal
            repeat
            repeatDelay={2}
            text={["Projects", "Software"]}
            colors={["#FFED29", "#0095fe"]}
          />
        </h2>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="w-full max-w-xl text-sm sm:text-base md:text-lg mt-4 text-primary/50 text-center px-4"
        >
          Advanced projects and software to which I am currently dedicating
          myself
        </TextAnimate>
      </div>
      <div className="mx-auto max-w-7xl w-full mt-10 sm:mt-16 md:mt-20 px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: ((index * 3) % 5) * 0.15,
                ease: "easeOut",
              }}
            >
              <Card className="relative border-none p-0 group rounded-none bg-background h-full flex flex-col border border-border/40 hover:border-border transition-colors shadow-sm overflow-hidden">
                <MagicCard
                  className="p-0 h-full"
                  gradientFrom="#FFED29"
                  gradientTo="#0095fe"
                  mode="orb"
                >
                  <Link
                    href={`/projects/${project.id}`}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">
                      View {project.title} details
                    </span>
                  </Link>

                  <CardHeader className="flex mt-6 justify-center h-40 sm:h-40 md:h-48 items-center shrink-0 p-4 sm:p-6">
                    <div className="relative flex items-center justify-center">
                      <Image
                        src={project.logoUrl}
                        alt={`${project.title} - ${project.description}`}
                        width={project.width}
                        height={project.height}
                        className="max-h-full group-hover:rotate-3 group-hover:opacity-100 max-w-full object-contain opacity-20 hover:opacity-100 transition-all grayscale-100 hover:grayscale-0 ease-in-out duration-300"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 p-4 sm:p-6 pt-0">
                    <div className="flex flex-col gap-2">
                      <span className="flex gap-2 items-center flex-wrap">
                        <h3 className="text-lg sm:text-xl font-normal inline-flex items-center">
                          <DiaTextReveal
                            once
                            colors={["#FFED29", "#0095fe"]}
                            className="text-lg  sm:text-xl"
                            text={project.title}
                          />
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {project.badge && (
                            <motion.span
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 2 }}
                            >
                              <Badge
                                variant="default"
                                className="text-xs px-2 py-0.5"
                              >
                                {project.badge}
                              </Badge>
                            </motion.span>
                          )}

                          {project.isOngoing && (
                            <motion.span
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 2.5 }}
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5"
                              >
                                Ongoing
                              </Badge>
                            </motion.span>
                          )}
                        </div>
                      </span>
                      <p className="opacity-70 text-xs sm:text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex mt-auto pt-4 sm:pt-6 items-center text-xs sm:text-sm">
                      <Image
                        src="/assets/icons/github.svg"
                        alt={"GitHub"}
                        width={18}
                        height={18}
                        className="opacity-50 shrink-0"
                      />
                      {project.githubRepo ? (
                        <span className="ml-2 font-normal truncate">
                          <Link
                            href={`https://github.com/${project.githubRepo}`}
                            target="_blank"
                            className="hover:underline hover:text-foreground transition-colors truncate block"
                          >
                            {project.githubRepo}
                          </Link>
                        </span>
                      ) : (
                        <span className="ml-2 font-normal opacity-50">
                          Currently private
                        </span>
                      )}
                    </div>
                  </CardContent>
                </MagicCard>
              </Card>
            </motion.div>
          ))}
        </ul>
      </div>
    </section>
  );
}
