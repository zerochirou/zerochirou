"use client";

import { useState, useMemo } from "react";
import { CourseCard, type CourseItem } from "./course_card";
import { SearchBar } from "./search_bar";
import { Button } from "@/components/ui/button";
import { SearchX, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

const initialCourses: CourseItem[] = [
  {
    id: "fisika-dasar",
    title: "Fisika Mekanika & Termodinamika",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "Fisika",
    level: "Pemula",
    duration: "14 Jam",
    modulesCount: 10,
    isPopular: true,
  },
  {
    id: "fisika-kuantum",
    title: "Pengantar Fisika Kuantum",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "Fisika",
    level: "Lanjutan",
    duration: "18 Jam",
    modulesCount: 12,
  },
  {
    id: "kalkulus-aljabar",
    title: "Kalkulus & Aljabar Linier Lanjut",
    description:
      "Fondasi Learn how to build a static blog with the Pages Router.",
    category: "Matematika",
    level: "Menengah",
    duration: "16 Jam",
    modulesCount: 11,
    isPopular: true,
  },
  {
    id: "algoritma-struktur-data",
    title: "Algoritma & Struktur Data",
    description:
      "Desain Learn how to build a static blog with the Pages Router.",
    category: "Ilmu Komputer",
    level: "Menengah",
    duration: "20 Jam",
    modulesCount: 14,
    isPopular: true,
  },
  {
    id: "arsitektur-komputer",
    title: "Arsitektur Komputer & Sistem Operasi",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "Sistem & Hardware",
    level: "Menengah",
    duration: "15 Jam",
    modulesCount: 9,
  },
  {
    id: "rekayasa-perangkat-lunak",
    title: "Rekayasa Perangkat Lunak Modern",
    description:
      "Praktik Learn how to build a static blog with the Pages Router.",
    category: "Ilmu Komputer",
    level: "Menengah",
    duration: "12 Jam",
    modulesCount: 8,
  },
  {
    id: "deep-learning-ai",
    title: "Machine Learning & Jaringan Saraf Tiruan",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "AI & Robotika",
    level: "Lanjutan",
    duration: "22 Jam",
    modulesCount: 15,
    isPopular: true,
  },
  {
    id: "jaringan-keamanan",
    title: "Jaringan Komputer & Protokol P2P",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "Sistem & Hardware",
    level: "Menengah",
    duration: "13 Jam",
    modulesCount: 9,
  },
  {
    id: "elektronika-embedded",
    title: "Sistem Embedded & Kontrol Hardware",
    description:
      "Learn how to build a static blog with the Pages Router.",
    category: "AI & Robotika",
    level: "Lanjutan",
    duration: "17 Jam",
    modulesCount: 11,
  },
];

const categories = [
  "Semua",
  "Fisika",
  "Matematika",
  "Ilmu Komputer",
  "Sistem & Hardware",
  "AI & Robotika",
];

export function CourseListSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesCategory =
        selectedCategory === "Semua" || course.category === selectedCategory;

      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery === "" ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.description.toLowerCase().includes(normalizedQuery) ||
        course.category.toLowerCase().includes(normalizedQuery) ||
        (course.level && course.level.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  return (
    <section
      aria-label="Daftar Mata Kuliah dan Pembelajaran"
      className="w-full flex items-center justify-center py-6 sm:py-10 md:py-14"
    >
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Search Bar at the Top */}
        <div className="w-full max-w-3xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            filteredResultCount={filteredCourses.length}
            placeholder="Cari mata kuliah, topik, atau kata kunci..."
          />
        </div>

        {/* Course Grid / Empty State */}
        {filteredCourses.length > 0 ? (
          <ul className="grid mt-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 list-none p-0 m-0">
            {filteredCourses.map((course, index) => (
              <motion.li
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.03, 0.15),
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <CourseCard course={course} />
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="w-full py-12 sm:py-16 px-4 text-center border border-dashed border-border/60 rounded-2xl sm:rounded-3xl bg-card/30 flex flex-col items-center justify-center space-y-4">
            <div className="size-12 sm:size-14 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <SearchX className="size-6 sm:size-7" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                Tidak ada materi kursus yang cocok
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tidak ditemukan hasil untuk{" "}
                {searchQuery && (
                  <span className="text-foreground font-medium">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
                {searchQuery && selectedCategory !== "Semua" && " dengan "}
                {selectedCategory !== "Semua" && (
                  <span>kategori &quot;{selectedCategory}&quot;</span>
                )}
                . Coba gunakan kata kunci lain atau bersihkan filter.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mt-2 text-xs sm:text-sm rounded-xl gap-1.5 border-border/50"
            >
              <RotateCcw className="size-3.5" />
              <span>Bersihkan Filter & Pencarian</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
