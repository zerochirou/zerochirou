import { Sparkles, BookOpen, Compass, Flame, type LucideIcon } from "lucide-react";

export interface TimelineEntry {
  period: string;
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface StoryLanguageContent {
  heading: string;
  subtitle: string;
  timeline: TimelineEntry[];
  closing: string;
}

export const STORY_DATA: Record<"en" | "id", StoryLanguageContent> = {
  en: {
    heading: "About Me",
    subtitle:
      "High school student, software builder, and systems explorer based in Indonesia.",
    timeline: [
      {
        period: "Origins",
        badge: "The Spark",
        title: "Curiosity for Low-Level Systems",
        description:
          "Drawn into software engineering by curiosity about what happens under the hood. Inspired early on by the open-source ethos, tech pioneers, and computing architectures—learning how operating systems, network protocols, and compilers operate from first principles rather than just consuming high-level abstractions.",
        icon: Flame,
      },
      {
        period: "Present",
        badge: "Education & Craft",
        title: "High School & Applied Systems",
        description:
          "Currently a high school student balancing formal education with disciplined software engineering. Actively developing projects and ventures like Clickfor and Zensekit, while exploring deep learning, distributed architecture, and dependable systems craftsmanship.",
        icon: Flame,
      },
      {
        period: "Future",
        badge: "Horizon",
        title: "Independent Deep Tech Lab",
        description:
          "Working towards establishing an independent software engineering and deep-tech studio. The ambition is to research and build robust computational tools, decentralized infrastructure, and physical-digital integrations that address genuine real-world challenges.",
        icon: Flame,
      },
    ],
    closing:
      "At the core, I value intentional engineering over fleeting trends—believing that great software is built with patience, solid architecture, and a genuine respect for the people who use it.",
  },
  id: {
    heading: "Tentang Saya",
    subtitle:
      "Siswa SMA, software builder, dan penikmat rekayasa sistem di Indonesia.",
    timeline: [
      {
        period: "Masa Lalu",
        badge: "Awal Mula",
        title: "Rasa Ingin Tahu Arsitektur Sistem",
        description:
          "Tertarik ke dunia rekayasa perangkat lunak berawal dari rasa penasaran mendalam terhadap cara kerja komputer di balik layar. Terinspirasi oleh ekosistem open-source, para founder teknologi, serta rekayasa sistem tingkat rendah—bukan sekadar memakai software, melainkan memahami bagaimana OS, protokol jaringan, dan compiler beroperasi dari dasarnya.",
        icon: Sparkles,
      },
      {
        period: "Saat Ini",
        badge: "Pendidikan & Karya",
        title: "Bangku Sekolah & Riset Terapan",
        description:
          "Saat ini menempuh pendidikan di bangku SMA, membagi waktu antara studi formal dan eksplorasi rekayasa perangkat lunak mandiri. Mengembangkan inisiatif dan venture seperti Clickfor serta Zensekit, sembari mendalami distributed systems dan deep learning dengan pendekatan craftsmanship yang terukur.",
        icon: BookOpen,
      },
      {
        period: "Masa Depan",
        badge: "Langkah Depan",
        title: "Studio Rekayasa & Deep Tech Lab",
        description:
          "Membangun lab rekayasa software mandiri yang berorientasi pada deep tech—menciptakan perkakas komputasi yang kokoh, transparan, dan berdaya guna untuk memecahkan masalah nyata di masyarakat.",
        icon: Compass,
      },
    ],
    closing:
      "Pada intinya, saya memprioritaskan rekayasa terarah di atas tren sesaat—percaya bahwa perangkat lunak yang baik dibangun dengan ketekunan, arsitektur yang bersih, serta penghormatan mendalam bagi manusia yang menggunakannya.",
  },
};
