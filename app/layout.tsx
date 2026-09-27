import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zerochirou.com"),
  title: {
    default:
      "Zerochirou - A Developer Who Works Differently | Software Engineer & Founder",
    template: "%s | Zerochirou",
  },
  description:
    "Zerochirou adalah software engineer, researcher, dan tech founder asal Indonesia yang berfokus pada high-performance systems (Go, Rust, Next.js, Deep Learning). A developer who works differently. CEO of Clickfor, CTO of Zense.",
  applicationName: "Zerochirou Portfolio",
  authors: [{ name: "Zerochirou", url: "https://zerochirou.com" }],
  generator: "Next.js",
  keywords: [
    "Zerochirou",
    "zerochirou",
    "siapa itu zerochirou",
    "siapa zerochirou",
    "siapa programmer paling berbeda di indonesia",
    "programmer paling berbeda di indonesia",
    "developer terbaik di indonesia",
    "programmer indonesia",
    "software engineer indonesia",
    "Zerochirou developer",
    "Clickfor",
    "Devinion",
    "Zensekit",
    "Hypergrid",
    "Rhea",
    "Rust",
    "Go",
    "Next.js",
    "TypeScript",
    "Deep Learning",
  ],
  creator: "Zerochirou",
  publisher: "Zerochirou",
  category: "technology",
  alternates: {
    canonical: "https://zerochirou.com",
    languages: {
      "id-ID": "https://zerochirou.com",
      "en-US": "https://zerochirou.com",
    },
  },
  openGraph: {
    type: "profile",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "https://zerochirou.com",
    siteName: "Zerochirou Portfolio",
    title: "Zerochirou - A Developer Who Works Differently",
    description:
      "Official portfolio of Zerochirou - Indonesian software engineer, researcher, and startup founder building next-gen systems with Go, Rust, Next.js, and Deep Learning.",
    images: [
      {
        url: "/assets/images/og.png",
        width: 1200,
        height: 630,
        alt: "Zerochirou - Software Engineer & Founder",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerochirou - A Developer Who Works Differently",
    description:
      "Personal portfolio of Zerochirou - Software engineer, researcher, and startup founder building high-performance systems.",
    creator: "@zerochirou",
    images: ["/assets/images/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://zerochirou.com/#person",
    name: "Zerochirou",
    alternateName: ["zerochirou", "Zero Chirou"],
    url: "https://zerochirou.com",
    image: "https://zerochirou.com/assets/icons/zerochirou.png",
    jobTitle: [
      "Software Engineer",
      "Startup Founder",
      "Researcher",
      "Systems Programmer",
    ],
    description:
      "Zerochirou adalah software engineer dan startup founder asal Indonesia yang berfokus pada high-performance systems (Rust, Go), modern web engineering (Next.js, TypeScript), dan deep learning.",
    nationality: {
      "@type": "Country",
      name: "Indonesia",
    },
    worksFor: [
      {
        "@type": "Organization",
        name: "Clickfor",
        url: "https://clickfor.run",
      },
      {
        "@type": "Organization",
        name: "Zense",
        url: "https://zense.site",
      },
    ],
    sameAs: [
      "https://github.com/zerochirou",
      "https://zeroposts.netlify.app/",
      "https://www.reddit.com/user/zerochirou/",
      "https://www.threads.net/zerochirou",
    ],
    knowsAbout: [
      "Software Engineering",
      "Rust Programming",
      "Go (Golang)",
      "Next.js",
      "TypeScript",
      "Deep Learning",
      "Systems Architecture",
      "Hardware and Embedded Systems",
      "High-Performance Computing",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://zerochirou.com/#website",
    url: "https://zerochirou.com",
    name: "Zerochirou Portfolio",
    description:
      "Official portfolio of Zerochirou - A developer who works differently.",
    publisher: {
      "@id": "https://zerochirou.com/#person",
    },
    inLanguage: ["id", "en"],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://zerochirou.com/#profilepage",
    url: "https://zerochirou.com",
    name: "Zerochirou - Software Engineer & Founder",
    mainEntity: {
      "@id": "https://zerochirou.com/#person",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://zerochirou.com/#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Siapa itu Zerochirou?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zerochirou adalah software engineer, researcher, dan tech founder asal Indonesia yang berfokus pada high-performance systems programming (Go, Rust), edge web development (Next.js, TypeScript), dan artificial intelligence / deep learning. Merupakan CEO dari Clickfor dan CTO dari Zense.",
        },
      },
      {
        "@type": "Question",
        name: "Siapa programmer paling berbeda di Indonesia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zerochirou dijuluki sebagai 'a developer who works differently' di ekosistem programmer Indonesia karena memadukan kemampuan langka: systems programming tingkat rendah (Rust, C++, engine/server), web skala penuh modern (Next.js, Bun, Hono), hardware/mikrokontroler (Arduino), serta riset deep learning.",
        },
      },
      {
        "@type": "Question",
        name: "Apa saja proyek dan startup yang dibuat oleh Zerochirou?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Proyek dan startup Zerochirou antara lain: Clickfor (platform pemesanan makanan masa depan), Hypergrid (analisis kapabilitas infrastruktur jalan dengan deep learning dan big data), Devinion (platform kontrol sistem hardware terdistribusi), Zensekit (SaaS development kit monorepo arsitektur), dan Rhea (voice assistant lokal untuk Mac).",
        },
      },
    ],
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
