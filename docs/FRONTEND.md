# Frontend: web, mobile, desktop

Owner: Nidhi. Last updated: 2026-10-04.

Status: no UI code yet. `web/` does not exist until the command below is run.

One UI serves all three platforms. Build it once in `web/`, make it work on a phone screen, and let mobile and desktop open that same UI. See "Web, mobile, and desktop" in `ARCHITECTURE.md` for the reasoning.

## Design reference

All 14 screens are drawn on a design canvas: https://claude.ai/artifact/QD73sqhXZV5EaatPSguTXa

It is private to Anish until he shares it from the page's Share menu. It covers login, dashboard, patients, the eight screening steps, patient profile with the trend chart, the audit log, and two phone screens. Press Play on the canvas to click through the flow.

Look and feel to keep when building:

| Thing | Value |
|---|---|
| Fonts | Lexend for text, IBM Plex Mono for measured values |
| Ink and sidebar | `#10294d`, `#12305c` |
| Action colour (buttons, links) | `#0a7d75` |
| Page and card | `#f3f6f7`, `#ffffff`, border `#d3dde3` |
| Risk levels | A row of small bars plus the word. Bars: `#fab219` possible or moderate, `#ec835a` probable, `#d03b3b` severe or high, empty for none or low |
| Sizes | Body text 17 px, buttons and inputs at least 48 px tall |

All patients and values on the canvas are made up, and the X-ray is a drawing.

## Creating web/

Run this from the repo root. It was tested on 2026-10-04 and produced a Next.js 16.3.4 app with the App Router, TypeScript, Tailwind 4, and ESLint.

```
npx create-next-app@latest web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --disable-git --yes
```

Two things to know:

- `web/` must not exist, or must be empty. If it holds any file, even a `README.md` or `.gitkeep`, the command stops with "contains files that could conflict". That is why the folder is not in the repo yet.
- The command writes `web/AGENTS.md` and `web/CLAUDE.md`. Keep and commit them. They tell AI assistants that Next.js 16 differs from older versions and that the matching docs are in `web/node_modules/next/dist/docs/`.

## Next.js 16 differences that matter here

- `middleware.ts` is now called `proxy.ts`.
- If a `proxy.ts` file exists, Next.js buffers request bodies and keeps only the first 10 MB by default. A larger upload is cut short without an error. X-rays can be up to 50 MB, so **do not add a `proxy.ts`**. If one becomes necessary, set `experimental.proxyClientMaxBodySize` to `'50mb'` in `next.config.ts` and test a large upload.
- Before using any Next.js API from memory or from an older tutorial, check it in `web/node_modules/next/dist/docs/`.

## Talking to the backend

The browser never calls the backend's address directly. Next.js forwards `/api` to it, so the UI and the API share one origin. This keeps CORS closed and makes the login cookie work (see `SECURITY.md`, section 3).

```ts
// web/next.config.ts
import type { NextConfig } from "next";

const backend = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
```

`BACKEND_URL` is read when the app is built, so set it before `next build` on the demo machine.

In the UI, always call relative paths such as `/api/v1/patients`. Never hard-code `localhost:8000`.

## Login on the client

1. `POST /api/v1/auth/login` returns an access token. Keep it in a variable in memory. Do not put it in `localStorage` or `sessionStorage`.
2. The backend also sets the refresh cookie. The UI never reads or writes it.
3. Send `Authorization: Bearer <token>` on every API call.
4. On a 401, call `POST /api/v1/auth/refresh` once, then repeat the original call. If refresh fails, go to the login page.
5. After a page reload the memory is empty, so call refresh at startup to get a new access token.
6. Hide menu items the user's role cannot use (get the role from `/auth/me`). This is for convenience; the backend still refuses the call.

## Screens

From the spec (pages 11 to 13). Build in this order.

| # | Screen | What is on it | Status |
|---|---|---|---|
| 1 | App shell | Sidebar on wide screens, bottom or drawer menu on phones, role-aware menu | planned |
| 2 | Results | Sarcopenia stage card, osteoporosis risk card, X-ray with overlay toggle, table of measured values next to cutoffs, suggested actions | planned |
| 3 | Login | Email and password | planned |
| 4 | Patient list and search | Search by name, phone, MRN | planned |
| 5 | New patient | Name, age, sex, height, weight, contact, consent checkbox | planned |
| 6 | Patient profile | Overview, visit history, trend graph, "New screening" button | planned |
| 7 | Screening wizard | 1 Clinical inputs, 2 Handgrip, 3 X-ray upload and quality check, 4 Analysis progress, 5 Results | planned |
| 8 | Report | View and download the PDF | later |
| 9 | Admin: audit log | Table of audit rows | later |
| 10 | Doctor review | Accept or override the stage, notes | later |

Build the Results screen early with placeholder values. It is the screen judges look at longest and the one the deck needs screenshots of.

Screens in the spec that are left out: Studies inbox (Orthanc), Analytics, Devices, Bluetooth pairing, multi-language settings.

### Details from the spec worth keeping

- **Handgrip step:** three trials per hand, typed in. Show the best value and whether it is below the cutoff (28 kg men, 18 kg women) straight away.
- **X-ray step:** if the quality check fails, show the reason and an example of a good image, and ask for another upload.
- **Analysis step:** show progress (segmentation, measurement, risk calculation). If analysis fails, show a retry button.
- **Results:** when the stage comes from rules, there is no probability. Show the stage and the inputs next to their cutoffs; do not show a percentage the backend did not send.
- **Session expired:** refresh silently, otherwise go to login.
- **Every report and results screen** carries the disclaimer that this is a screening aid, not a diagnosis.

## Making it work on every screen

- Design each screen for a phone width first, then let it widen.
- The spec asks for large fonts, high contrast, and tablet use (page 3). Use touch targets of at least 44 px and never rely on colour alone to show risk: add the word (Low, Moderate, High).
- The overlay toggle is two images stacked on top of each other, with the top one shown or hidden. No canvas code is needed.
- X-ray upload is a normal file input: `<input type="file" accept="image/*,.dcm">`. On a phone it offers the camera and the gallery.
- Test on a real phone, not only in the browser's device toolbar.

## Packages

The scaffold already has React, Tailwind, and TypeScript. The spec also lists axios, react-query, react-hook-form, zod, and Recharts (page 23). Add one only when a screen needs it. Recharts is the one that is certainly needed, for the trend graph. The browser's built-in `fetch` covers API calls.

## Mobile and desktop

### Stage 2: installable app (PWA)

Add a manifest. Next.js serves it from a file in the root of `app/`:

```ts
// web/app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SarcoScan",
    short_name: "SarcoScan",
    description: "Sarcopenia and osteoporosis screening",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

Put the two icon files in `web/public/`. The site must be served over HTTPS (or `localhost`) for the browser to offer "Install".

- Android (Chrome): menu, then "Install app".
- Windows or macOS (Chrome or Edge): the install icon in the address bar.
- iPhone (Safari): Share, then "Add to Home Screen".

For most demos this is enough: the app has its own icon and its own window on both phone and desktop.

### Stage 3: real installers (optional)

Only if the judges need an `.exe` or an APK. Both shells open the same server URL and contain no UI code.

- Desktop: [desktop/README.md](../desktop/README.md) (Tauri)
- Mobile: [mobile/README.md](../mobile/README.md) (Capacitor)

## Running it

```
cd web
npm run dev
```

The UI is at http://localhost:3000. The backend must be running on port 8000 for `/api` calls to work.

## The spec document

Nidhi also owns the spec PDF. Two fixes are pending:

- Add the desktop app. The spec does not mention it anywhere.
- Version 2 changed must-have item 7 to manual handgrip entry, but 13 other lines still mention Bluetooth (the architecture diagram, the tech stack table, the BLE device section, the app flow, the mobile navigation, the implementation plan, and the test table).

Keep one spec PDF in `docs/`. When a new version replaces it, update the file name in `README.md`.
