import type { Metadata, Viewport } from "next";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { LoveView } from "@/features/love";

export const metadata: Metadata = {
  title: "Love Rate Predictor — IndoBERT Transformer | Zerochirou",
  description:
    "Analisis tingkat afeksi, kerinduan, dan dinamika percakapan pasangan bahasa Indonesia menggunakan model IndoBERT Base Transformer yang dioptimalkan dengan ONNX.",
  openGraph: {
    title: "Love Rate Predictor — IndoBERT Transformer",
    description:
      "Analisis tingkat afeksi dan dinamika emosional percakapan pasangan menggunakan IndoBERT NLP.",
    type: "website",
    url: "https://zerochirou.com/love",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Rate Predictor — IndoBERT Transformer",
    description:
      "Evaluasi dinamika percakapan pasangan dengan model NLP IndoBERT terkalibrasi.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
};

export default function LovePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground overflow-x-clip">
      <Navbar subtitle="Love Predictor" />
      <main className="flex-1 pt-24 pb-12">
        <LoveView />
      </main>
      <MinimalFooter />
    </div>
  );
}
