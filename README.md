# Anime Explorer

Browse and filter anime using the Jikan API. Built with Vite + React + TypeScript, Zustand for state, Axios for networking, Tailwind for styling, and React Router for navigation. Tests use Vitest + React Testing Library.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed localhost URL (default http://localhost:5173).

## Live demo

- Production (Vercel): https://anime-explorer-delta.vercel.app/

### Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the production build
- `npm run test` – run Vitest (jsdom)
- `npm run test:coverage` – if configured, run coverage via Vitest

## Thought process

- Start with the API: I first wired simple fetch calls to the Jikan endpoints to prove data flow, then built the Home page list around that data.
- Add depth with details: After listing, I created the detail page to validate navigation and richer data rendering.
- State with familiarity: I chose Zustand for storing/persisting data because I use it at work and it keeps the global state small and predictable.
- Hooks for data flow: Custom hooks (`useAnimeList`, `useAnimeDetail`, `useAnimeGenres`) encapsulate fetch logic, keep components lean, encourage reuse, make testing easier, and isolate side effects from UI concerns—a pattern I also follow at work.
- Refinements: Barrel imports for cleaner paths, path aliases for clarity, then layered on tests (store, API, components, pages) to lock behavior.

## Tech stack and architecture decisions

- **React + TypeScript (Vite):** Fast dev/build and type safety.
- **State:** Zustand with `persist` used to handle the `favorites` and `genres`.
- **Networking:** Axios client in `src/api/client.ts` with 429 handling. API functions: list, detail, genres.
- **Hooks:** `useAnimeList`, `useAnimeDetail`, `useAnimeGenres` encapsulate data fetching, pagination, and caching logic.
- **Styling:** Tailwind CSS; mobile-first responsive layouts.
- **Routing:** React Router; routes for Home, Favorites, Anime Detail, and 404.
- **Components:** Reusable UI pieces (`Navbar`, `GenreDropdown`, `AnimeCard`, `FavoriteButton`, `ErrorMessage`, `Loading`, `SearchNotFound`, `Pill`, `Layout`).
- **Aliases:** `@/` maps to `src/` (configured in `tsconfig` and Vite).
- **Tests:** Vitest + RTL. Tests live alongside features under `tests/` folders to mirror structure. Shared mocks in `src/test/mocks/anime.ts`. LocalStorage mocked for Zustand persist tests.
- **Images/assets:** Served from `public/` (e.g., `animedotjs.svg`, `luffy_disappointed.png`, `naruto_look.png`).

## Features

- Search with debounced input to reduce API calls.
- Genre dropdown backed by Jikan genres; filter list by genre.
- Pagination via “Load More”.
- Favorites with local persistence (only favorites persisted).
- Detail page with metadata, genres, and favorite toggle.
- Error and loading components; illustrated error/not-found states.
- Responsive grid (1-col mobile, up to 4-col desktop).

## Known limitations / trade-offs

- **Rate limits:** Jikan enforces rate limits; rapid search/genre changes can still hit 429 despite debouncing.
- **Offline/SSR:** No offline caching; app is CSR-only.
- **Accessibility:** Core semantics are present, but deeper a11y (focus management, reduced motion toggles) could be improved.
- **Testing surface:** High coverage across store/api/components/pages, but end-to-end flows are not covered (no Playwright/Cypress).
- **Data persistence scope:** Only favorites are persisted by design; genres/search results are intentionally non-persisted.
- **Loading UX:** Loading states are simple; could be improved with richer animations or skeletons.
- **UI navigation:** Consider making the header sticky on long lists, or provide a “back to top” control if the navbar remains non-sticky.
- **Filtering breadth:** Jikan offers richer filters; expanding filter options (beyond genre) could improve discovery.

## Project layout (high level)

- `src/api` – Axios client and API calls
- `src/components` – Reusable UI components (+ `tests/`)
- `src/hooks` – Data-fetching hooks (+ `tests/`)
- `src/pages` – Route pages (+ `tests/`)
- `src/store` – Zustand store (+ barrel)
- `src/types` – Shared TypeScript interfaces
- `src/test` – Test setup and shared mocks
- `public` – Static assets (favicons, images)

## Deployment notes

- Build: `npm run build`
- Output: `dist/`
- Vercel: use the Vite preset; no extra config required. If you need an explicit file, use `vercel.json` with `buildCommand: "npm run build"` and `outputDirectory: "dist"`.
