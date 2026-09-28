"use client";

import Dither from "@/components/dither";

const DEFAULT_WAVE_COLOR: [number, number, number] = [
  0.4588235294117647, 0.4588235294117647, 0.4588235294117647,
];
const DEFAULT_BG_COLOR: [number, number, number] = [0, 0, 0];

export function DitherBackground() {
  return (
    <div className="pointer-events-none md:pointer-events-auto absolute inset-0 z-0 overflow-hidden">
      <Dither
        waveColor={DEFAULT_WAVE_COLOR}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.3}
        colorNum={4.1}
        waveAmplitude={0.3}
        waveFrequency={2}
        waveSpeed={0.1}
        backgroundColor={DEFAULT_BG_COLOR}
      />
    </div>
  );
}
