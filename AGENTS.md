<!-- BEGIN:nextjs-agent-rules -->

**# This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: CompareCar

A web app for viewing a car catalog, comparing cars side-by-side, and showing per-car data visualizations.

The primary goal is to make complex car information easy to understand, browse, and compare.

The product is an independent car information and comparison platform, not a dealership or manufacturer website.

---

# Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS v4
- Recharts for data visualization
- Lucide React for icons
- Static car data maintained in `src/data/cars.ts`

Use Server Components by default. Use Client Components only when interactivity or browser APIs require them.

---

# Icons

Use **Lucide React** for all icons.

```tsx
import { Zap, Battery, Gauge } from "lucide-react";
```

Do not use other icon libraries or inline SVGs for standard UI icons.

Each car has:

```ts
powertrain: {
  type,
  subtype?
}
```

## Powertrain

`type`:

```ts
"ICE" | "HEV" | "EV";
```

`subtype`:

- `ICE` → none
- `HEV` → `'MHEV' | 'HEV' | 'PHEV' | 'REEV/EREV'`
- `EV` → `'BEV'`

## Powertrain Badge

Badge display prioritizes subtype.

See `badgeLabel` in `src/lib/types.ts`.

- ICE → `ICE`
- EV / BEV → `EV`
- HEV → `MHEV`, `HEV`, `PHEV`, or `REEV/EREV`

Do not duplicate powertrain classification logic across components.

---

# Routes

## `/`

Catalog page.

Features:

- Grid of car cards
- Search
- Powertrain type filter
- Powertrain subtype filter
- Category filter
- Compare checkboxes

The catalog should prioritize browsing and discovering cars.

---

## `/compare?ids=a,b,c`

Side-by-side comparison page.

Desktop:

- Side-by-side specification comparison
- Grouped specification sections
- Differing rows highlighted

Mobile:

- Responsive comparison layout
- Stack or horizontally scroll depending on the component
- Keep important comparison information easy to access

The comparison page is one of the core product experiences.

---

## `/car/[id]`

Car detail page.

Includes:

- Full specifications
- Vehicle information
- Recharts radar chart
- Performance comparison against catalog
- Bar chart comparing specifications against category average

The page should combine editorial presentation with structured data.

---

# Car Images

- Placeholder gradient is shown when a real photo is missing.
- See `src/components/CarImage.tsx`.
- Real photos can be placed in `public/images/cars/`.
- Image paths are defined by the `image` property in the car data.

Do not assume that images found on manufacturer websites are automatically free to reuse.

When using external images, preserve source and licensing information where applicable.

---

# UI Design Direction

## Style: Swiss Editorial Automotive

The primary visual direction is:

> **Swiss Editorial Automotive**

The design combines:

- Swiss / International design
- Editorial automotive design
- Modern data-driven product UI
- Subtle Bento-style information grouping

The website should feel like a:

> **Premium automotive data platform**

It should NOT feel like:

- A car dealership
- A used-car marketplace
- An automotive news website
- An administration dashboard
- A generic SaaS landing page

---

# Core Design Principle

The primary design principle is:

> **Make complex car information easy to understand and compare.**

Every UI decision should support this principle.

If a visual effect looks impressive but makes information harder to understand, remove it.

The product should feel premium because it is:

- Clear
- Precise
- Consistent
- Well structured
- Visually balanced

Not because it uses excessive effects.

---

# Visual Personality

The UI should feel:

- Precise
- Clean
- Premium
- Modern
- Trustworthy
- Technical
- Editorial
- Confident
- Approachable

Avoid making the interface feel:

- Cheap
- Overly colorful
- Overly futuristic
- Overly luxurious
- Visually noisy
- Generic SaaS
- Dashboard-heavy

---

# Swiss / International Design

Apply Swiss design principles:

- Strong grid
- Consistent alignment
- Clear hierarchy
- Generous whitespace
- Functional typography
- Restrained decoration
- Intentional asymmetry

Prefer alignment and spacing over decorative elements.

Use a consistent content grid.

Do not add visual elements simply to fill empty space.

Whitespace is intentional.

---

# Editorial Automotive Design

Vehicle imagery and typography should establish the automotive identity.

Prefer:

- Large vehicle imagery
- Strong headlines
- Editorial layouts
- Large whitespace
- Clear section hierarchy
- Short descriptive copy
- Intentional image placement

The website should look like a modern automotive publication combined with a data product.

Avoid making every page look like a car manufacturer's sales page.

---

# Bento Layout

Use Bento-style layouts selectively.

Bento layouts are useful for:

- Quick vehicle statistics
- Performance metrics
- Feature summaries
- Battery information
- Dimensions
- Charts
- Comparison summaries

Do NOT make every component a rounded card.

Use normal sections, grids, and typography when cards are unnecessary.

---

# Color System

Use a light-first interface.

Primary visual palette:

```text
Background:      #F8FAFC
Surface:         #FFFFFF
Primary Text:    #0F172A
Secondary Text:  #64748B
Border:          #E2E8F0
Brand Accent:    #2563EB
```

Use dark navy / charcoal for:

- Strong headings
- Navigation
- Hero sections
- High-emphasis areas

Use blue primarily for:

- Primary actions
- Links
- Selected states
- Interactive elements
- Important data highlights

Do not use blue everywhere.

Do not introduce random colors without a design reason.

Do not use highly saturated colors as the primary visual language.

---

# Typography

Typography is a major part of the visual identity.

Prioritize:

- Strong hierarchy
- Clear headings
- High readability
- Clear numerical typography
- Consistent alignment
- Comfortable line height

Important automotive values should be visually easy to scan.

Example:

```text
204 HP
330 Nm
6.8 s
18.2 km/L
1,999,000 THB
```

Use stronger visual emphasis for important values.

- **All prices are in Thai Baht (THB).** Always display prices using the `formatPrice` helper in `src/lib/types.ts` (e.g. `฿1,999,000`). Never prefix with `$`.

Do not use oversized typography purely for decoration.

Do not use excessive font weights.

---

# Grid and Spacing

Use a consistent responsive grid.

Desktop should generally use a 12-column content grid where appropriate.

Maintain consistent:

- Horizontal alignment
- Section spacing
- Card spacing
- Content width
- Vertical rhythm

Prefer intentional whitespace rather than filling every available space.

Avoid arbitrary spacing values when a consistent spacing system can be used.

---

# Car Cards

Car cards should feel premium, clean, and editorial.

Information priority:

1. Vehicle image
2. Brand
3. Model
4. Variant
5. Price
6. Key specifications
7. Powertrain
8. Rating / score
9. Compare action

Vehicle imagery should be visually prominent.

Use restrained:

- Borders
- Shadows
- Radius
- Hover effects

Avoid excessive card decoration.

Cards should remain readable without relying on color.

---

# Car Detail Page

The car detail page should combine:

> **Editorial Hero + Structured Data + Visualization**

Recommended hierarchy:

```text
Vehicle Hero
    ↓
Quick Facts
    ↓
Overview
    ↓
Performance
    ↓
Powertrain
    ↓
Dimensions
    ↓
Features
    ↓
Charts
    ↓
Comparison
```

Use Bento-style layouts for quick facts and metrics.

Use full-width sections for important visualizations when appropriate.

---

# Comparison Experience

Comparison is a core product feature.

Users should understand the differences between vehicles immediately.

Prioritize:

- Side-by-side values
- Grouped specifications
- Difference highlighting
- Winner indicators
- Consistent units
- Strong numerical typography

Example:

```text
POWER

Car A                 Car B
150 HP                 170 HP
                       WINNER
```

Do not determine a winner simply because a number is larger.

Comparison logic must understand metric semantics.

Examples:

- Horsepower → higher is generally better
- Torque → higher is generally better
- Price → lower is generally better
- 0–100 km/h → lower is generally better
- Range → higher is generally better
- Cargo capacity → higher is generally better
- Fuel economy → depends on how the metric is represented

Do not display a winner when the metric cannot be meaningfully compared.

Handle missing values explicitly.

Do not treat `null`, `N/A`, or unavailable values as zero.

---

# Data Presentation

The website contains a lot of technical information, but the UI should remain approachable.

Prioritize scanning over dense technical presentation.

Prefer:

```text
Power
180 HP
```

over unnecessarily verbose labels.

Group specifications into meaningful categories:

- Price
- Powertrain
- Performance
- Engine
- Dimensions
- Fuel / Energy
- Battery
- Safety
- Technology
- Interior
- Exterior

Use large numerical values selectively for important metrics.

---

# Data Visualization

Use Recharts for data visualization.

Charts should be:

- Simple
- Clean
- Useful
- Easy to interpret
- Consistent with the design system

Avoid:

- 3D charts
- Decorative charts
- Excessive colors
- Excessive grid lines
- Unnecessary legends
- Charts without meaningful comparisons

Every chart should answer a useful question.

Examples:

- How does this car perform compared with the catalog?
- How does this car compare with the category average?
- Which car has better performance?

If a chart does not help users understand the car, remove it.

---

# Responsive Design

Use a mobile-first approach.

The website must work well on:

- Mobile
- Tablet
- Desktop
- Large desktop

Do not simply shrink the desktop design for mobile.

Reconsider information hierarchy at smaller screen sizes.

## Desktop

Prefer:

- Multi-column grids
- Editorial layouts
- Side-by-side comparisons
- Larger vehicle imagery

## Mobile

Prefer:

- Stacked sections
- Important information first
- Simplified navigation
- Horizontally scrollable comparison tables when necessary
- Compact but readable cards

The mobile experience should remain useful even when the desktop layout is completely restructured.

---

# Interaction and Motion

Interactions should feel:

- Fast
- Predictable
- Subtle
- Premium

Prefer:

- Short transitions
- Subtle hover states
- Clear selected states
- Small transforms
- Smooth expand/collapse

Avoid:

- Bouncing animations
- Excessive motion
- Parallax
- Large entrance animations
- Decorative animations
- Continuous motion

Animation must communicate state or improve usability.

---

# Tailwind CSS v4

Use **Tailwind CSS v4**.

Follow the CSS-first configuration approach.

Prefer `@theme` for shared design tokens.

Example:

```css
@import "tailwindcss";

@theme {
  --color-brand: #2563eb;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
}
```

Prefer Tailwind utility classes directly in components.

Avoid unnecessary custom CSS.

Do not introduce a large `tailwind.config.js` for values that can be represented using Tailwind v4 CSS-first configuration.

Use arbitrary values only when there is a genuine design or technical requirement.

Do not introduce random:

- Colors
- Spacing
- Border radius
- Shadows
- Font sizes

Use existing design tokens whenever possible.

---

# Component Architecture

Prefer reusable, composable components.

Examples:

- `CarCard`
- `CarImage`
- `CarPrice`
- `CarSpec`
- `SpecGroup`
- `CarScore`
- `ComparisonTable`
- `ComparisonRow`
- `WinnerBadge`
- `CarSelector`
- `FilterBar`
- `VehicleGallery`
- `MetricCard`

Components should have a clear responsibility.

Avoid duplicating large blocks of UI or styling.

Avoid creating abstractions for tiny one-off elements unless reuse is expected.

---

# Server and Client Components

Use Server Components by default.

Use Client Components only when needed for:

- User interaction
- Browser APIs
- Local state
- Event handlers
- Interactive charts when required

Do not convert entire pages into Client Components unnecessarily.

Keep static car information server-rendered whenever possible.

---

# Accessibility

Accessibility is part of the design requirements.

Follow semantic HTML and WCAG principles.

Ensure:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Accessible labels
- Meaningful image alt text
- Correct heading hierarchy
- Proper button semantics
- Proper link semantics
- Correct table headers

Never communicate important information using color alone.

For example, a winner should use:

- Color
- Text
- Icon or symbol

rather than color alone.

Interactive controls must have clear states:

- Default
- Hover
- Focus
- Active
- Selected
- Disabled

---

# SEO

The website should be SEO-friendly.

Prefer:

- Server-rendered content
- Semantic HTML
- Meaningful page titles
- Meta descriptions
- Descriptive headings
- Descriptive image alt text
- Structured content
- Canonical URLs where appropriate

Car detail pages should expose useful car information in the initial rendered HTML whenever possible.

Do not hide important car specifications entirely behind client-side rendering.

Use appropriate metadata for car detail pages.

Do not generate meaningless or duplicate page titles.

---

# Performance

Prioritize:

- Next.js image optimization
- Appropriate image dimensions
- Lazy loading for non-critical images
- Minimal client-side JavaScript
- Server Components by default
- Efficient rendering
- Avoiding unnecessary re-renders

Do not load large libraries when a lightweight solution is sufficient.

Do not add client-side state when server rendering or URL state is sufficient.

---

# Images and Image Handling

Prefer high-quality and consistent vehicle imagery.

Vehicle images should ideally have:

- Consistent aspect ratios
- Clean composition
- Similar visual treatment
- Appropriate resolution

Avoid mixing radically different image styles in the same component.

Use Next.js image optimization where appropriate.

Do not stretch images.

Use appropriate `object-fit` behavior depending on the image context.

---

# Content and Copy

UI copy should be:

- Concise
- Clear
- Neutral
- Informative
- Easy to scan

Avoid marketing language unless intentionally used in an editorial section.

Do not make unsupported claims such as:

- "Best car"
- "The fastest"
- "Guaranteed"
- "Perfect choice"

unless the statement is backed by a defined comparison rule or source.

The website should present information objectively.

---

# Design Consistency

When adding a new page or component:

1. Follow the existing design system.
2. Reuse existing components where possible.
3. Reuse existing design tokens.
4. Maintain the same typography hierarchy.
5. Maintain the same spacing system.
6. Maintain the same interaction patterns.
7. Maintain the same responsive behavior.

Do not introduce a completely new visual style for individual pages.

---

# Anti-Patterns

Do NOT:

- Make every element a card
- Use excessive rounded corners
- Use excessive gradients
- Use excessive shadows
- Use excessive glassmorphism
- Use neon colors
- Use excessive animations
- Create dashboard-like dense layouts
- Copy generic SaaS landing pages
- Use decorative elements without purpose
- Use random colors
- Use random spacing
- Use arbitrary values everywhere
- Hide important content behind unnecessary client-side rendering

---

# Implementation Priorities

When visual quality and implementation simplicity conflict, prioritize in this order:

1. Correct functionality
2. Information hierarchy
3. Accessibility
4. Responsive behavior
5. Visual consistency
6. Performance
7. Decorative effects

Do not sacrifice usability for visual effects.

---

# General Design Rule

Every UI decision should answer:

> **Does this make comparing cars easier?**

The final product should communicate:

> **Swiss precision + Automotive editorial + Modern data product**

Users should feel:

> **"I can understand these cars quickly."**

not:

> **"This website has a lot of effects."**

---

# Verification

Before considering a change complete:

```bash
npm run build
npm run lint
```

The implementation should compile successfully, pass TypeScript checks, and pass linting.

For UI changes, verify the affected page at:

- Mobile width
- Tablet width
- Desktop width

Verify that:

- Layout remains usable
- Important information remains visible
- Images are not distorted
- Comparison states are understandable
- Keyboard focus is visible
- No unnecessary horizontal overflow is introduced

---

# Design System & UI

The visual direction is **clean / minimalist light** with a single blue accent.

Design tokens live in `src/app/globals.css` via Tailwind v4 `@theme`:

- `--color-background` `#f8fafc`
- `--color-card` `#ffffff`
- `--color-foreground` `#0f172a`
- `--color-muted-foreground` `#475569`
- `--color-border` `#e2e8f0`
- `--color-primary` `#2563eb`
- spacing + shadow scale plus `tabular-nums` for numeric/stat readouts

Rules:

- Use tokens (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, ...) in components; avoid raw hex in components.
- Use `tabular-nums` on numeric/stat values.
- `cursor-pointer` on all clickable elements.
- Do not rely on color alone to communicate state (e.g. compare difference rows also use a `≠` marker and "differs" text).
- Visible `focus-visible` rings and `prefers-reduced-motion` handling are set up globally in `globals.css`.

A machine-generated design system also lives in `design-system/comparecar/MASTER.md` (from the `ui-ux-pro-max` skill in `.agents/skills`). Treat `globals.css` tokens as the source of truth for code.

## Lint ignore

`.agents/**` is ignored in `eslint.config.mjs` because it contains third-party skill scripts (CommonJS `require` imports), not app code.

