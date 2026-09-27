"use client";

import Dither from "@/components/dither";

export function DitherBackground() {
  return (
    <div className="pointer-events-none md:pointer-events-auto absolute inset-0 z-0 overflow-hidden">
      <Dither
        waveColor={[0.4588235294117647, 0.4588235294117647, 0.4588235294117647]}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.3}
        colorNum={4.1}
        waveAmplitude={0.3}
        waveFrequency={2}
        waveSpeed={0.1}
        backgroundColor={[0, 0, 0]}
      />
    </div>
  );
}
