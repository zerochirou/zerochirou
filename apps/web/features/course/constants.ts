import type { CourseChapter, SubCourseDetail, CourseItem } from "./types";
import { formatSlugToTitle } from "./lib/format_slug";

export type { CourseChapter, SubCourseDetail, CourseItem };
export { formatSlugToTitle };

export const COURSE_CATEGORIES: string[] = [
  "Semua",
  "Fisika",
  "Matematika",
  "Ilmu Komputer",
  "Sistem & Hardware",
  "AI & Robotika",
];

export const COURSES_DATA: CourseItem[] = [
  {
    id: "fisika-dasar",
    title: "Fisika Mekanika & Termodinamika",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "Fisika",
    level: "Pemula",
    duration: "14 Jam",
    modulesCount: 10,
    isPopular: true,
  },
  {
    id: "fisika-kuantum",
    title: "Pengantar Fisika Kuantum",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "Fisika",
    level: "Lanjutan",
    duration: "18 Jam",
    modulesCount: 12,
  },
  {
    id: "kalkulus-aljabar",
    title: "Kalkulus & Aljabar Linier Lanjut",
    description: "Fondasi Learn how to build a static blog with the Pages Router.",
    category: "Matematika",
    level: "Menengah",
    duration: "16 Jam",
    modulesCount: 11,
    isPopular: true,
  },
  {
    id: "algoritma-struktur-data",
    title: "Algoritma & Struktur Data",
    description: "Desain Learn how to build a static blog with the Pages Router.",
    category: "Ilmu Komputer",
    level: "Menengah",
    duration: "20 Jam",
    modulesCount: 14,
    isPopular: true,
  },
  {
    id: "arsitektur-komputer",
    title: "Arsitektur Komputer & Sistem Operasi",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "Sistem & Hardware",
    level: "Menengah",
    duration: "15 Jam",
    modulesCount: 9,
  },
  {
    id: "rekayasa-perangkat-lunak",
    title: "Rekayasa Perangkat Lunak Modern",
    description: "Praktik Learn how to build a static blog with the Pages Router.",
    category: "Ilmu Komputer",
    level: "Menengah",
    duration: "12 Jam",
    modulesCount: 8,
  },
  {
    id: "deep-learning-ai",
    title: "Machine Learning & Jaringan Saraf Tiruan",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "AI & Robotika",
    level: "Lanjutan",
    duration: "22 Jam",
    modulesCount: 15,
    isPopular: true,
  },
  {
    id: "jaringan-keamanan",
    title: "Jaringan Komputer & Protokol P2P",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "Sistem & Hardware",
    level: "Menengah",
    duration: "13 Jam",
    modulesCount: 9,
  },
  {
    id: "elektronika-embedded",
    title: "Sistem Embedded & Kontrol Hardware",
    description: "Learn how to build a static blog with the Pages Router.",
    category: "AI & Robotika",
    level: "Lanjutan",
    duration: "17 Jam",
    modulesCount: 11,
  },
];

export const COURSE_CHAPTERS: CourseChapter[] = [
  {
    id: 1,
    slug: "besaran-dan-pengukuran",
    title: "Besaran dan Pengukuran",
    description:
      "Mempelajari konsep dimensi fisik, satuan internasional (SI), serta analisis ketidakpastian dalam eksperimen pengukuran.",
  },
  {
    id: 2,
    slug: "vektor-dan-kinematika",
    title: "Vektor & Kinematika Partikel",
    description:
      "Dekomposisi vektor dalam ruang Cartesian, gerak lurus berubah beraturan (GLBB), dan trajektori gerak parabola.",
  },
  {
    id: 3,
    slug: "dinamika-hukum-newton",
    title: "Dinamika Gerak & Hukum Newton",
    description:
      "Hukum Newton I, II, dan III, analisis diagram benda bebas, gaya gesek, dan gerak melingkar beraturan.",
  },
  {
    id: 4,
    slug: "usaha-dan-energi",
    title: "Usaha, Energi, & Kekekalan",
    description:
      "Prinsip kerja mekanis, energi potensial konservatif, dan hukum kekekalan energi mekanik.",
  },
  {
    id: 5,
    slug: "momentum-dan-tumbukan",
    title: "Momentum Linier & Tumbukan",
    description:
      "Impuls partikel, kekekalan momentum linier, dan analisis tumbukan elastis maupun tak elastis.",
  },
  {
    id: 6,
    slug: "gerak-rotasi",
    title: "Dinamika Rotasi & Momen Inersia",
    description:
      "Torsi, momen inersia benda tegar, momentum sudut, dan analogi gerak rotasi dengan translasi.",
  },
  {
    id: 7,
    slug: "termodinamika-dasar",
    title: "Hukum Termodinamika",
    description:
      "Suhu, kalor, kapasitas termal, siklus gas ideal, dan pengantar entropi sistem fisik.",
  },
];

export const MOCK_SUBCOURSES: Record<string, SubCourseDetail> = {
  "besaran-dan-pengukuran": {
    title: "Besaran dan Pengukuran",
    readTime: "20 Menit",
    level: "Dasar",
    intuition:
      "Dalam fisika empiris, pengukuran adalah gerbang utama antara matematika teoretis dan realitas alamiah. Setiap besaran fisik diukur dengan standar satuan internasional (SI) serta memiliki tingkat ketidakpastian (margin of error) yang harus dicatat secara sistematis.",
    formula: {
      label: "Persamaan Ketidakpastian Pengukuran Berulang",
      equation: "\\Delta x = \\frac{1}{N} \\sqrt{\\frac{N\\sum x_i^2 - (\\sum x_i)^2}{N - 1}}",
      explanation:
        "Standar deviasi rata-rata digunakan untuk menentukan presisi dan ketidakpastian mutlak dari rangkaian pengukuran sampel berulang.",
    },
    keyTakeaways: [
      "Besaran pokok SI mencakup panjang (m), massa (kg), waktu (s), kuat arus (A), suhu (K), intensitas cahaya (cd), dan jumlah zat (mol).",
      "Analisis dimensi membantu memverifikasi konsistensi matematis dari suatu rumus fisika.",
      "Aturan angka penting (significant figures) harus konsisten dari tahap perhitungan hingga hasil akhir.",
    ],
    code: {
      fileName: "measurement_uncertainty.py",
      language: "python",
      snippet: `import numpy as np

# Data sampel eksperimen pengukuran diameter silinder (mm)
data = np.array([12.45, 12.48, 12.46, 12.47, 12.45, 12.46])

mean = np.mean(data)
std_dev = np.std(data, ddof=1)
uncertainty = std_dev / np.sqrt(len(data))

print(f"Hasil: ({mean:.3f} ± {uncertainty:.3f}) mm")`,
    },
    exercise: {
      question:
        "Jika sebuah kubus memiliki panjang sisi (5.0 ± 0.1) cm, tentukan volume kubus beserta estimasi ketidakpastian relatifnya.",
      hint: "Gunakan propagasi ketidakpastian volume: ΔV/V = 3 × (Δs/s).",
    },
    nextSlug: "vektor-dan-kinematika",
    nextTitle: "Vektor & Kinematika Partikel",
  },
  "vektor-dan-kinematika": {
    title: "Vektor & Kinematika Partikel",
    readTime: "25 Menit",
    level: "Dasar - Menengah",
    intuition:
      "Besaran skalar seperti suhu hanya memerlukan angka, namun gerak roket atau partikel di medan listrik memiliki orientasi arah. Vektor adalah bahasa dasar untuk mendeskripsikan ruang multi-dimensi secara presisi.",
    formula: {
      label: "Dekomposisi Vektor & Laju Kecepatan Sesaat",
      equation: "\\vec{v}(t) = \\frac{d\\vec{r}}{dt} = \\dot{x}\\hat{i} + \\dot{y}\\hat{j} + \\dot{z}\\hat{k}",
      explanation:
        "Kecepatan sesaat partikel merupakan turunan pertama dari vektor posisi terhadap waktu dalam basis koordinat ortonormal.",
    },
    keyTakeaways: [
      "Vektor memiliki magnitudo dan orientasi yang invarian terhadap pergeseran sistem koordinat.",
      "Dot product (A · B) menghasilkan skalar untuk menghitung usaha dan proyeksi ortogonal.",
      "Cross product (A × B) menghasilkan vektor tegak lurus untuk torsi dan momentum sudut.",
    ],
    code: {
      fileName: "vector_trajectory.py",
      language: "python",
      snippet: `import numpy as np

# Posisi awal dan kecepatan awal
r0 = np.array([0.0, 0.0])
v0 = np.array([20.0, 15.0]) # vx, vy
g  = np.array([0.0, -9.81])

t = np.linspace(0, 3.0, 100)
positions = [r0 + v0 * ti + 0.5 * g * (ti**2) for ti in t]
print("Simulasi posisi selesai, 100 titik terhitung.")`,
    },
    exercise: {
      question:
        "Diberikan dua vektor A = 3i + 4j dan B = -2i + 5j. Hitunglah nilai perkalian skalar (A · B) dan sudut di antara keduanya.",
      hint: "Gunakan hubungan A · B = |A| |B| cos(θ).",
    },
    nextSlug: "dinamika-hukum-newton",
    nextTitle: "Dinamika Gerak & Hukum Newton",
  },
};
