import { toPng, toBlob } from "html-to-image";

export interface ImageExportOptions {
  fileName?: string;
  pixelRatio?: number;
}

export async function downloadStoryImage(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<string> {
  const { fileName = `tarot-story-${Date.now()}.png`, pixelRatio = 2 } = options;

  const dataUrl = await toPng(element, {
    quality: 0.95,
    pixelRatio,
    cacheBust: true,
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

export async function copyStoryImageToClipboard(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<boolean> {
  const { pixelRatio = 2 } = options;

  try {
    const blob = await toBlob(element, {
      quality: 0.95,
      pixelRatio,
      cacheBust: true,
    });

    if (!blob) return false;

    if (typeof ClipboardItem !== "undefined" && navigator?.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard copy failed, falling back to download", err);
  }

  return false;
}

export async function shareStoryImageFile(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<boolean> {
  const { fileName = `tarot-story-${Date.now()}.png`, pixelRatio = 2 } = options;

  try {
    const blob = await toBlob(element, {
      quality: 0.95,
      pixelRatio,
    });

    if (!blob) return false;

    const file = new File([blob], fileName, { type: "image/png" });

    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: "Tarot Reading Story",
        text: "Hasil pembacaan kartu tarot hari ini — Zerochirou Engine",
        files: [file],
      });
      return true;
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return true;
    }
    console.warn("Native file sharing failed", err);
  }

  return false;
}
