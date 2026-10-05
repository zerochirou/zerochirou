"use client";

import * as React from "react";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { ZeromindCanvas } from "./zeromind_canvas";
import type { CanvasTheme } from "./types";

const STORAGE_KEY = "zeromind_canvas_data_v1";

export function ZeromindView() {
  const [theme] = React.useState<CanvasTheme>("dark");
  const [isGridMode] = React.useState<boolean>(true);
  const [initialData] = React.useState<ExcalidrawInitialDataState | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.elements) && parsed.elements.length > 0) {
          return {
            elements: parsed.elements,
            appState: parsed.appState || {},
          };
        }
      }
    } catch {
      // Fallback silently if corrupt or unavailable
    }
    return null;
  });

  const apiRef = React.useRef<ExcalidrawImperativeAPI | null>(null);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cleanup pending debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleApiReady = React.useCallback((api: ExcalidrawImperativeAPI) => {
    apiRef.current = api;
  }, []);

  // Debounced auto-save to localStorage
  const handleChange = React.useCallback(
    (elements: readonly unknown[], appState: unknown) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        try {
          const payload = JSON.stringify({
            elements,
            appState: {
              ...(typeof appState === "object" && appState !== null ? appState : {}),
              collaborators: undefined,
            },
          });
          localStorage.setItem(STORAGE_KEY, payload);
        } catch {
          // Quota exceeded or private browsing
        }
      }, 1000);
    },
    []
  );

  return (
    <main className="relative h-full w-full overflow-hidden bg-background">
      {/* Excalidraw Whiteboard Canvas */}
      <ZeromindCanvas
        theme={theme}
        initialData={initialData}
        onApiReady={handleApiReady}
        onChange={handleChange}
        isGridMode={isGridMode}
      />
    </main>
  );
}

