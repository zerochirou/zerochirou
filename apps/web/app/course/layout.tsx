import LightRays from "@/components/ui/light_rays";
import { MinimalFooter } from "@/features/commons/footer";
import { Navbar } from "@/features/commons/navbar";
import { ReactNode } from "react";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative flex flex-col overflow-x-clip">
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
      <Navbar subtitle="Self Course" />
      <main className="flex-1 pt-24 pb-14 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 px-3 sm:px-6 lg:px-8">
        {children}
      </main>
      <MinimalFooter />
    </div>
  );
}
