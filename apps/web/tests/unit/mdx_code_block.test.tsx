import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MdxCodeBlock, MdxPre, MdxCode } from "@/components/ui/mdx_code_block";

// Mock Shiki highlighter to run fast in jsdom
vi.mock("@/lib/highlighter", () => ({
  loadHighlighter: vi.fn().mockResolvedValue({
    highlight: (code: string) => ({
      lines: [[code]],
      state: undefined,
    }),
  }),
  highlightCode: vi.fn().mockResolvedValue(["code"]),
}));

describe("MDX CodeBlock Components", () => {
  it("renders MdxCodeBlock with language title and copy button", () => {
    render(<MdxCodeBlock code='console.log("hello world");' language="javascript" />);

    expect(screen.getByText("javascript")).toBeDefined();
    expect(screen.getByText('console.log("hello world");')).toBeDefined();
    expect(screen.getByRole("button", { name: /Copy/i })).toBeDefined();
  });

  it("renders MdxPre extracting language and code from nested code element", () => {
    render(
      <MdxPre>
        <code className="language-python">{"def greet():\n    return 'hi'"}</code>
      </MdxPre>
    );

    expect(screen.getByText("python")).toBeDefined();
    expect(screen.getByText(/def greet/)).toBeDefined();
  });

  it("renders MdxCode as inline code when it has no language block format", () => {
    render(<MdxCode>npm install</MdxCode>);

    const codeEl = screen.getByText("npm install");
    expect(codeEl).toBeDefined();
    expect(codeEl.tagName.toLowerCase()).toBe("code");
  });
});
