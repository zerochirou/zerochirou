"use client";

import BlurText from "@/components/blur_text";
import Galaxy from "@/components/galaxy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Languages } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    }, 4000);

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
    <div className="relative w-full h-[200vh]">
      {/* Layar 1 */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full bg-background z-10 px-4 text-center">
        <BlurText
          text="Then where the tech stack?!"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl mb-2 font-bold"
        />
        <BlurText
          text="Scroll first!"
          delay={400}
          animateBy="words"
          direction="top"
          className="text-sm md:text-lg mb-8 text-muted-foreground"
        />
      </div>

      {/* Layar 2 */}
      <div
        className={`relative min-h-screen flex flex-col items-center justify-center w-full z-20 px-4 py-20 gap-8 transition-colors duration-1000 ${
          isEnglish ? "bg-background text-white" : "bg-background text-foreground"
        }`}
      >
        <div className="pointer-events-none absolute -top-64 left-0 right-0 h-80 z-5 bg-gradient-to-t from-background to-transparent" />

        {/* Latar Belakang Galaxy */}
        <div
          className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
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
        <div className="max-w-4xl text-center relative z-10">
          {!showStack && (
            <BlurText
              key={isEnglish ? "en" : "zh"}
              text={isEnglish ? textEn : textZh}
              delay={50}
              animateBy="letters"
              direction="bottom"
              className="text-2xl md:text-4xl font-medium leading-relaxed md:leading-normal"
            />
          )}
        </div>

        {/* Grid Tech Stack */}
        {showStack && (
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-4 animate-in fade-in zoom-in duration-500">
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-0">
              {items.map((item) => (
                <Card key={item.title} className="group bg-background rounded-none border">
                  <CardHeader className="flex items-center justify-center">
                    <div className="relative w-10 h-10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className=""
                        unoptimized
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.description}
                      className=""
                    >
                      <span className="">{item.title}</span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </ul>
          </div>
        )}

        {/* Grup Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 mt-6">
          <Button
            variant={isEnglish ? "secondary" : "default"}
            className="transition-all duration-300 min-w-[140px]"
            onClick={handleLanguageToggle} // <- Logika reset dipindah ke handler ini
          >
            <Languages className="w-4 h-4 mr-2" />
            {isEnglish ? "Back to Chinese" : "Translate"}
          </Button>

          {isEnglish && (
            <Button
              variant="outline"
              className={`transition-all duration-300 min-w-[180px] ${
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
    </div>
  );
}
