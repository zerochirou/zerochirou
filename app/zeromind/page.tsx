import type { Metadata, Viewport } from "next";
import { ZeromindView } from "@/features/zeromind";

export const metadata: Metadata = {
  title: "Zeromind — Interactive Whiteboard & Architecture Canvas",
  description:
    "Interactive visual thinking and collaborative diagramming whiteboard. Turn Mermaid code into editable sketches, system architectures, and flows.",
  openGraph: {
    title: "Zeromind — Interactive Whiteboard & Architecture Canvas",
    description:
      "Interactive visual thinking and collaborative diagramming whiteboard powered by Excalidraw and Mermaid.",
    type: "website",
    url: "https://zerochirou.com/zeromind",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeromind — Interactive Whiteboard",
    description:
      "Turn code and ideas into interactive system architecture diagrams.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ZeromindPage() {
  return <ZeromindView />;
}
