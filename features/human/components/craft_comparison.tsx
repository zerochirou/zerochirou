import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { CRAFT_COMPARISONS } from "../constants";
import type { ComparisonRow } from "../types";

export type { ComparisonRow };

export function CraftComparison() {
  return (
    <section className="py-16 sm:py-24 px-4 max-w-4xl mx-auto w-full flex flex-col gap-10 border-b border-border/40">
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <Badge variant="outline" className="w-fit mx-auto sm:mx-0 font-mono text-xs">
          CORE COMPARISON
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Vibe-Coding vs. Intentional Craftsmanship
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          A clear comparison between instant generation without understanding and conscious software engineering discipline.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {CRAFT_COMPARISONS.map((row, index) => (
          <Card key={index} className="p-0 overflow-hidden border-border/60 bg-card/40">
            <div className="bg-secondary/40 px-6 py-3 border-b border-border/40 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold">
                {row.aspect}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Principle 0{index + 1}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
              <div className="p-6 flex items-start gap-3 bg-destructive/[0.02]">
                <div className="p-1.5 rounded-full bg-destructive/10 text-destructive shrink-0 mt-0.5">
                  <X className="size-3.5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-medium text-destructive">
                    Vibe-Coding Approach
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {row.vibeCoding}
                  </p>
                </div>
              </div>

              <div className="p-6 flex items-start gap-3 bg-foreground/[0.02]">
                <div className="p-1.5 rounded-full bg-foreground/10 text-foreground shrink-0 mt-0.5">
                  <Check className="size-3.5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-medium text-foreground">
                    Intentional Craftsman
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                    {row.intentionalCraft}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
