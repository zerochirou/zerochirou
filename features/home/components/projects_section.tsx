"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TextAnimate } from "@/components/ui/text_animate";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

const data = [
  {
    id: "clickfor",
    title: "Clickfor",
    description: "Changing the way food is ordered.",
    githubRepo: "zerochirou/clickfor",
    stars: 142648,
    logoUrl: "/assets/icons/clickfor.png",
    badge: "Startup",
    isOngoing: true,
    height: 120,
    width: 120,
  },
  {
    id: "hypergrid",
    title: "Hypergrid",
    description:
      "An instrument for analyzing road infrastructure capabilities using big data and deep learning.",
    stars: 142648,
    logoUrl: "/assets/icons/hyperg.png",
    isOngoing: true,
    height: 120,
    width: 120,
  },
  {
    id: "devinion",
    title: "Devinion",
    description:
      "Devinion provides a comprehensive software platform for developing, deploying, and controlling hardware systems.",
    stars: 142648,
    logoUrl: "/assets/icons/zerochirou.png",
    isOngoing: true,
    height: 80,
    width: 80,
  },
  {
    id: "zensekit",
    title: "Zensekit",
    description:
      "A SaaS development kit optimized for rapid and scalable development. Using a monorepo architecture.",
    githubRepo: "zerochirou/zensekit",
    stars: 142648,
    logoUrl: "/assets/icons/zerochirou.png",
    isOngoing: false,
    height: 80,
    width: 80,
    badge: "Framework"
  },
  {
    id: "rhea",
    title: "Rhea",
    description: "Voice-based Mac assistant running locally on the machine.",
    stars: 142648,
    logoUrl: "/assets/icons/zerochirou.png",
    isOngoing: true,
    height: 80,
    width: 80,
  },
];

export function ProjectsSection() {
  return (
    <div id="projects" className="bg-background h-screen py-40">
      <div className="flex items-center justify-center flex-col">
        <div className="text-7xl flex flex-row items-center gap-3">
          <span>Open</span>
          <span>Source</span>
          <DiaTextReveal
            repeat
            repeatDelay={2}
            text={["Projects", "Software"]}
          />
        </div>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="w-1/2 text-lg mt-4 text-primary/50 text-center"
        >
          Advanced projects and software to which I am currently dedicating myself
        </TextAnimate>
      </div>
      <div className="mx-auto max-w-7xl w-full mt-20">
        <ul className="grid grid-cols-3 gap-0">
          {data.map((project) => (
            <Card
              key={project.id}
              className="rounded-none bg-background h-full flex flex-col"
            >
              {/* Tambahkan shrink-0 agar header tidak ikut tergencet jika teks sangat panjang */}
              <CardHeader className="flex justify-center h-50 items-center shrink-0">
                <Image
                  src={project.logoUrl}
                  alt={project.title}
                  width={project.width} // PERBAIKAN: Sebelumnya tertulis 'width' (typo)
                  height={project.height}
                  className="grayscale-100 opacity-50 hover:opacity-100 hover:grayscale-0 transition-all ease-in-out duration-300"
                />
              </CardHeader>

              {/* Tambahkan flex-1 agar CardContent memanjang ke bawah menutupi ruang kosong */}
              <CardContent className="flex flex-col flex-1">
                <div className="flex flex-col gap-2">
                  <span className="flex gap-2 items-center flex-wrap">
                    <DiaTextReveal
                      once
                      className="text-xl font-normal"
                      text={project.title}
                    />
                    <div className="flex flex-wrap items-center gap-1">
                      {project.badge && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 2 }}
                        >
                          <Badge>{project.badge}</Badge>
                        </motion.span>
                      )}

                      {project.isOngoing && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 2.5 }}
                        >
                          <Badge variant="secondary">Ongoing</Badge>
                        </motion.span>
                      )}
                    </div>
                  </span>
                  <p className="opacity-50">{project.description}</p>
                </div>

                {/* PERBAIKAN: Ubah mt-4 menjadi mt-auto, dan ubah items-end menjadi items-center */}
                <div className="flex mt-auto pt-6 items-center">
                  <Image
                    src="/assets/icons/github.svg"
                    alt={"GitHub"}
                    width={20}
                    height={20}
                    className="opacity-50"
                  />
                  {project.githubRepo ? (
                    <span className="ml-2 font-normal">
                      <Link href={`https://github.com/${project.githubRepo}`} target="_blank">
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
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
}
