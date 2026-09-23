# CompareCar

A web app for browsing a car catalog, comparing cars side-by-side, and exploring per-car data visualizations.

Built to make complex car information easy to understand, browse, and compare. CompareCar is an independent car information and comparison platform — not a dealership or manufacturer website.

**Live demo:** https://compare-car-project.vercel.app/

---

## Features

- **Catalog** (`/`) — browse cars in a grid with search, powertrain type/subtype filters, category filter, and compare checkboxes.
- **Compare** (`/compare?ids=a,b,c`) — side-by-side specification comparison with grouped sections, difference highlighting, and winner indicators. Responsive layout for mobile.
- **Car detail** (`/car/[id]`) — full specifications, quick facts, Recharts radar chart, performance comparison against the catalog, and bar chart against category average.
- **i18n** — English (`en`) and Thai (`th`).
- **SEO** — server-rendered content, meta descriptions, sitemap, robots, and JSON-LD structured data.
- **Responsive** — mobile-first design across mobile, tablet, and desktop.

---

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 (CSS-first configuration)
- [Recharts](https://recharts.org) for data visualization
- [Lucide React](https://lucide.dev) for icons
- [next-intl](https://next-intl.dev) for internationalization
- [Vitest](https://vitest.dev) + Testing Library for tests
- [shadcn/ui](https://ui.shadcn.com) components

Static car data is maintained in `src/data/cars.ts`.

---

## Getting Started

Prerequisites: [Node.js](https://nodejs.org) 20.9+ and npm.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The site auto-updates as you edit files.

---

## Available Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start the development server               |
| `npm run build` | Create a production build                  |
| `npm run start` | Start the production server                |
| `npm run lint`  | Run ESLint                                 |
| `npm test`      | Run tests with Vitest                      |

---

## Project Structure

```
src/
  app/            # Routes: /, /compare, /car/[id], /credits, /disclaimer
  components/     # UI, car, compare, and filter components
  constants/      # Static configuration
  data/           # cars.ts, features.ts, credits.ts
  i18n/           # next-intl routing and request config
  lib/            # types, utils, site helpers
  test/           # Test setup
messages/
  en.json         # English translations
  th.json         # Thai translations
```

---

## Data

- Car data lives in `src/data/cars.ts` with typed models in `src/lib/types.ts`.
- All prices are in Thai Baht (THB), formatted via the `formatPrice` helper.
- Powertrains are classified as `ICE`, `HEV` (with subtypes `MHEV`, `HEV`, `PHEV`, `REEV/EREV`), or `EV`.
- Real car photos can be placed in `public/images/cars/` and referenced by the `image` property; placeholder gradients are shown when no photo exists.

---

## Deploy on Vercel

The app is deployed at https://compare-car-project.vercel.app/.

The easiest way to deploy your own instance is to push this repo to GitHub and import it on the [Vercel Platform](https://vercel.com/new). See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.