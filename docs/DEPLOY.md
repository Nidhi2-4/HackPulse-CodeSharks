# Deploying

Owner: Anish. Last updated: 2026-10-04.

Status: files for Render are in the repo (`render.yaml`). Not deployed yet; nothing below has been run against Render.

## What runs where

| Part | Where | Notes |
|---|---|---|
| API | Render web service `sarcoscan-api` | Python, starts with uvicorn |
| Web app | Render web service `sarcoscan-web` | Next.js; forwards `/api` to the API |
| Database | Supabase | the `DATABASE_URL` in `.env.prod` |
| X-ray files | the API's own disk | lost on every redeploy and restart on the free plan |

## Steps

1. Push `main` to GitHub.
2. In Render: New, Blueprint, choose the repo. Render reads `render.yaml` and shows both services.
3. For `sarcoscan-api`, type in `DATABASE_URL`, `JWT_SECRET`, `FIELD_KEY`, `HASH_KEY` from `.env.prod`. Use the same `FIELD_KEY` and `HASH_KEY` as the database was filled with, or stored patient names cannot be read.
4. Deploy the API. Open `https://<api>.onrender.com/api/v1/health`; it should answer `{"status":"ok", ...}`.
5. For `sarcoscan-web`, set `BACKEND_URL` to the API's address (no slash at the end), then deploy. It is read at build time: change it, redeploy.
6. Open the web app and sign in with a seed account. If the database is new, run `python -m backend.seed` once with `ENV_FILE=.env.prod` from your own machine.

## Limits to know before the demo

- **Memory.** The free plan gives 512 MB. Torch plus the four models need more, so `FETCH_MODELS` starts at `0`: the app runs, the stage comes from the rules, and it says "AI model: not connected". Setting it to `1` downloads the models at build time; expect the service to be killed for memory on the free plan. A paid instance with 2 GB, or Hugging Face Spaces, runs them.
- **Sleep.** A free service sleeps after 15 minutes without a request. The next request waits about a minute.
- **Files.** Uploaded X-rays and overlays live on the service's disk and disappear on restart. Results stay in the database; the image then shows "could not be loaded".
- **Login rate limit.** Behind Render the API sees Render's proxy address, not the browser's, so the 5-a-minute limit is shared by everyone. Fine for a demo.
- **Upload size.** Requests pass through the web service to the API. Keep X-rays to a few MB.

## Before going live

- Change the three seed passwords in the production database; they are the same as the local ones.
- Do not set `NEXT_PUBLIC_DEMO_LOGINS` on the web service. It puts passwords into the page.
- The `/demo` page shows made-up numbers. Label it or remove it.
