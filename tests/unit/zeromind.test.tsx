import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  MERMAID_PRESETS,
  parseMermaidCode,
  exportCanvasAsImage,
  exportCanvasAsJson,
  copyCanvasToClipboard,
  ZeromindToolbar,
  MermaidDialog,
} from "@/features/zeromind";

describe("Zeromind - Template Presets", () => {
  it("provides valid presets with non-empty code and categories", () => {
    expect(MERMAID_PRESETS.length).toBeGreaterThan(0);
    MERMAID_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.category).toBeTruthy();
      expect(preset.code.trim().length).toBeGreaterThan(10);
    });
  });

  it("contains architecture and sequence presets", () => {
    const categories = MERMAID_PRESETS.map((p) => p.category);
    expect(categories).toContain("Architecture");
    expect(categories).toContain("Sequence");
  });
});

describe("Zeromind - Mermaid Parser", () => {
  it("returns error for empty mermaid code", async () => {
    const result = await parseMermaidCode("   ");
    expect(result.success).toBe(false);
    expect(result.error).toContain("cannot be empty");
  });

  it("handles invalid syntax gracefully without throwing uncaught exceptions", async () => {
    const result = await parseMermaidCode("this is completely invalid mermaid syntax 12345");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  }, 15000);

  it("successfully parses valid flowchart into elements", async () => {
    const validFlowchart = `flowchart TD\n  Start[Start Node] --> End[Finish Node]`;
    const result = await parseMermaidCode(validFlowchart);
    expect(result.success).toBe(true);
    expect(result.elements.length).toBeGreaterThan(0);
  });
});

describe("Zeromind - Export Utilities", () => {
  it("returns false if excalidraw API has no elements", async () => {
    const mockApi = {
      getSceneElements: vi.fn().mockReturnValue([]),
      getAppState: vi.fn().mockReturnValue({ theme: "dark" }),
      getFiles: vi.fn().mockReturnValue({}),
    } as unknown as Parameters<typeof exportCanvasAsImage>[0];

    const result = await exportCanvasAsImage(mockApi, "png");
    expect(result).toBe(false);
  });

  it("returns false if API reference is null", async () => {
    const nullApi = null as unknown as Parameters<typeof exportCanvasAsJson>[0];
    const result = await exportCanvasAsJson(nullApi);
    expect(result).toBe(false);

    const clipboardResult = await copyCanvasToClipboard(nullApi);
    expect(clipboardResult).toBe(false);
  });
});

describe("Zeromind - Toolbar Component", () => {
  const defaultProps = {
    theme: "dark" as const,
    onToggleTheme: vi.fn(),
    onOpenMermaidDialog: vi.fn(),
    onSelectPreset: vi.fn(),
    onExport: vi.fn(),
    onCopyToClipboard: vi.fn(),
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onZoomToFit: vi.fn(),
    onClearCanvas: vi.fn(),
  };

  it("renders branding and action buttons", () => {
    render(<ZeromindToolbar {...defaultProps} />);
    expect(screen.getByText("Zeromind")).toBeDefined();
    expect(screen.getByText("Mermaid")).toBeDefined();
  });

  it("triggers onOpenMermaidDialog when Mermaid button is clicked", () => {
    render(<ZeromindToolbar {...defaultProps} />);
    const mermaidBtn = screen.getByRole("button", { name: /Mermaid/i });
    fireEvent.click(mermaidBtn);
    expect(defaultProps.onOpenMermaidDialog).toHaveBeenCalledTimes(1);
  });

  it("triggers onToggleTheme when theme button is clicked", () => {
    render(<ZeromindToolbar {...defaultProps} />);
    const themeBtn = screen.getByRole("button", { name: /Switch to light mode/i });
    fireEvent.click(themeBtn);
    expect(defaultProps.onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("triggers onClearCanvas when trash button is clicked", () => {
    render(<ZeromindToolbar {...defaultProps} />);
    const clearBtn = screen.getByRole("button", { name: /Clear whiteboard/i });
    fireEvent.click(clearBtn);
    expect(defaultProps.onClearCanvas).toHaveBeenCalledTimes(1);
  });

  it("opens presets dropdown menu and renders menu labels without context error", async () => {
    render(<ZeromindToolbar {...defaultProps} />);
    const presetsTrigger = screen.getByRole("button", { name: /Diagram Templates/i });
    fireEvent.click(presetsTrigger);
    await waitFor(() => {
      expect(screen.getByText("Insert Diagram Preset")).toBeDefined();
    });
  });
});

describe("Zeromind - MermaidDialog Component", () => {
  const dialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    onInsertElements: vi.fn(),
  };

  it("renders dialog with presets and textarea when open is true", () => {
    render(<MermaidDialog {...dialogProps} />);
    expect(screen.getByText("Mermaid to Excalidraw Generator")).toBeDefined();
    expect(screen.getByText("Insert to Whiteboard")).toBeDefined();
    expect(screen.getByText("Next.js App Router & Edge Lifecycle")).toBeDefined();
  });

  it("updates code when a preset button is clicked", () => {
    render(<MermaidDialog {...dialogProps} />);
    const presetBtn = screen.getByRole("button", { name: "OAuth 2.0 PKCE Flow" });
    fireEvent.click(presetBtn);

    const textarea = screen.getByPlaceholderText(/flowchart TD/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("sequenceDiagram");
  });

  it("shows error alert if user tries to convert empty code", async () => {
    render(<MermaidDialog {...dialogProps} />);
    const textarea = screen.getByPlaceholderText(/flowchart TD/i);
    fireEvent.change(textarea, { target: { value: "   " } });

    const insertBtn = screen.getByRole("button", { name: "Insert to Whiteboard" });
    fireEvent.click(insertBtn);

    await waitFor(() => {
      expect(screen.getByText("Please enter valid Mermaid diagram syntax.")).toBeDefined();
    });
  });
});
