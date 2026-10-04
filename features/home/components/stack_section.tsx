"use client";

import BlurText from "@/components/ui/blur_text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Languages } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Galaxy = dynamic(() => import("@/components/ui/galaxy"), {
  ssr: false,
});

const items = [
  // ... (Data array items tidak perlu diubah, tetap sama seperti sebelumnya)
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nodejs/default.svg",
    link: "https://nodejs.org/",
    title: "Node.js",
    description:
      "JavaScript runtime environment yang berjalan di luar browser.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/bun/default.svg",
    link: "https://bun.sh/",
    title: "Bun",
    description:
      "Toolkit dan runtime JavaScript/TypeScript all-in-one yang sangat cepat.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/typescript/default.svg",
    link: "https://www.typescriptlang.org/",
    title: "TypeScript",
    description:
      "Superset JavaScript dengan sistem pengetikan statis yang kuat.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/javascript/default.svg",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    title: "JavaScript",
    description:
      "Bahasa pemrograman tingkat tinggi dan inti dari pengembangan web.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/python/default.svg",
    link: "https://www.python.org/",
    title: "Python",
    description:
      "Bahasa pemrograman tingkat tinggi yang dikenal karena sederhananya dan kekuatannya.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/go/default.svg",
    link: "https://go.dev/",
    title: "Go (Golang)",
    description: "Bahasa pemrograman open-source dan terkompilasi dari Google.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/rust/default.svg",
    link: "https://www.rust-lang.org/",
    title: "Rust",
    description:
      "Bahasa pemrograman sistem yang mengutamakan keamanan memori (memory safety).",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/c-plusplus/default.svg",
    link: "https://isocpp.org/",
    title: "C++",
    description:
      "Bahasa pemrograman serbaguna berorientasi objek dengan performa tinggi.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/postgresql/default.svg",
    link: "https://www.postgresql.org/",
    title: "PostgreSQL",
    description: "Sistem manajemen basis data relasional objek open-source.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/redis/default.svg",
    link: "https://redis.io/",
    title: "Redis",
    description:
      "Penyimpanan struktur data in-memory yang digunakan sebagai database dan cache.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nextjs/default.svg",
    link: "https://nextjs.org/",
    title: "Next.js",
    description: "Framework React untuk membangun aplikasi web full-stack.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/react/default.svg",
    link: "https://react.dev/",
    title: "React",
    description:
      "Library JavaScript untuk membangun antarmuka pengguna berbasis komponen.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/tailwindcss/default.svg",
    link: "https://tailwindcss.com/",
    title: "Tailwind CSS",
    description: "Framework CSS utility-first untuk mempercepat desain UI.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/arduino/default.svg",
    link: "https://www.arduino.cc/",
    title: "Arduino",
    description:
      "Platform mikrokontroler open-source untuk proyek perangkat keras (hardware).",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/docker/default.svg",
    link: "https://www.docker.com/",
    title: "Docker",
    description:
      "Platform untuk mengembangkan, mengirim, dan menjalankan aplikasi dalam container.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/rabbitmq/default.svg",
    link: "https://www.rabbitmq.com/",
    title: "RabbitMQ",
    description:
      "Message broker open-source untuk komunikasi antar layanan yang andal.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nestjs/default.svg",
    link: "https://nestjs.com/",
    title: "NestJS",
    description:
      "Framework Node.js yang progresif untuk membangun aplikasi server-side yang efisien.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/hono/default.svg",
    link: "https://hono.dev/",
    title: "Hono",
    description:
      "Framework web berukuran sangat kecil dan cepat untuk edge network.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/svelte/default.svg",
    link: "https://svelte.dev/",
    title: "Svelte",
    description:
      "Kompilator antarmuka pengguna tanpa virtual DOM untuk performa maksimal.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/vue/default.svg",
    link: "https://vuejs.org/",
    title: "Vue",
    description:
      "Framework JavaScript progresif yang mudah dipelajari untuk UI.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/solidjs/default.svg",
    link: "https://www.solidjs.com/",
    title: "SolidJS",
    description:
      "Library JavaScript deklaratif untuk membuat UI berbasis reaktivitas murni.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/pytorch/default.svg",
    link: "https://pytorch.org/",
    title: "PyTorch",
    description: "Framework machine learning open-source yang fleksibel.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/numpy/default.svg",
    link: "https://numpy.org/",
    title: "NumPy",
    description:
      "Pustaka fundamental untuk komputasi ilmiah (scientific computing) dengan Python.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/huggingface/default.svg",
    link: "https://huggingface.co/",
    title: "Hugging Face",
    description:
      "Platform kolaboratif untuk komunitas kecerdasan buatan (AI) dan machine learning.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/shadcn-ui/default.svg",
    link: "https://ui.shadcn.com/",
    title: "shadcn/ui",
    description:
      "Kumpulan komponen UI desain tinggi yang dapat disalin langsung ke aplikasi.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github/dark.svg",
    link: "https://github.com/",
    title: "GitHub",
    description: "Platform hosting dan kolaborasi pengembang berbasis Git.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/tensorflow/default.svg",
    link: "https://www.tensorflow.org/",
    title: "TensorFlow",
    description: "Platform end-to-end open-source untuk machine learning.",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/pandas/default.svg",
    link: "https://pandas.pydata.org/",
    title: "Pandas",
    description:
      "Alat analisis dan manipulasi data open-source yang cepat dan tangguh.",
  },
];

export function StackSection() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [showStack, setShowStack] = useState(false);

  useEffect(() => {
    if (!isEnglish || showStack) return;

    const timeoutId = setTimeout(() => {
      setShowGalaxy(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isEnglish, showStack]);

  // Handler fungsi untuk menukar bahasa dan me-reset state
  const handleLanguageToggle = () => {
    if (isEnglish) {
      // Jika kembali ke Chinese, reset semua state di event handler (Bukan di useEffect)
      setIsEnglish(false);
      setShowGalaxy(false);
      setShowStack(false);
    } else {
      setIsEnglish(true);
    }
  };

  const textZh =
    "優秀的開發者是那些能夠解決問題的人，而不是那些只專注於特定技術堆疊的人。";
  const textEn =
    "A good developer is one who solves problems, rather than being fixated on a specific tech stack.";

  return (
    <section
      id="stack"
      aria-label="Tech Stack and Skills"
      className="relative w-full min-h-[200vh] h-auto"
    >
      <h2 className="sr-only">
        Tech Stack &amp; Core Engineering Skills - Zerochirou
      </h2>
      <div className="sr-only">
        <h3>Zerochirou Technology Stack &amp; Systems Capabilities</h3>
        <ul>
          {items.map((item) => (
            <li key={`seo-${item.title}`}>
              <strong>{item.title}</strong>: {item.description}
            </li>
          ))}
        </ul>
      </div>
      {/* Layar 1 */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full bg-background z-10 px-4 text-center overflow-hidden">
        <BlurText
          text="Then where the tech stack?!"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-2xl sm:text-5xl md:text-5xl mb-2 justify-center"
        />
        <BlurText
          text="Where is Next.js? Where are Rust and Go?"
          delay={400}
          animateBy="words"
          direction="top"
          className="text-xs sm:text-base md:text-lg mb-8 text-muted-foreground justify-center"
        />
        <Button>Keep Scroll</Button>
      </div>

      {/* Layar 2 */}
      <div
        className={`relative min-h-screen flex flex-col items-center justify-center w-full z-20 px-3 sm:px-6 md:px-8 py-16 sm:py-20 gap-6 sm:gap-8 transition-colors duration-1000 ${
          isEnglish
            ? "bg-background text-white"
            : "bg-background text-foreground"
        }`}
      >
        <div className="pointer-events-none absolute -top-40 sm:-top-64 left-0 right-0 h-40 sm:h-80 z-5 bg-gradient-to-t from-background to-transparent" />

        {/* Latar Belakang Galaxy */}
        <div
          className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
            showGalaxy ? "opacity-100" : "opacity-0"
          }`}
        >
          {isEnglish && (
            <Galaxy
              starSpeed={0.1}
              density={1}
              hueShift={140}
              speed={1}
              glowIntensity={0.3}
              saturation={0}
              mouseRepulsion={false}
              repulsionStrength={2}
              twinkleIntensity={0.3}
              rotationSpeed={0.1}
              transparent
            />
          )}
        </div>

        {/* Konten Utama Teks */}
        <div className="max-w-4xl text-center relative z-10 w-full px-2">
          {!showStack && (
            <BlurText
              key={isEnglish ? "en" : "zh"}
              text={isEnglish ? textEn : textZh}
              delay={100}
              animateBy={isEnglish ? "words" : "letters"}
              direction="top"
              className="text-2xl sm:text-2xl md:text-4xl md:leading-normal md:justify-center"
            />
          )}
        </div>

        {/* Grid Tech Stack */}
        {showStack && (
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-2 sm:mt-4">
            <ul className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-0 border border-border/40">
              {items.map((item) => (
                <Card
                  key={item.title}
                  className="animate-in group fade-in zoom-in duration-500 group bg-background rounded-none border-none py-3 px-2 sm:py-4 sm:px-3 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1 sm:gap-1.5"
                >
                  <CardHeader className="flex items-center justify-center p-0 mb-1.5 sm:mb-2">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:scale-110 group-hover:spin  transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 w-full text-center">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.description}
                      className="text-center w-full min-w-0"
                    >
                      <span className="text-xs sm:text-sm font-medium block truncate max-w-full px-1">
                        {item.title}
                      </span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </ul>
          </div>
        )}

        {/* Grup Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 mt-4 sm:mt-6 max-w-md">
          <Button
            variant={isEnglish ? "secondary" : "default"}
            className="transition-all duration-300 flex-1 sm:flex-none h-10 sm:h-11 text-xs sm:text-sm px-4"
            onClick={handleLanguageToggle} // <- Logika reset dipindah ke handler ini
          >
            <Languages className="w-4 h-4 mr-2 shrink-0" />
            {isEnglish ? "Back to Chinese" : "Translate"}
          </Button>

          {isEnglish && (
            <Button
              variant="outline"
              className={`transition-all duration-300 flex-1 sm:flex-none h-10 sm:h-11 text-xs sm:text-sm px-4 ${
                showStack
                  ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                  : "bg-transparent text-white border-white/30 hover:bg-white/10"
              }`}
              onClick={() => {
                const next = !showStack;
                setShowStack(next);
                if (next) {
                  setShowGalaxy(false);
                }
              }}
            >
              {showStack ? "Hide Tech Stack" : "Okey, you want see it"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
