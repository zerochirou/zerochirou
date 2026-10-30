import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface ParseResult {
  success: boolean;
  elements: readonly ExcalidrawElement[];
  files?: Record<string, unknown>;
  error?: string;
}

/**
 * Safely parses Mermaid diagram definitions into ready-to-render Excalidraw elements.
 * Runs strictly client-side to prevent SSR DOM exceptions.
 */
export async function parseMermaidCode(mermaidCode: string): Promise<ParseResult> {
  if (typeof window === "undefined") {
    return {
      success: false,
      elements: [],
      error: "Mermaid parser must be executed within a browser environment.",
    };
  }

  const trimmed = mermaidCode.trim();
  if (!trimmed) {
    return {
      success: false,
      elements: [],
      error: "Mermaid diagram code cannot be empty.",
    };
  }

  try {
    // Dynamic imports eliminate bundle waterfalls and prevent SSR evaluation
    const [mermaidModule, excalidrawModule] = await Promise.all([
      import("@excalidraw/mermaid-to-excalidraw"),
      import("@excalidraw/excalidraw"),
    ]);

    const { parseMermaidToExcalidraw } = mermaidModule;
    const { convertToExcalidrawElements } = excalidrawModule;

    const parseResponse = await parseMermaidToExcalidraw(trimmed, {
      themeVariables: {
        fontSize: "16px",
      },
    });

    if (!parseResponse || !parseResponse.elements) {
      return {
        success: false,
        elements: [],
        error: "Failed to generate diagram elements from the provided Mermaid definition.",
      };
    }

    const converted = convertToExcalidrawElements(parseResponse.elements);

    return {
      success: true,
      elements: converted,
      files: parseResponse.files as Record<string, unknown> | undefined,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      elements: [],
      error: message,
    };
  }
}

