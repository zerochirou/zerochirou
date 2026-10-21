import type { Metadata } from "next";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { TarotReader } from "@/features/tarot";

export const metadata: Metadata = {
  title: "Tarot Reflection | Zerochirou",
  description:
    "Ruang kontemplasi tenang untuk menajamkan intuisi dan refleksi diri melalui kartu Major Arcana.",
  alternates: {
    canonical: "https://zerochirou.com/tarot",
  },
  openGraph: {
    title: "Tarot Reflection | Zerochirou",
    description:
      "Ruang kontemplasi tenang untuk menajamkan intuisi dan refleksi diri melalui kartu Major Arcana.",
    url: "https://zerochirou.com/tarot",
  },
};

export default function TarotPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-clip font-sans text-foreground">
      <Navbar subtitle="Tarot" />
      <main className="flex-1 pt-24 pb-12 sm:pt-28">
        <TarotReader />
      </main>
      <MinimalFooter />
    </div>
  );
}
