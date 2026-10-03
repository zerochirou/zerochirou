import Link from "next/link";
import { Fingerprint, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HumanSeal() {
  return (
    <section className="py-16 sm:py-24 px-4 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-8">
      <div className="w-full max-w-2xl p-8 sm:p-10 rounded-4xl bg-card border border-border/80 shadow-2xl relative overflow-hidden flex flex-col items-center gap-6">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-48 rounded-full bg-foreground/5 blur-2xl" />

        <div className="size-16 rounded-full bg-secondary flex items-center justify-center text-foreground border border-border">
          <Fingerprint className="size-8" />
        </div>

        <div className="flex flex-col gap-2 max-w-lg">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            STANDARDS OF AUTHENTIC SOFTWARE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Built with Heart and Consciousness
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            Every component, transition, and data schema across this website has been tested and tuned directly by human hands. We dedicate full care to everyone who visits.
          </p>
        </div>

        {/* Verification Checklist Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left max-w-md pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-foreground shrink-0" />
            <span>100% Verified Architecture</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-foreground shrink-0" />
            <span>WCAG AA Contrast Compliance</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-foreground shrink-0" />
            <span>Strict WebGL Memory Disposal</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-foreground shrink-0" />
            <span>Zero Wasteful Dependencies</span>
          </div>
        </div>

        <div className="w-full h-px bg-border/40 mt-2" />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="default"
            size="lg"
            className="w-full sm:w-auto"
          >
            Explore Portfolio Projects
            <ArrowRight className="size-4 ml-1" />
          </Button>
          <Button
            render={
              <a
                href="https://github.com/zerochirou"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            View Source on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
