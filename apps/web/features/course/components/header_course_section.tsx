import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TextAnimate } from "@/components/ui/text_animate";

export function HeaderCourseSection() {
  return (
    <header className="flex items-center justify-center flex-col px-4 sm:px-6 text-center pt-2 sm:pt-6 pb-2">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-2 gap-y-1.5 tracking-tight font-normal">
        <span className="flex items-center gap-2 sm:gap-3">
          <span>Open</span>
          <span>Source</span>
        </span>
        <DiaTextReveal
          repeat
          repeatDelay={3}
          text={["Subjects.", "Skills.", "Journey."]}
          colors={["#FFED29", "#0095fe"]}
        />
      </h1>
      <TextAnimate
        animation="blurInUp"
        by="character"
        once
        className="w-full max-w-2xl text-xs sm:text-base md:text-lg mt-3 sm:mt-4 text-muted-foreground/80 text-center px-2 sm:px-4 leading-relaxed"
      >
        Sebuah pustaka sumber terbuka untuk pembelajaran berkelanjutan. Dirilis secara publik untuk siapa saja.
      </TextAnimate>
    </header>
  );
}
