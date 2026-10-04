import type { Metadata } from "next";
import { MinimalFooter } from "@/features/commons/footer";
import { Navbar } from "@/features/commons/navbar";
import {
  HumanHero,
  ManifestoContent,
} from "@/features/human/components";
import LightRays from "@/components/ui/LightRays";

export const metadata: Metadata = {
  title: "90% Human Hands, 10% AI: A Manifesto of Authentic Craft | Zerochirou",
  description:
    "Zerochirou's comprehensive manifesto on software engineering and web craft: 90% human hands and 10% AI. Rejecting vibe-coding in favor of genuine taste, intentional architecture, and deep empathy for the human on the other side of the screen.",
  alternates: {
    canonical: "https://zerochirou.com/human",
    languages: {
      "en-US": "https://zerochirou.com/human",
      "id-ID": "https://zerochirou.com/human",
    },
  },
  openGraph: {
    type: "article",
    title:
      "90% Human Hands, 10% AI: A Manifesto of Authentic Craft | Zerochirou",
    description:
      "No matter how capable the artificial intelligence, a product born from human hands carries an authentic soul that cannot be synthesized.",
    url: "https://zerochirou.com/human",
    siteName: "Zerochirou Portfolio",
    publishedTime: "2026-03-01T00:00:00Z",
    modifiedTime: "2026-10-02T00:00:00Z",
    authors: ["https://zerochirou.com/#person"],
    tags: [
      "Human Craftsmanship",
      "Vibe-Coding vs Craft",
      "Software Engineering",
      "Authentic Design",
      "Zerochirou",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "90% Human Hands, 10% AI: A Manifesto of Authentic Craft",
    description:
      "A manifesto on intentional software engineering, rejecting vibe-coding, and crafting with full consciousness of the human behind the screen.",
    creator: "@zerochirou",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://zerochirou.com/human#article",
    isPartOf: {
      "@type": "WebPage",
      "@id": "https://zerochirou.com/human",
      url: "https://zerochirou.com/human",
      name: "90% Human Hands, 10% AI: A Manifesto of Authentic Craft",
    },
    headline: "90% Human Hands, 10% AI: A Manifesto of Authentic Craft",
    description:
      "A comprehensive manifesto on the limits of statistical models, the crisis of vibe-coding, and why authentic software engineering demands human consciousness and empathy.",
    inLanguage: ["en", "id"],
    datePublished: "2026-03-01T00:00:00Z",
    dateModified: "2026-10-02T00:00:00Z",
    author: {
      "@type": "Person",
      "@id": "https://zerochirou.com/#person",
      name: "Zerochirou",
      url: "https://zerochirou.com",
    },
    publisher: {
      "@type": "Person",
      "@id": "https://zerochirou.com/#person",
      name: "Zerochirou",
      url: "https://zerochirou.com",
    },
    mainEntityOfPage: "https://zerochirou.com/human",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://zerochirou.com/human#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://zerochirou.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Human Craft Manifesto",
        item: "https://zerochirou.com/human",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://zerochirou.com/human#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why was this website built 90% by human hands and 10% with AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While modern artificial intelligence can generate code rapidly based on statistical probabilities, authentic software demands human taste, sub-pixel balance, zero-cost memory safety, and empathy for real users. 90% of the architecture, visual nuance, and systems decisions are made directly by human hands, while 10% uses AI for mechanical boilerplate and syntax lookups.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between vibe-coding and intentional software craftsmanship?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vibe-coding accepts generated code without reading or understanding its internal architecture, leading to fragile dependencies and memory leaks. Intentional craftsmen write and understand every line of code, ensuring longevity, accessibility, and respect for the person using the software.",
        },
      },
      {
        "@type": "Question",
        name: "How does Zerochirou use AI responsibly in development?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI is treated strictly as a mechanical assistant for repetitive boilerplate typing, rapid syntax lookups, and initial test file scaffolding. AI is never given authority over core architecture, design taste, or user experience decisions.",
        },
      },
    ],
  },
];

export default function HumanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative min-h-screen">
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={10}
            followMouse={true}
            mouseInfluence={0.5}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <Navbar subtitle="Human Craft" />
        <main className="overflow-x-clip min-h-screen">
          <HumanHero />
          <ManifestoContent />
          {/* <CraftComparison /> */}
          {/* <HumanSeal /> */}
        </main>
        <MinimalFooter />
      </div>
    </>
  );
}
