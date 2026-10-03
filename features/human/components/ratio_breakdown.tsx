import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Layers, 
  Cpu, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Terminal,
  Compass
} from "lucide-react";

export function RatioBreakdown() {
  return (
    <section className="py-16 sm:py-24 px-4 max-w-4xl mx-auto w-full flex flex-col gap-12 border-b border-border/40">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <Badge variant="outline" className="w-fit mx-auto sm:mx-0 font-mono text-xs">
          PROCESS TRANSPARENCY
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          The Division of Labor: Where Machine Ends and Soul Begins
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          An honest breakdown of the boundary between artificial intelligence and human craftsmanship across the architecture, interface, and visual experience of this website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 90% Human Card */}
        <Card className="border-border/80 bg-card/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-4xl font-bold font-mono text-foreground/10">90%</span>
          </div>
          
          <CardHeader className="gap-2">
            <div className="flex items-center gap-2 text-foreground font-mono text-xs uppercase tracking-wider">
              <Heart className="size-4 text-foreground" />
              Human Mind &amp; Hand
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Core, Taste, and Accountability
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary text-foreground shrink-0 mt-0.5">
                <Compass className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Design Intuition and Spatial Rhythm</strong>
                <span>Determining padding increments, visual balance, harmonious border radii, and typographic scale so the reader never experiences eye strain.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary text-foreground shrink-0 mt-0.5">
                <Layers className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Architecture and Technical Foundations</strong>
                <span>Composing modular Next.js App Router patterns, high-performance WebGL integrations, zero-cost memory safety in Rust, and resilient data structures.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary text-foreground shrink-0 mt-0.5">
                <Eye className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">User Respect and Genuine Accessibility</strong>
                <span>Hand-testing OKLCH color contrast pairs, ensuring keyboard navigation operates without flaws, and crafting micro-interactions centered on real human comfort.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary text-foreground shrink-0 mt-0.5">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Ownership and Authentic Narrative</strong>
                <span>Articulating ideas, philosophical viewpoints, and case studies from lived experience, never summarizing external articles through text generators.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 10% AI Card */}
        <Card className="border-border/40 bg-card/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-4xl font-bold font-mono text-muted-foreground/10">10%</span>
          </div>

          <CardHeader className="gap-2">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase tracking-wider">
              <Cpu className="size-4 text-muted-foreground" />
              Artificial Intelligence (Mechanical Tool)
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Mechanical Automation &amp; Scaffolding
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary/50 text-muted-foreground shrink-0 mt-0.5">
                <Terminal className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Repetitive Boilerplate Generation</strong>
                <span>Generating TypeScript type templates, common interface definitions, and structured JSON-LD schemas swiftly.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary/50 text-muted-foreground shrink-0 mt-0.5">
                <Sparkles className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Fast Documentation &amp; Syntax Verification</strong>
                <span>Verifying CSS utility helpers, WebGL shader math formulas, and checking syntax without switching across dozens of search tabs.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-secondary/50 text-muted-foreground shrink-0 mt-0.5">
                <Cpu className="size-4" />
              </div>
              <div>
                <strong className="text-foreground block font-medium">Initial Test File Scaffolding</strong>
                <span>Setting up basic unit test structures in Vitest before comprehensive test suites are authored by hand.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/20 mt-2">
              <p className="text-xs text-muted-foreground italic font-newsreader leading-relaxed">
                Note: AI is utilized strictly as a mechanical instrument, much like a calculator or a hand plane in a woodworker&apos;s shop. AI is never granted authority over taste, aesthetics, or core architectural decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
