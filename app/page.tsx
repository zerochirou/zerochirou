import { MinimalFooter } from "@/features/commons/footer";
import { Navbar } from "@/features/commons/navbar";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  StackSection,
} from "@/features/home/components";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip font-clash-grotesk">
        <HeroSection showAscii={true} />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
      </main>
      <MinimalFooter />
    </>
  );
}
