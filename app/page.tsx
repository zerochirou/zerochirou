import { MinimalFooter } from "@/features/commons/footer";
import { Navbar } from "@/features/commons/navbar";
import { HeroSection } from "@/features/home/components/hero_section";
import { AboutSection } from "@/features/home/components/about_section";
import { ProjectsSection } from "@/features/home/components/projects_section";
import { StackSection } from "@/features/home/components/stack_section";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <HeroSection nameText="Zerochirou." heading="Hi, introduction" />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
      </main>
      <MinimalFooter />
    </>
  );
}
