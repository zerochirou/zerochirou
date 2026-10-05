import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
  unobserve = vi.fn();
}

window.IntersectionObserver = IntersectionObserverMock;
global.IntersectionObserver = IntersectionObserverMock;

// Mock ResizeObserver
class ResizeObserverMock implements ResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}

window.ResizeObserver = ResizeObserverMock;
global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Polyfill CSSStyleSheet for Mermaid rendering in jsdom
if (typeof window !== "undefined") {
  if (window.CSSStyleSheet && typeof (global as unknown as { CSSStyleSheet?: unknown }).CSSStyleSheet === "undefined") {
    (global as unknown as { CSSStyleSheet: unknown }).CSSStyleSheet = window.CSSStyleSheet;
  }
  const svgProto = window.SVGElement?.prototype as unknown as { getBBox?: () => unknown };
  if (svgProto && !svgProto.getBBox) {
    svgProto.getBBox = function () {
      return {
        x: 0,
        y: 0,
        width: 100,
        height: 40,
        bottom: 40,
        left: 0,
        right: 100,
        top: 0,
        toJSON: () => {},
      };
    };
  }
  if (window.HTMLCanvasElement) {
    const originalGetContext = window.HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error Patching 2d context for jsdom
    window.HTMLCanvasElement.prototype.getContext = function (type: string) {
      const ctx = originalGetContext.call(this, type);
      if (!ctx && type === "2d") {
        return {
          fillStyle: "",
          strokeStyle: "",
          filter: "none",
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          getImageData: vi.fn(),
          putImageData: vi.fn(),
          createImageData: vi.fn(),
          setTransform: vi.fn(),
          drawImage: vi.fn(),
          save: vi.fn(),
          fillText: vi.fn(),
          restore: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          closePath: vi.fn(),
          stroke: vi.fn(),
          translate: vi.fn(),
          scale: vi.fn(),
          rotate: vi.fn(),
          arc: vi.fn(),
          fill: vi.fn(),
          measureText: vi.fn().mockReturnValue({ width: 100, height: 20 }),
          transform: vi.fn(),
          rect: vi.fn(),
          clip: vi.fn(),
        };
      }
      return ctx;
    };
  }

  if (typeof window.FontFace === "undefined") {
    class FontFaceMock {
      family: string;
      source: string | ArrayBuffer;
      status: string = "loaded";
      constructor(family: string, source: string | ArrayBuffer) {
        this.family = family;
        this.source = source;
      }
      load() {
        return Promise.resolve(this);
      }
    }
    // @ts-expect-error Mock FontFace for jsdom
    window.FontFace = FontFaceMock;
    // @ts-expect-error Mock FontFace on global
    global.FontFace = FontFaceMock;
  }
}

