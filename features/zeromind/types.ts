export type CanvasTheme = "dark" | "light";

export interface MermaidPreset {
  id: string;
  title: string;
  category: "Architecture" | "Flowchart" | "Sequence" | "Systems" | "Database";
  description: string;
  code: string;
}

export interface DiagramConversionResult {
  success: boolean;
  elementCount: number;
  error?: string;
}

export type ExportFormat = "png" | "svg" | "json";

