export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  stars: number;
  logoUrl: string;
  isOngoing: boolean;
  height: number;
  width: number;
  githubRepo?: string;
  badge?: string;
}

export const FEATURED_PROJECTS: ProjectSummary[] = [
  {
    id: "rayna",
    title: "Rayna",
    description: "Mathematical Love (for research)",
    stars: 142648,
    logoUrl: "/assets/icons/rayna.png",
    isOngoing: true,
    height: 130,
    width: 130,
  },
  {
    id: "clickfor",
    title: "Clickfor",
    description: "Changing the way food is ordered.",
    githubRepo: "zerochirou/clickfor",
    stars: 142648,
    logoUrl: "/assets/icons/clickfor.png",
    badge: "Startup",
    isOngoing: true,
    height: 120,
    width: 120,
  },
  {
    id: "hypergrid",
    title: "Hypergrid",
    description:
      "An instrument for analyzing road infrastructure capabilities using big data and deep learning.",
    stars: 142648,
    logoUrl: "/assets/icons/hyperg.png",
    isOngoing: true,
    height: 120,
    width: 120,
  },
  {
    id: "devinion",
    title: "Devinion",
    description:
      "Devinion provides a comprehensive software platform for developing, deploying, and controlling hardware systems.",
    stars: 142648,
    logoUrl: "/favicon.ico",
    isOngoing: true,
    height: 80,
    width: 80,
  },
  {
    id: "zensekit",
    title: "Zensekit",
    description:
      "A SaaS development kit optimized for rapid and scalable development. Using a monorepo architecture.",
    githubRepo: "zerochirou/zensekit",
    stars: 142648,
    logoUrl: "/favicon.ico",
    isOngoing: false,
    height: 80,
    width: 80,
    badge: "Framework",
  },
  {
    id: "rhea",
    title: "Rhea",
    description: "Voice-based Mac assistant running locally on the machine.",
    stars: 142648,
    logoUrl: "/favicon.ico",
    isOngoing: true,
    height: 80,
    width: 80,
  },
  {
    id: "desnet",
    title: "Desnet",
    description:
      "A decentralized peer-to-peer network protocol running on the desnet v1 engine without central servers.",
    stars: 142648,
    logoUrl: "/favicon.ico",
    isOngoing: true,
    height: 80,
    width: 80,
    badge: "Framework",
  },
];
