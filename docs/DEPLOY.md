# Deploying

Owner: Anish. Last updated: 2026-10-04.

Status: files for Render are in the repo (`render.yaml`). The API is live at https://hackpulse-codesharks.onrender.com. On 2026-10-04 one full screening was run against it: all four models answered, with the same result as on the laptop. The analysis took 45 seconds there (about 0.3 on the laptop).

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

## Render settings (when the service was made by hand, not from the blueprint)

| Setting | API service | Web service |
|---|---|---|
| Root Directory | empty | `frontend/web` |
| Build Command | `pip install -r requirements.txt` | `npm ci && npm run build` |
| Start Command | `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT` | `npm start` |

The API must run from the repo root. With Root Directory set to `backend`, the start fails with `No module named 'backend'`.

## Limits to know before the demo

- **Memory.** The free plan gives 512 MB. The four model files are in the repo and load at start. All four need more than 512 MB, and the service is then killed while starting (the log ends with "No open ports detected" or "Out of memory"). Set `SARCOSCAN_MODELS` on the API service and redeploy, trying in this order until it stays up: `xray,tabular` (everything), `xray` (osteoporosis, KL grade, overlay), `tabular` (muscle mass and bone loss from measurements), `none` (rules only). The app says which part is not connected. A 2 GB instance runs everything.

  Measured on Anish's Windows laptop on 2026-10-04 (process memory after one screening; Linux will differ somewhat):

  | `SARCOSCAN_MODELS` | Peak memory |
  |---|---|
  | `xray,tabular` | 669 MB |
  | `xray` | 490 MB |
  | `tabular` | 278 MB |
  | `none` | 125 MB |

  So all four do not fit in 512 MB, `xray` is at the edge, and `tabular` fits with room to spare.
- **Sleep.** A free service sleeps after 15 minutes without a request. The next request waits about a minute. An uptime monitor (UptimeRobot, every 5 minutes) pointed at `/api/v1/ping` keeps it awake.
- **Files.** Uploaded X-rays and overlays live on the service's disk and disappear on restart. Results stay in the database; the image then shows "could not be loaded".
- **Login rate limit.** Behind Render the API sees Render's proxy address, not the browser's, so the 5-a-minute limit is shared by everyone. Fine for a demo.
- **Upload size.** Requests pass through the web service to the API. Keep X-rays to a few MB.

## Before going live

- Change the three seed passwords in the production database; they are the same as the local ones.
- Do not set `NEXT_PUBLIC_DEMO_LOGINS` on the web service. It puts passwords into the page.
- The `/demo` page shows made-up numbers. Label it or remove it.
