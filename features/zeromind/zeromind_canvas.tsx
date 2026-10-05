"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type { CanvasTheme } from "./types";
import { Spinner } from "@/components/ui/spinner";

function CanvasLoadingSkeleton() {
  return (
    <div
      data-slot="zeromind-loading"
      className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-background text-foreground"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-card border border-border/40 shadow-sm">
        <Spinner className="size-6 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-heading text-sm font-medium">Initializing Zeromind</span>
        <span className="text-xs text-muted-foreground">Preparing canvas & shader engine...</span>
      </div>
    </div>
  );
}

// Dynamically load Excalidraw with ssr: false to avoid DOM/Window errors in Next.js App Router
const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  {
    ssr: false,
    loading: () => <CanvasLoadingSkeleton />,
  }
);

export interface ZeromindCanvasProps {
  theme: CanvasTheme;
  initialData?: ExcalidrawInitialDataState | null;
  onApiReady: (api: ExcalidrawImperativeAPI) => void;
  onChange?: (elements: readonly unknown[], appState: unknown) => void;
  isGridMode?: boolean;
}

export function ZeromindCanvas({
  theme,
  initialData,
  onApiReady,
  onChange,
  isGridMode = true,
}: ZeromindCanvasProps) {
  return (
    <div
      data-slot="zeromind-canvas-container"
      className="relative h-full w-full overflow-hidden bg-background"
    >
      <Excalidraw
        excalidrawAPI={onApiReady}
        theme={theme}
        gridModeEnabled={isGridMode}
        initialData={initialData || undefined}
        onChange={onChange}
        UIOptions={{
          canvasActions: {
            saveAsImage: true,
            toggleTheme: true,
            loadScene: true,
            export: {
              saveFileToDisk: true,
            },
          },
        }}
      />
    </div>
  );
}

