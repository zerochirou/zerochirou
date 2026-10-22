import type { Metadata } from "next";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { TarotReader } from "@/features/tarot";
import { TarotBackground } from "@/features/tarot/components/tarot_background";

export const metadata: Metadata = {
  title: "Refleksi Tarot | Zerochirou",
  description:
    "Ruang kontemplasi batin untuk menajamkan intuisi dan refleksi diri melalui arkana tarot.",
  alternates: {
    canonical: "https://zerochirou.com/tarot",
  },
  openGraph: {
    title: "Refleksi Tarot | Zerochirou",
    description:
      "Ruang kontemplasi batin untuk menajamkan intuisi dan refleksi diri melalui arkana tarot.",
    url: "https://zerochirou.com/tarot",
  },
};

export default function TarotPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-clip font-sans text-foreground">
      <Navbar subtitle="Tarot" />
      <main className="flex-1 pt-12 pb-12 sm:pt-14 font-clash-grotesk">
        <TarotBackground>
          <TarotReader />
        </TarotBackground>
      </main>
      <MinimalFooter />
    </div>
  );
}
