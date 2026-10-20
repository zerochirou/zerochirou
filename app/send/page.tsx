import type { Metadata } from "next";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";
import { SendView } from "@/features/send";
import { getPublicQuestions, type AnonymousQuestion } from "@/lib/db";
import LightRays from "@/components/ui/light_rays";

export const metadata: Metadata = {
  title: "Tanya Anonim | Zerochirou",
  description:
    "Kirim pesan, feedback, atau pertanyaan tanpa identitas secara aman langsung ke inbox Zerochirou.",
  alternates: {
    canonical: "https://zerochirou.com/send",
  },
  openGraph: {
    title: "Tanya Anonim | Zerochirou",
    description:
      "Kirim pesan atau pertanyaan tanpa identitas secara langsung ke Zerochirou.",
    url: "https://zerochirou.com/send",
  },
};

export default async function SendPage() {
  let initialQuestions: AnonymousQuestion[] = [];

  try {
    initialQuestions = await getPublicQuestions({
      answeredOnly: true,
      limit: 30,
    });
  } catch {
    // Graceful fallback when running in static export/build or without local D1 proxy
    initialQuestions = [];
  }

  return (
    <div className="relative min-h-screen w-full flex-col justify-between overflow-x-clip font-sans text-foreground">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={0.5}
          rayLength={3}
          followMouse={false}
          mouseInfluence={0.5}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={0.2}
          saturation={0.2}
        />
      </div>
      <Navbar subtitle="Curhat" />
      <div className="flex-1 pt-24 pb-12 sm:pt-28">
        <SendView initialQuestions={initialQuestions} />
      </div>
      <MinimalFooter />
    </div>
  );
}
