"use client";

import Dither from "@/components/dither";

export function DitherBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Dither
        waveColor={[
          0.39215686274509803, 0.39215686274509803, 0.39215686274509803,
        ]}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.3}
        colorNum={4}
        pixelSize={2}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.07}
      />
    </div>
  );
}
