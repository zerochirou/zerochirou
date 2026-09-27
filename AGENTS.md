<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Development Guidelines for AI Agents

Welcome to the **Zerochirou Portfolio** codebase. This document outlines project architecture, technical specifications, design system conventions, behavioral patterns, and strict constraints for AI coding agents.

---

## 1. Project Overview

- **Project**: Interactive, high-performance personal portfolio showcasing work, tech stack, and startups (Zerochirou / Clickfor / Devinion / Zensekit).
- **Core Framework**: **Next.js 16.3.6** (App Router) + **React 19.2.8** + **TypeScript 5**.
- **Package Manager**: **pnpm@12.6.0** (strictly enforced; do not use `npm` or `yarn`).
- **Styling**: **Tailwind CSS v4** (`@tailwindcss/postcss: ^4`, `@import "tailwindcss"` with `@theme inline` in `app/globals.css`), `tw-animate-css`, OKLCH theme tokens.
- **Component Primitives**: shadcn/ui (`base-luma` style), `@base-ui/react` primitives, `class-variance-authority`, `cn` helper.
- **Animation & 3D**:
  - **Motion v12**: `motion/react`
  - **GSAP**: `gsap`, `@gsap/react`
  - **3D & Shaders**: `three`, `@react-three/fiber`, `@react-three/drei`, `ogl` (minimal WebGL library), `gl-matrix`, `maath`
- **Iconography**: `lucide-react`, `@hugeicons/react`, `@radix-ui/react-icons`.

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
```

### Adding UI & Registry Components

The project is configured with shadcn and custom registries in `components.json`:
- `@react-bits`: `https://reactbits.dev/r/{name}.json`
- `@magicui`: `https://magicui.design/r/{name}`

```bash
pnpm dlx shadcn@latest add <component-name>
```

---

## 3. Project Structure & Architecture

```text
portofolio/
├── app/                              # Next.js App Router root
│   ├── favicon.ico
│   ├── globals.css                   # Tailwind v4 theme, OKLCH palette, keyframes
│   ├── layout.tsx                    # Root layout (Geist, Geist Mono, Oxanium fonts)
│   └── page.tsx                      # Main landing page assembling features
├── components/                       # Shared UI and creative animation components
│   ├── ui/                           # Base UI primitives (button, card, badge, etc.)
│   │   ├── button.tsx                # Base-UI + CVA button component
│   │   ├── card.tsx
│   │   ├── dia_text_reveal.tsx
│   │   └── terminal.tsx
│   ├── dither.tsx                    # WebGL / OGL shader effects
│   ├── galaxy.tsx
│   ├── glow_cursor.tsx
│   ├── scroll_float.tsx
│   └── ...                           # Visual / creative animation components
├── features/                         # Domain / Feature-sliced modules
│   ├── commons/                      # Universal features across pages
│   │   ├── navbar.tsx                # Sticky blur navbar
│   │   └── footer.tsx                # Minimal footer
│   └── home/                         # Landing page feature
│       └── components/               # Home-specific sections
│           ├── hero_section.tsx
│           ├── hero_intro.tsx
│           ├── dither_background.tsx
│           ├── about_section.tsx     # Sticky-stack scroll interaction
│           ├── stack_section.tsx     # Tech stack & interactive galaxy/3D cards
│           ├── projects_section.tsx  # Project cards & highlights
│           ├── menu_drawer.tsx
│           └── index.ts              # Feature public exports
├── lib/
│   └── utils.ts                      # Common utility exports (cn)
├── public/
│   └── assets/                       # Static media (3d/, icons/, images/)
├── components.json                   # shadcn & registry config
├── eslint.config.mjs                 # Flat ESLint configuration
├── next.config.ts                    # Next.js runtime configuration
├── package.json
└── tsconfig.json                     # Strict TypeScript config (@/* path alias)
```

### Feature-Driven Organization Guidelines

1. **Features (`features/`)**:
   - Encapsulate page-specific UI into feature modules (e.g. `features/home/components/`).
   - Shared structural components belong in `features/commons/` (e.g., `navbar.tsx`, `footer.tsx`).
   - Group related subcomponents and re-export them cleanly via `index.ts` within the feature directory.
2. **Components (`components/`)**:
   - `components/ui/`: Strictly reusable, headless, or primitive UI components (buttons, cards, dialogs, drawers).
   - `components/`: Standalone creative visual effects, WebGL canvases, GSAP/Motion animations (e.g. `galaxy.tsx`, `dither.tsx`, `glow_cursor.tsx`).

---

## 4. Coding Standards & Conventions

### File & Component Naming

- **Files & Folders**: **STRICT `snake_case.tsx` / `snake_case.ts`**.
  - ✅ `hero_section.tsx`, `about_section.tsx`, `dia_text_reveal.tsx`, `glow_cursor.tsx`
  - ❌ `HeroSection.tsx`, `heroSection.tsx`, `hero-section.tsx`
- **React Components**: Use **`PascalCase`** for component functions and TypeScript interfaces/types:
  - `export function HeroSection({ ... }: HeroSectionProps)`
- **Hooks**: Use **`useCamelCase`** (e.g. `useScroll`, `useAnimationFrame`).

### Import Aliases & Libraries

- Always use `@/` path alias:
  ```tsx
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import { HeroSection } from "@/features/home/components";
  ```
- **Motion**: ALWAYS import from `"motion/react"` (Motion v12), NOT from `"framer-motion"`:
  ```tsx
  import { motion, AnimatePresence } from "motion/react";
  ```
- **Primitives**: Base components use `@base-ui/react`:
  ```tsx
  import { Button as ButtonPrimitive } from "@base-ui/react/button";
  ```
- **Class Merging**: Always use `cn(...)` for merging conditional Tailwind classes.

---

## 5. Design System & Styling Rules

### Aesthetic & Theme

- **Style**: Dark-theme first, futuristic, tech-minimalist, cyberpunk accents.
- **Palette**: Defined in `app/globals.css` using the **OKLCH** color model:
  - Background: `oklch(0.145 0 0)` (Dark base by default in `:root`)
  - Foreground: `oklch(0.985 0 0)`
  - Card: `oklch(0.205 0 0)`
  - Primary: `oklch(0.922 0 0)`
  - Muted: `oklch(0.269 0 0)` / `oklch(0.708 0 0)`
  - Borders: `oklch(1 0 0 / 10%)`
- **Radii**: Built on `--radius: 0.625rem`:
  - `rounded-4xl` (~1.625rem), `rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-lg`.
- **Typography**:
  - `font-sans` (Geist Sans)
  - `font-mono` (Geist Mono)
  - `font-sans-oxanium` (`Oxanium` variable for futuristic tech headings)

### Layout & Scrolling Rules

- **Overflow Handling**:
  - `html` and `body` use `overflow-x: clip;` (NOT `overflow: hidden;`).
  - **CRITICAL**: Do NOT add `overflow: hidden` to parent containers or wrappers enclosing sticky sections (such as `AboutSection`'s sticky-scroll stacking effect). Doing so breaks `position: sticky`.
- **Transitions & Visual Blend**:
  - 3D/Shader canvases should have `pointer-events-none` when acting as backgrounds.
  - Blend canvas bottoms into following sections with gradient overlays:
    ```tsx
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-64 z-[5] bg-gradient-to-t from-background to-transparent" />
    ```

---

## 6. Behaviour & Performance Rules

### Client vs Server Components

- App Router pages (`app/page.tsx`, `app/layout.tsx`) are Server Components by default.
- Any component that uses state (`useState`), effects (`useEffect`), references (`useRef`), DOM listeners (`window.addEventListener`), GSAP, Three.js, OGL, or Motion **MUST** declare `"use client";` at the top of the file.

### WebGL & Animation Lifecycle Cleanups

Whenever creating WebGL renderers (OGL/Three.js), requestAnimationFrames, or GSAP timelines:
1. Always implement unmount cleanup in the `useEffect` return callback.
2. Cancel `cancelAnimationFrame(frameId)`.
3. Remove event listeners (`resize`, `pointermove`, `scroll`) using identical function references.
4. Dispose of geometries, materials, textures, and WebGL contexts where supported to prevent memory leaks during page navigation or HMR.

---

## 7. STRICT "DO NOT" Rules

1. ❌ **DO NOT** remove or edit the `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` block at the top of this file. It is re-generated by Next.js tooling.
2. ❌ **DO NOT** use `PascalCase.tsx` or `kebab-case.tsx` for file names. Every file must be `snake_case.tsx` or `snake_case.ts`.
3. ❌ **DO NOT** use `npm` or `yarn` commands; only use `pnpm`.
4. ❌ **DO NOT** import from `"framer-motion"`. Use `"motion/react"`.
5. ❌ **DO NOT** hardcode hex colors (e.g. `#111111`, `#fff`). Always use Tailwind theme tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
6. ❌ **DO NOT** set `overflow: hidden` on ancestors of `sticky` elements.
7. ❌ **DO NOT** mutate or bypass TypeScript strict checks without explicit justification.
8. ❌ **DO NOT** introduce Pages Router patterns (e.g. `pages/` directory, `getStaticProps`, `getServerSideProps`). This repository is strictly on Next.js 16 App Router.
