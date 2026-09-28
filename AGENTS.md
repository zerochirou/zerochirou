<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Development Guidelines for AI Agents

Welcome to the **Zerochirou Portfolio** codebase. This document outlines project architecture, technical specifications, design system conventions, behavioral patterns, and strict constraints for AI coding agents.

---

## 1. Project Overview & Core Tech Stack

- **Project**: Interactive, high-performance personal portfolio showcasing work, tech stack, and startups (Zerochirou / Clickfor / Devinion / Zensekit).
- **Core Framework**: **Next.js 16.3.6** (App Router) + **React 19.2.8** + **TypeScript 5** (Strict mode).
- **Package Manager**: **pnpm@12.6.0** (strictly enforced; do not use `npm` or `yarn`).
- **Styling Engine**: **Tailwind CSS v4** (`@tailwindcss/postcss: ^4`, `@import "tailwindcss"` with `@theme inline` in `app/globals.css`), `tw-animate-css`, OKLCH design tokens.
- **Component Primitives**: shadcn/ui (`base-luma` style), built on **`@base-ui/react`** primitives (NOT Radix UI), `class-variance-authority`, `cn` helper.
- **Animation & 3D**:
  - **Motion v12**: `motion/react` (do not use `framer-motion`)
  - **GSAP 3**: `gsap`, `@gsap/react`, `ScrollTrigger`
  - **3D & Shaders**: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `ogl` (minimal WebGL library), `gl-matrix`, `maath`
- **Iconography**: `lucide-react`, `@hugeicons/react`, `@radix-ui/react-icons`.
- **Testing**: **Vitest** (`vitest`, `@testing-library/react`, `jsdom`).

---

## 2. Setup & Execution Commands

Always use `pnpm`:

```bash
# Install dependencies
pnpm install

# Start local development server (runs Next.js 16 on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting (ESLint 9 + Next.js core-web-vitals + TypeScript)
pnpm lint

# Run type checking
pnpm typecheck

# Run unit tests (Vitest)
pnpm test
pnpm test:watch
```

### Adding UI & Registry Components

The project is configured with shadcn and custom registries in `components.json`:
- `@react-bits`: `https://reactbits.dev/r/{name}.json`
- `@magicui`: `https://magicui.design/r/{name}`

```bash
pnpm dlx shadcn@latest add <component-name>
```

---

## 3. Component Architecture: Server vs. Client Components

### Server Components by Default (RSC)
Keep components as Server Components by default. Do not add `"use client"` unless interactive client capabilities are required.
- **Root Layout & Pages**: `app/layout.tsx` (Metadata, Viewport, Google Fonts, JSON-LD Schema), `app/page.tsx` (page layout composition).
- **Metadata Routes**: `app/sitemap.ts`, `app/robots.ts`.
- **Static & SSR Markup**: `features/commons/footer.tsx` (`MinimalFooter`), `components/ui/card.tsx`.
- **CSS-Only Animations**: `components/ui/marquee.tsx` (relies purely on CSS `@keyframes marquee` and custom properties, running with zero client JavaScript runtime).

### Client Components (`"use client"`)
Declare `"use client";` at the very top of the file (line 1) when any of the following triggers are present:
1. **React State & Lifecycle**: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`.
2. **Browser APIs & Window Observers**: `window.scrollY`, `window.scrollTo`, `window.addEventListener`, `document.getElementById`, `ResizeObserver`, `IntersectionObserver`.
3. **Motion Animations**: `motion/react` components (`motion.div`, `motion.span`, `AnimatePresence`).
4. **GSAP Animations**: Timelines or triggers using `gsap` or `ScrollTrigger`.
5. **WebGL / Canvas / Shaders**: Three.js (`@react-three/fiber`, `Canvas`, `useFrame`), OGL renderers (`ogl`), or direct `<canvas>` rendering contexts.
6. **Interactive Overlays & Portals**: Drawers, dialogs, or dropdown menus managing context and focus traps (`components/ui/drawer.tsx`).

### Dynamic Imports for WebGL / 3D Canvas
When embedding Three.js, React Three Fiber, or WebGL canvases (e.g., `Galaxy`, `Dither`), dynamically import them with `ssr: false` inside the client section to prevent server-side evaluation errors and hydration mismatch:
```tsx
const Galaxy = dynamic(() => import("@/components/galaxy"), {
  ssr: false,
});
```

---

## 4. UI & Styling Rules

### Tailwind CSS v4 Patterns
- **No `tailwind.config.js` or `tailwind.config.ts`**: Tailwind v4 is CSS-first. All configurations, `@theme inline` bindings, and animations reside directly in `app/globals.css`.
- **OKLCH Color Model**: Dark-first by default in `:root`. Never hardcode raw hex values in JSX (`#fff`, `#111`, `#000`). Always use theme tokens:
  - Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-secondary`, `bg-muted`
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-secondary-foreground`
  - Borders: `border-border`, `border-border/40`, `border-border/10`
  - Accents: `bg-primary`, `text-primary-foreground`, `bg-accent`
- **Tailwind v4 Variable Syntax**:
  - Direct CSS custom property binding with parentheses:
    `gap-(--gap)`, `py-(--card-spacing)`, `[--duration:40s]`, `[--gap:1rem]`.
  - Native color-mix syntax:
    `hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]`.
- **Border Radii**:
  - Built upon `--radius: 0.625rem`. Use `rounded-4xl` for outer cards, `rounded-3xl` for badges/pills, down to `rounded-lg`.

### Shadcn UI & Base UI Architecture
- **Powered by Base UI (`@base-ui/react`)**: The component primitives use `@base-ui/react`, **NOT** `@radix-ui/react`.
- **The `render` Prop (No `asChild`)**: Base UI delegates rendering via the `render` prop instead of Radix's `asChild`:
  ```tsx
  // ✅ Correct (Base UI pattern):
  <DrawerTrigger
    render={
      <Button variant="ghost" size="icon-lg" aria-label="Open menu" />
    }
  >
    <PanelLeft className="size-5" />
  </DrawerTrigger>

  // ❌ Anti-pattern (Do NOT use asChild in this codebase):
  <DrawerTrigger asChild>
    <Button ... />
  </DrawerTrigger>
  ```
- **Slot Convention (`data-slot`)**: All primitive components MUST expose their `data-slot="..."` attribute (e.g. `data-slot="button"`, `data-slot="card"`, `data-slot="drawer-content"`).
- **Class Variance Authority (`cva`)**: Multi-variant primitives must define variants using `cva` and export both the component and its variants function (e.g. `Button` + `buttonVariants`, `Badge` + `badgeVariants`).
- **Class Merging Helper (`cn`)**:
  - Always import from the project alias: **`import { cn } from "@/lib/utils"`**.
  - (Note: `lib/utils.ts` re-exports `cn` from the lightweight `cn` npm package).

### Layout, Scrolling & Stacking Interaction Rules
- **Horizontal Overflow**: `html`, `body`, and `<main>` use `overflow-x: clip;` (do **NOT** use `overflow: hidden;`).
- **CRITICAL Sticky Rule**: Never add `overflow: hidden` to parent containers or wrappers enclosing sticky elements. Doing so destroys CSS `position: sticky`. The sticky-stack effect in `AboutSection` relies on `sticky top-0 h-screen` layers inside a multi-viewport container (`min-h-[300vh]`).
- **Canvas Blend Overlays**: 3D and shader background canvases must have `pointer-events-none` and smoothly blend into following sections with a bottom gradient:
  ```tsx
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-64 z-[5] bg-gradient-to-t from-background to-transparent" />
  ```

---

## 5. Naming Conventions

### File & Folder Naming (STRICT)
- **STRICT `snake_case` for all files and directories**:
  - Components: `hero_section.tsx`, `about_section.tsx`, `menu_drawer.tsx`, `dia_text_reveal.tsx`, `glow_cursor.tsx`
  - Utilities & Configs: `utils.ts`, `vitest.config.mts`, `eslint.config.mjs`
  - Tests: `button.test.tsx`, `utils.test.ts`
  - Directories: `components/ui/`, `features/home/components/`, `features/commons/`
  - ❌ **NEVER USE**: `HeroSection.tsx`, `heroSection.tsx`, or `hero-section.tsx`.

### React Component Functions
- Use **`PascalCase`** for React components:
  `export function HeroSection({ heading, nameText }: HeroSectionProps)`
- Prefer named exports. Barrel export public components via `index.ts` within feature directories.

### TypeScript Types & Interfaces
- Use **`PascalCase`** with descriptive suffixes:
  - Props: `[ComponentName]Props` (e.g. `HeroSectionProps`, `NavbarProps`, `MarqueeProps`).
  - Domain Data: `MenuItem`, `ProjectItem`.
  - Context & Internal Config: `DrawerContextProps`, `GlowCursorConfig`.

### Custom Hooks
- Use **`useCamelCase`**: `useDrawer`, `useScroll`, `useAnimationFrame`.

### Constants & Globals
- Module-level constants and shader strings: `UPPER_SNAKE_CASE` (`DEFAULT_WAVE_COLOR`, `VERTEX_SHADER`, `MAX_POINTS`).
- Local static configuration lists: `camelCase` (`links`, `navigation`, `social`, `data`, `items`).

---

## 6. Project Directory Structure

```text
portofolio/
├── app/                              # Next.js App Router root
│   ├── favicon.ico
│   ├── globals.css                   # Tailwind v4 theme, OKLCH tokens, @theme inline
│   ├── layout.tsx                    # Root Server Layout (Metadata, Google Fonts, JSON-LD)
│   ├── page.tsx                      # Root Server Page assembling feature sections
│   ├── robots.ts                     # MetadataRoute.Robots
│   └── sitemap.ts                    # MetadataRoute.Sitemap
├── components/                       # Shared UI and creative visual effects
│   ├── ui/                           # Base UI primitives & design system tokens
│   │   ├── button.tsx                # Base UI + CVA button component
│   │   ├── card.tsx                  # Compound card primitive
│   │   ├── badge.tsx
│   │   ├── drawer.tsx                # Base UI Drawer
│   │   ├── marquee.tsx               # CSS-only marquee
│   │   └── terminal.tsx
│   ├── dither.tsx                    # WebGL / OGL shader effects
│   ├── galaxy.tsx
│   ├── glow_cursor.tsx
│   ├── scroll_float.tsx              # Standalone GSAP component
│   └── blur_text.tsx                 # Standalone Motion component
├── features/                         # Feature-sliced domain modules
│   ├── commons/                      # Universal cross-page structural components
│   │   ├── navbar.tsx                # Sticky blur navbar
│   │   └── footer.tsx                # MinimalFooter Server Component
│   └── home/                         # Landing page feature
│       └── components/               # Home-specific section compositions
│           ├── hero_section.tsx
│           ├── hero_intro.tsx
│           ├── dither_background.tsx
│           ├── about_section.tsx     # Sticky-stack scroll interaction
│           ├── stack_section.tsx     # Tech stack grid & interactive galaxy/3D cards
│           ├── projects_section.tsx  # Project portfolio cards & highlights
│           ├── menu_drawer.tsx
│           └── index.ts              # Feature public exports
├── lib/
│   └── utils.ts                      # Common utility exports (cn)
├── public/
│   └── assets/                       # Static media (3d/, icons/, images/)
├── tests/
│   ├── setup.ts                      # Vitest environment setup
│   └── unit/                         # Unit tests mirroring implementation
│       ├── button.test.tsx
│       ├── card.test.tsx
│       └── utils.test.ts
├── components.json                   # shadcn & registry config (base-luma)
├── eslint.config.mjs                 # Flat ESLint configuration
├── next.config.ts                    # Next.js runtime configuration
├── package.json
└── tsconfig.json                     # Strict TypeScript config (@/* path alias)
```

---

## 7. Lifecycle & WebGL Resource Cleanup

Whenever creating WebGL renderers (OGL/Three.js), `requestAnimationFrame` loops, GSAP timelines, or DOM listeners:
1. Always implement unmount cleanup in the `useEffect` return callback.
2. Cancel animation loops with `cancelAnimationFrame(frameId)`.
3. Disconnect `ResizeObserver` and `IntersectionObserver` instances.
4. Remove event listeners (`resize`, `pointermove`, `scroll`) using identical function references.
5. Dispose of geometries, materials, and call `program.remove()` or context loss methods to prevent memory leaks during page navigation or HMR.
6. Revert GSAP animations using `gsap.context()` or `ScrollTrigger.getAll().forEach(t => t.kill())`.

---

## 8. STRICT "DO NOT" Rules

1. ❌ **DO NOT remove or edit the `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` block at the top of this file.** It is re-generated by Next.js tooling.
2. ❌ **DO NOT use `PascalCase.tsx`, `kebab-case.tsx`, or `camelCase.tsx` for file names.** Every file must be `snake_case.tsx` or `snake_case.ts`.
3. ❌ **DO NOT use `npm` or `yarn` commands.** Only use `pnpm` (`packageManager: "pnpm@12.6.0"`).
4. ❌ **DO NOT import from `"framer-motion"`.** Motion v12 is installed; always import from `"motion/react"`.
5. ❌ **DO NOT use Radix UI's `asChild` prop on Shadcn components.** This codebase uses `@base-ui/react`; use `render={<Component />}`.
6. ❌ **DO NOT create `tailwind.config.js` or `tailwind.config.ts`.** Tailwind v4 uses CSS-first configuration via `@theme inline` in `app/globals.css`.
7. ❌ **DO NOT hardcode hex colors (e.g. `#111111`, `#fff`).** Always use Tailwind OKLCH theme tokens (`bg-background`, `text-foreground`, `border-border`, etc.).
8. ❌ **DO NOT set `overflow: hidden` on ancestors of `sticky` elements.** Use `overflow-x: clip;` on `html`, `body`, and `<main>`.
9. ❌ **DO NOT import `cn` directly from `"cn"` in feature or application code.** Standardize on `import { cn } from "@/lib/utils"`.
10. ❌ **DO NOT omit unmount cleanup in canvas or animation hooks.** Always clean up listeners, observers, geometries, and RAF handles in `useEffect`.
11. ❌ **DO NOT mutate or bypass TypeScript strict checks without explicit justification.**
12. ❌ **DO NOT introduce Pages Router patterns (e.g. `pages/` directory, `getStaticProps`, `getServerSideProps`).** This repository is strictly on Next.js 16 App Router.
