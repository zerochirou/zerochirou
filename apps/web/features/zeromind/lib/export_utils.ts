import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

/**
 * Downloads a Blob as a file with the given filename.
 */
function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports current whiteboard scene as PNG or SVG.
 */
export async function exportCanvasAsImage(
  excalidrawAPI: ExcalidrawImperativeAPI,
  format: "png" | "svg",
  fileName = "zeromind-diagram"
): Promise<boolean> {
  if (!excalidrawAPI) return false;

  const elements = excalidrawAPI.getSceneElements();
  if (!elements || elements.length === 0) {
    return false;
  }

  const appState = excalidrawAPI.getAppState();
  const files = excalidrawAPI.getFiles();

  const { exportToBlob, exportToSvg } = await import("@excalidraw/excalidraw");

  if (format === "png") {
    const blob = await exportToBlob({
      elements,
      appState: {
        ...appState,
        exportWithDarkMode: appState.theme === "dark",
        exportBackground: true,
      },
      files,
      mimeType: "image/png",
    });

    if (blob) {
      triggerDownload(blob, `${fileName}.png`);
      return true;
    }
  } else if (format === "svg") {
    const svgElement = await exportToSvg({
      elements,
      appState: {
        ...appState,
        exportWithDarkMode: appState.theme === "dark",
        exportBackground: true,
      },
      files,
    });

    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      triggerDownload(blob, `${fileName}.svg`);
      return true;
    }
  }

  return false;
}

/**
 * Exports current whiteboard elements and metadata as a standard Excalidraw JSON file.
 */
export async function exportCanvasAsJson(
  excalidrawAPI: ExcalidrawImperativeAPI,
  fileName = "zeromind-scene"
): Promise<boolean> {
  if (!excalidrawAPI) return false;

  const elements = excalidrawAPI.getSceneElements();
  const appState = excalidrawAPI.getAppState();
  const files = excalidrawAPI.getFiles();

  const { serializeAsJSON } = await import("@excalidraw/excalidraw");
  const jsonString = serializeAsJSON(elements, appState, files, "local");
  const blob = new Blob([jsonString], { type: "application/json" });
  triggerDownload(blob, `${fileName}.excalidraw`);
  return true;
}

/**
 * Copies the whiteboard image directly to clipboard.
 */
export async function copyCanvasToClipboard(
  excalidrawAPI: ExcalidrawImperativeAPI
): Promise<boolean> {
  if (!excalidrawAPI) return false;

  const elements = excalidrawAPI.getSceneElements();
  if (!elements || elements.length === 0) return false;

  const appState = excalidrawAPI.getAppState();
  const files = excalidrawAPI.getFiles();

  try {
    const { exportToClipboard } = await import("@excalidraw/excalidraw");
    await exportToClipboard({
      elements,
      appState: {
        ...appState,
        exportWithDarkMode: appState.theme === "dark",
        exportBackground: true,
      },
      files,
      type: "png",
    });
    return true;
  } catch {
    return false;
  }
}

