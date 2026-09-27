import { MinimalFooter } from "@/features/commons/footer";
import { Navbar, HeroSection } from "@/features/home/components";
import { AboutSection } from "@/features/home/components/about_section";
import { ProjectsSection } from "@/features/home/components/projects_section";
import { StackSection } from "@/features/home/components/stack_section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
      </main>
      <MinimalFooter />
    </>
  );
}
