import ScrollFloat from "@/components/scroll_float";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";

export function ManifestoContent() {
  return (
    <article className="px-4 max-w-3xl mx-auto w-full flex flex-col gap-16">
      {/* Chapter 1 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-newsreader text-muted-foreground">
            THE LIMITS OF STATISTICAL MODELS
          </span>
        </div>

        <DiaTextReveal
          repeatDelay={3}
          className="text-2xl font-newsreader sm:text-3xl tracking-tight text-foreground"
          text={"Infinite Context Still Lacks Consciousness"}
        />

        <div className="flex flex-col gap-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            We are living through a wave of large language models. We observe
            context windows spanning millions of tokens, code generated in
            fractions of a second, and models that imitate every programming
            style on the internet. Yet one fundamental truth remains: artificial
            intelligence operates on statistical probability. It predicts the
            next token based on what was most frequent in its training data.
          </p>
          <p>
            A model never experiences eye strain when looking at an overly
            bright interface late at night. It never feels the frustration of an
            awkward touch target on a mobile screen. Nor does it possess taste:
            the quiet judgment born from years of discipline, living experience,
            and the deliberate pursuit of simplicity.
          </p>
        </div>
      </section>

      {/* Chapter 2 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-newsreader text-muted-foreground">
            THE CRISIS OF VIBE-CODING
          </span>
        </div>

        <DiaTextReveal
          repeatDelay={3}
          className="text-2xl font-newsreader sm:text-3xl tracking-tight text-foreground"
          text={"The Risk of Vibe-Coding: Speed Without Accountability"}
        />

        <div className="flex flex-col gap-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            The vibe-coding trend promotes an illusion: that anyone can
            construct world-class software simply by typing loose prompts and
            accepting whatever the model outputs without reading it. This
            approach produces software that appears functional on the surface,
            but is fragile and hollow underneath.
          </p>
          <p>
            When a developer surrenders decisions to a generative engine, they
            surrender their understanding of the system. The outcome is
            redundant dependencies, memory leaks in animation loops, color
            pairings that fail accessibility guidelines, and generic layouts
            devoid of character.
          </p>
          <p>
            Rejecting vibe-coding is not about resisting modern tools. It is
            about honoring the dignity of the craft: ensuring that every
            function, every CSS rule, and every error boundary is thoroughly
            understood by the person who authored it.
          </p>
        </div>
      </section>

      {/* Chapter 3 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-newsreader text-muted-foreground">
            SUB-PIXEL CRAFTSMANSHIP
          </span>
        </div>

        <DiaTextReveal
          repeatDelay={3}
          className="text-2xl font-newsreader sm:text-3xl tracking-tight text-foreground"
          text={"Considered Details and Sub-Pixel Harmony"}
        />
        <div className="flex flex-col gap-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            At Apple and in enduring design studios, there is a fundamental
            belief: the hidden details deserve the exact same dedication as the
            front face. That principle applies to the back of a wooden cabinet,
            the internal architecture of a unibody enclosure, and memory
            allocation in an operating system kernel.
          </p>
          <p>
            Across this website, every element follows that standard. We
            selected a dark OKLCH palette calibrated to rest the viewer&apos;s
            eyes. We calculated corner radii on a strict proportional scale. We
            authored WebGL shaders with explicit resource disposal on unmount,
            keeping the browser responsive without memory leaks.
          </p>
          <p>
            These nuances are never prioritized by instant code generators. They
            originate only from people who take genuine pride in their
            profession and treat their work as an intentional discipline.
          </p>
        </div>
      </section>

      {/* Chapter 4 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-newsreader text-muted-foreground">
            EMPATHY FOR THE VIEWER
          </span>
        </div>

        <DiaTextReveal
          repeatDelay={3}
          className="text-2xl font-newsreader sm:text-3xl tracking-tight text-foreground"
          text={"Full Consciousness of the Human Behind the Screen"}
        />

        <div className="flex flex-col gap-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          <p>
            This is the clearest dividing line between someone who merely
            outputs code and an intentional software craftsman:{" "}
            <strong>
              the complete awareness that a real person is sitting on the other
              side of the glass.
            </strong>
          </p>
          <p>
            When we build a system or design a portfolio page, we recognize that
            the person experiencing it is a client with exacting expectations, a
            future collaborator sharing their valuable time, or a user seeking
            clarity without visual clutter.
          </p>
          <p>
            Building with care means respecting their attention. We do not
            burden devices with run-away animations that drain battery life. We
            do not obscure navigation behind confusing patterns. We present
            information honestly, cleanly, and respectfully.
          </p>
          <p>
            Technology will continue to advance, and models will grow faster.
            But human warmth, honest intent, and genuine empathy toward others
            will always remain the true soul of meaningful software.
          </p>
        </div>
      </section>
    </article>
  );
}
