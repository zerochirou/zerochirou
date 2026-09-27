import { HeroSection } from "@/feature/home/components";
import { AboutSection } from "@/feature/home/components/about_section";
import { ProjectsSection } from "@/feature/home/components/projects_section";
import { StackSection } from "@/feature/home/components/stack_section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <StackSection />
      <ProjectsSection />
    </main>
  );
}
