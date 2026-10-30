import { MinimalFooter } from "@/features/commons/footer";
import { Navbar } from "@/features/commons/navbar";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  StackSection,
  VideoPlay,
} from "@/features/home/components";

// Monorepo web scope test
export default async function Home() {
  return (
    <>
      <VideoPlay>
        <Navbar />
        <main className="overflow-x-clip font-clash-grotesk">
          <HeroSection showAscii={true} />
          <AboutSection />
          <StackSection />
          <ProjectsSection />
        </main>
        <MinimalFooter />
      </VideoPlay>
    </>
  );
}
