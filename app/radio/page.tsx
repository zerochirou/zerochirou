import type { Metadata } from "next";
import { RadioPlayer } from "@/features/radio/components/radio_player";
import { Navbar } from "@/features/commons/navbar";
import { MinimalFooter } from "@/features/commons/footer";

export const metadata: Metadata = {
  title: "Code Radio - 24/7 Music Designed for Coding",
  description:
    "Listen to 24/7 ad-free, relaxing lo-fi and instrumental music designed to help you focus and code.",
  openGraph: {
    title: "Code Radio - 24/7 Music Designed for Coding | Zerochirou",
    description:
      "24/7 ad-free lo-fi, chillhop, and synthwave stream for developers and learners.",
    images: [
      {
        url: "/assets/images/radio_bg.jpg",
        width: 1200,
        height: 630,
        alt: "Code Radio Player",
      },
    ],
  },
};

export default function RadioPage() {
  return (
    <>
      <RadioPlayer />
      <MinimalFooter />
    </>
  );
}
