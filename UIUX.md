
# UI/UX Design System & Behavioral Rules (`ui-ux-rules.md`)

This document serves as the absolute, non-negotiable UI/UX and interaction guideline for the **Zerochirou Portfolio** codebase. Every AI agent, engineer, and contributor must strictly follow these rules when creating or refactoring UI components to preserve visual consistency, motion feel, accessibility standards, and interaction semantics across the application.

---

## 1. User Feedback & Interactive States

### 1.1 Loading States
- **Button Loading**: The `Button` component does **NOT** accept `isLoading` or `isPending` props. Loading buttons MUST be composed using Base UI primitives with `Spinner`, `data-icon="inline-start"`, and `disabled`.
  ```tsx
  // ✅ DO: Compose with Spinner and disabled state
  <Button disabled>
    <Spinner data-icon="inline-start" />
    Saving Changes...
  </Button>

  // ❌ DON'T: Invent fake props
  <Button isLoading>Saving Changes...</Button>
  ```
- **Text & Inline Loading**: For streaming or live "thinking/evaluating" inline text, use the `.shimmer` class utility. Never author custom `@keyframes` or hand-crafted text clip sweeps.
  ```tsx
  // ✅ DO:
  <span className="shimmer text-muted-foreground">Synthesizing response…</span>
  ```
- **Content Placeholders (Skeletons)**:
  - Always use the dedicated `<Skeleton className="..." />` component.
  - Never hand-roll `<div className="animate-pulse bg-neutral-800 ...">`.
  - Match skeleton dimensions to the target component; use `size-*` for square geometries.
- **Heavy WebGL / 3D Canvases**:
  - Components mounting WebGL renderers (Three.js, OGL, R3F like `Galaxy` or `Dither`) must be loaded dynamically using Next.js `dynamic(..., { ssr: false })` to prevent hydration mismatches and main-thread blocking.

### 1.2 Empty States
- When a dataset, query result, or filtered view contains no items, always compose using the standardized `Empty` component hierarchy:
  ```tsx
  // ✅ DO: Standard Empty State Composition
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FolderSearch className="size-6 text-muted-foreground" />
      </EmptyMedia>
      <EmptyTitle>No projects found</EmptyTitle>
      <EmptyDescription>
        Try adjusting your filter or search keywords.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button variant="outline" onClick={resetFilter}>
        Reset Filter
      </Button>
    </EmptyContent>
  </Empty>

  // ❌ DON'T: Render bare paragraphs with ad-hoc styling
  <div className="py-10 text-center text-gray-500">No data found</div>
  ```

### 1.3 Notifications, Alerts & Status Callouts
- **Toasts (Base UI Pattern)**:
  - This project uses `@base-ui/react` primitives (`base-luma` style). Toast notifications MUST use the Base UI `toast` module from `@/components/ui/toast`:
    ```tsx
    import { toast } from "@/components/ui/toast"

    toast.add({
      title: "Settings synchronized",
      description: "Your workspace profile has been saved.",
    })
    ```
  - Do **NOT** use `sonner` or Radix toast APIs unless the project explicitly standardizes on it.
- **In-Page Feedback & Callouts**:
  - Use `<Alert>` composed with `<AlertTitle>` and `<AlertDescription>`:
    ```tsx
    <Alert>
      <AlertTitle>Performance Notice</AlertTitle>
      <AlertDescription>
        WebGL hardware acceleration is active.
      </AlertDescription>
    </Alert>
    ```
- **Status & Destructive Indicators**:
  - Always use theme tokens: `text-destructive`, `bg-destructive/10`, `border-destructive`.
  - For positive status, use `<Badge variant="secondary">` or `<Badge variant="default">`.
  - **Strict Prohibition**: Never hardcode raw Tailwind color utilities (`text-red-500`, `bg-emerald-600`, `border-blue-400`) for state indicators.

---

## 2. Form Behavior & Validation

### 2.1 Form Architecture & Composition
- **Structural Grouping**:
  - Always compose fields using `FieldGroup` + `Field` + `FieldLabel` + `FieldDescription`.
  - Never wrap form controls in unstructured `<div>` tags with `space-y-*`.
  - For related groups of checkboxes, radio buttons, or switches, wrap in `FieldSet` + `FieldLegend variant="label"`.
  ```tsx
  // ✅ DO: Standard Field composition
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
      <Input id="project-name" placeholder="Hypergrid" />
      <FieldDescription>The public identifier for your build.</FieldDescription>
    </Field>
  </FieldGroup>
  ```
- **Horizontal Settings Form Pattern**:
  - For settings panels, add `orientation="horizontal"` to `<Field>`:
    ```tsx
    <Field orientation="horizontal">
      <FieldLabel htmlFor="notifications">Receive updates</FieldLabel>
      <Switch id="notifications" />
    </Field>
    ```

### 2.2 Input Addons & Compound Controls
- **Buttons and Icons Inside Inputs**:
  - Never position buttons or icons inside inputs using absolute coordinates (`absolute right-2`) and custom input padding (`pr-10`).
  - Always use `InputGroup` + `InputGroupInput` + `InputGroupAddon`:
    ```tsx
    // ✅ DO:
    <InputGroup>
      <InputGroupInput placeholder="Search repositories..." />
      <InputGroupAddon>
        <Button size="icon-sm" variant="ghost" aria-label="Submit search">
          <SearchIcon data-icon="inline-start" />
        </Button>
      </InputGroupAddon>
    </InputGroup>
    ```

### 2.3 Option Selection (2–7 Items)
- **Use `ToggleGroup`**: Never loop over `Button` components with manual active boolean checks.
  ```tsx
  // ✅ DO (Base UI ToggleGroup):
  <ToggleGroup defaultValue={["daily"]} spacing={2}>
    <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
    <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
  </ToggleGroup>
  ```

### 2.4 Validation States & Error Display
- **Dual-Attribute Synchronization**:
  - Apply `data-invalid` to the `<Field>` wrapper (drives label and description color transitions).
  - Apply `aria-invalid` to the input control (drives ring and border styles).
  ```tsx
  // ✅ DO: Validated Field pattern
  <Field data-invalid={Boolean(error)}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input
      id="email"
      type="email"
      aria-invalid={Boolean(error)}
      defaultValue="invalid@"
    />
    {error && <FieldDescription>{error}</FieldDescription>}
  </Field>
  ```
- **Control Error Ring Token**:
  `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40`.

---

## 3. Motion & Micro-Interactions

### 3.1 Framework Constraints
- **Animation Engine**: Motion v12 via **`motion/react`**.
- **STRICT PROHIBITION**: **NEVER** import from `"framer-motion"`.
- **GSAP Timelines**: For scroll-linked complex pin/scrub timelines (such as `ScrollFloat`), register `ScrollTrigger` and always clean up context inside `useEffect`.

### 3.2 Standardized Tailwind Micro-Interactions
- **Interactive Cursor**:
  All non-disabled interactive controls automatically get `cursor: pointer;` via `@layer base`.
- **Button Click Action (Haptic Push)**:
  `active:not-aria-[haspopup]:translate-y-px` — buttons subtly depress by 1px on click unless they trigger an overlay or menu.
- **Hover Transitions**:
  - Buttons: `transition-all outline-none select-none`
  - Outline Button: `border-border bg-background hover:bg-muted hover:text-foreground dark:bg-transparent dark:hover:bg-input/30`
  - Secondary Button: `hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]` (Native OKLCH color mix)
  - Ghost Button: `hover:bg-muted hover:text-foreground dark:hover:bg-muted/50`
  - Card & Grid Cells: `transition-colors duration-300 hover:bg-muted/40` or `hover:border-border` with subtle initial border `border-border/40`.
  - Icon Hover Micro-motion: `transition-all duration-300 ease-in-out group-hover:scale-110` with GPU acceleration `transform-gpu`.

### 3.3 Timing Curves & Transition Durations
All overlays, drawers, and menus in the application share coherent easing curves:
| Component Type | Duration | Easing Curve | Motion Characteristics |
| :--- | :--- | :--- | :--- |
| **Drawer / Mobile Menu** | `450ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Physics-like fluid deceleration with swipe gestures |
| **Drawer Backdrop** | `450ms` | `cubic-bezier(0.32, 0.72, 0, 1)` | Rapid darkening with smooth fade |
| **Drawer Inner Content** | `300ms` | `cubic-bezier(0.45, 1.005, 0, 1.005)` | Slight overshoot settle on open |
| **Navigation Menu / Popups** | `350ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Directional slide & scale (`scale-90` to `scale-100`) |
| **Popup Exit** | `150ms` | `ease` | Snappy scale-down and opacity fade |
| **Sticky Navbar Blur** | `300ms` | `ease-in-out` | Triggered at `window.scrollY > 20` |
| **Text Animations (`TextAnimate`)** | `300ms` | `ease-out` | Staggered: lines (0.06s), words (0.05s), characters (0.03s) |

### 3.4 Accessibility in Motion (Reduced Motion)
- Any component running continuous sweeps or physics (such as `DiaTextReveal`, `BlurText`, or Canvas loops) MUST check `useReducedMotion()`. When `prefers-reduced-motion: reduce` is enabled:
  - Immediately set positions to final completion states (`SWEEP_END`).
  - Disable infinite loops and ambient canvas twirls.

---

## 4. Responsive & Layout Consistency

### 4.1 Breakpoint Strategy
The system follows a dark-first, desktop-refined mobile hierarchy:
- **Base Mobile (`< 640px`)**: Single-column layout, compact cards, `85vw` full-height drawers, compact badges (`text-xs`), minimal horizontal padding (`px-3` to `px-4`).
- **Small (`sm: 640px`)**: Refines cards, padding expands to `p-6`, terminal locks to `sm:max-h-140`, typography scales (`text-2xl` to `text-3xl`).
- **Medium (`md: 768px`) — PRIMARY ARCHITECTURAL SHIFT**:
  - Mobile Menu Drawer (`md:hidden`) shifts to Desktop Navigation (`hidden md:flex`).
  - Footer switches from stacked single-column to 6-column grid (`col-span-6` to `md:col-span-4` and `md:col-span-1`).
  - Card grids transition from single-column to 2-column.
- **Large (`lg: 1024px`)**:
  - Projects grid expands to 3 columns (`lg:grid-cols-3`).
  - Hover action disclosures (e.g., CTA links sliding in from bottom) appear on `lg:flex`.

### 4.2 Spacing & Structural Rhythm
- **Page Container Widths**:
  - Narrative & Core Reading flow: `max-w-4xl` (`w-full mx-auto px-4 sm:p-4`)
  - Tech Stack & Interactive Grids: `max-w-5xl`
  - Portfolio Projects Grid: `max-w-7xl`
- **Section Spacing**:
  - Standard section vertical rhythm: `py-16 sm:py-20` up to `py-20 sm:py-28 md:py-40`.
  - Multi-viewport sticky stacking sections: Minimum container height `min-h-[300vh] sm:min-h-[350vh]`.
- **Card-Level Spacing Token**:
  - Cards MUST consume the CSS property variable `--card-spacing`:
    `py-(--card-spacing) px-(--card-spacing) gap-(--card-spacing)` where default is `[--card-spacing:--spacing(6)]` (24px) and small is `data-[size=sm]:[--card-spacing:--spacing(4)]` (16px).
- **Prohibited Spacing Patterns**:
  - **NO `space-x-*` or `space-y-*`**: Always use `flex flex-col gap-*` or `grid gap-*`.
  - **NO arbitrary magic padding values** like `p-[17px]`. Use theme increments (`gap-1.5`, `gap-2`, `gap-4`, `gap-6`).

### 4.3 Border Radius System
The visual style is built upon `--radius: 0.625rem` (10px):
- **Large Cards, Drawers & Primary Buttons**: `rounded-4xl` (`calc(var(--radius) * 2.6)` ~ 26px)
- **Badges, Pills & Navigation Triggers**: `rounded-3xl` (`calc(var(--radius) * 2.2)` ~ 22px)
- **Inner Interactive Rows & Menu Items**: `rounded-xl` or `rounded-lg`
- **Table / Matrix Grid Cards (`StackSection`)**: `rounded-none border border-border/40` when grouped in zero-gap continuous grids.

### 4.4 Horizontal Overflow & The Sticky Scroll Rule
- Root containers (`html`, `body`, and `<main>`) use `overflow-x: clip;` (Smooth scrolling enabled on `html`).
- **CRITICAL ANTI-PATTERN**: **NEVER apply `overflow: hidden` to parent wrappers or ancestor containers of sticky elements.** Doing so permanently breaks CSS `position: sticky`.
- Background canvas layers must always have `pointer-events-none` with bottom gradient fades:
  ```tsx
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-64 z-[5] bg-gradient-to-t from-background to-transparent" />
  ```

---

## 5. Accessibility (a11y) & Navigation Standards

### 5.1 Global Focus Ring Standard
Interactive elements must provide high-contrast, non-obtrusive keyboard navigation feedback:
```css
outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30
```
- **Error State Ring**: `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`
- **Destructive Action Ring**: `focus-visible:border-destructive/40 focus-visible:ring-destructive/20`
- Global base fallback is configured in `@layer base`: `* { @apply border-border outline-ring/50; }`.

### 5.2 Base UI Delegation (`render` vs `asChild`)
- **STRICT PROHIBITION**: This codebase uses `@base-ui/react`. **DO NOT use Radix UI's `asChild`**.
- Always use the `render` prop. When delegating rendering to a non-button element (such as Next.js `<Link>` or `<a>`), you MUST pass `nativeButton={false}`:
  ```tsx
  // ✅ DO: Base UI rendering delegation
  <DrawerTrigger
    render={<Button variant="ghost" size="icon-lg" aria-label="Open navigation menu" />}
  >
    <PanelLeft className="size-5" />
  </DrawerTrigger>

  <Button render={<a href="/projects" />} nativeButton={false}>
    View All
  </Button>

  // ❌ DON'T: Radix asChild pattern
  <DrawerTrigger asChild>
    <Button ... />
  </DrawerTrigger>
  ```

### 5.3 Modals, Sheets & Drawers
- **Mandatory Headings**: Every `Drawer`, `Dialog`, and `Sheet` must contain both a Title component (`<DrawerTitle>`) and a Description component (`<DrawerDescription>`).
- If visually unneeded in the design, DO NOT omit it; hide it visually using `className="sr-only"`.
  ```tsx
  <DrawerTitle className="sr-only">Site Navigation</DrawerTitle>
  <DrawerDescription className="sr-only">
    Primary links and social handles
  </DrawerDescription>
  ```
- **Icon-Only Buttons**: Every icon-only button must include an explicit `aria-label`:
  ```tsx
  <Button variant="ghost" size="icon" aria-label="Close navigation menu">
    <X className="size-4" />
  </Button>
  ```

### 5.4 Iconography Standards
- **Icon Sizing Inside Components**:
  - Components manage internal icon dimensions automatically via CSS rules:
    `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`.
  - Inside `Button`, pass `data-icon="inline-start"` (prefix) or `data-icon="inline-end"` (suffix). Do not add manual margin classes (`mr-2`) or size overrides unless explicitly customized.
  ```tsx
  // ✅ DO:
  <Button>
    <Languages data-icon="inline-start" />
    Translate
  </Button>

  // ❌ DON'T:
  <Button>
    <Languages className="mr-2 h-4 w-4" />
    Translate
  </Button>
  ```
- **Icon Component Passing**: Pass icons as component references (`icon={GithubIcon}`), never as string dictionary keys.
- **Touch Target Integrity**: Mobile link items and drawer interactive handles must guarantee a touch target height of at least `32px` to `44px` (`min-h-[32px] py-1` or `h-9`).

---

## 6. Token & Architecture Checklist for AI Agents

Before submitting or generating any UI component, verify:
- [ ] Uses OKLCH theme tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border/40`). Zero raw hex colors (`#fff`, `#111`).
- [ ] Imports Motion from `"motion/react"`, never `"framer-motion"`.
- [ ] Uses Base UI `render={<Component />}` with `nativeButton={false}` when needed. No `asChild`.
- [ ] Primitive components expose `data-slot="..."`.
- [ ] No `space-x-*` or `space-y-*`; uses `gap-*` layout exclusively.
- [ ] Uses `size-*` instead of matching `w-* h-*`.
- [ ] Overlay containers include `Title` and `Description` (or `sr-only` equivalents).
- [ ] Icon-only buttons have descriptive `aria-label` attributes.
- [ ] Ancestors of `sticky` elements preserve `overflow-x: clip;` without `overflow: hidden`.
- [ ] Canvas effects have `pointer-events-none` with bottom gradient masking into `from-background`.
