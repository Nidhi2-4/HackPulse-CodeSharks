# Plan

Owner: everyone. Last updated: 2026-10-04.

This is the task list. Tick a box when the thing works, not when it is started. Update it in the same commit as the work.

## Team

| Person | Area | Folder |
|---|---|---|
| Anish | Backend, database, security | `backend/` |
| Pravesh | Models and inference | `ml/` |
| Nidhi | Web UI, mobile and desktop, spec document | `web/`, `mobile/`, `desktop/` |
| Soham | Pitch deck and demo | `docs/` |

## Milestones

| # | Milestone | Done when |
|---|---|---|
| M0 | Repo ready | First commit is on GitHub and all four can push |
| M1 | One flow works | Log in, create a patient, enter grip, upload an X-ray, see a result screen, all through the real API and database. The model output may be a placeholder. |
| M2 | Real pieces | Osteoporosis model, muscle ratios, sarcopenia rules, overlay, history graph, PDF report |
| M3 | Ready to show | Security checklist done, PWA installs, demo data loaded, backup video recorded, deck final |

M1 comes before making any single piece good. Joining the parts on the last day is how hackathon demos fail.

## Anish

Ticked items pass the tests in `backend/tests/` on SQLite.

- [x] FastAPI confirmed as the backend framework
- [ ] First commit and push (M0)
- [ ] PostgreSQL running in Docker, and the API run against it
- [x] `.env.example` written
- [x] The 9 tables in `DATABASE.md`
- [x] Auth: argon2, login, refresh with rotation, logout, me
- [x] Seed script: one admin, one doctor, one technician
- [x] Shared role dependency and audit dependency
- [x] Patient endpoints
- [x] Visit, clinical inputs, and grip endpoints
- [x] X-ray upload with size, type, and name checks (PNG and JPG)
- [x] X-ray and overlay served through authenticated endpoints
- [x] Analyze endpoint calling `ml/predict.py`, and result endpoint. The model is not connected yet; see `API.md`.
- [x] History endpoint
- [x] Doctor review endpoint
- [ ] PDF report
- [x] Test: each role is refused where `SECURITY.md` says No
- [ ] Append-only triggers on `audit_logs`: written, not yet run on PostgreSQL
- [x] Name and phone encryption, with `phone_hash` for search
- [ ] Cloudinary copies of X-rays made private (`SECURITY.md` checklist item 17)
- [ ] DICOM uploads converted to PNG (only if DICOM upload is supported)
- [ ] `docker-compose.yml` with database, backend, and web (M3)

## Pravesh

- [ ] Write in `ML.md` what is being trained and on which dataset
- [ ] Overlap check between `main` and `external` for both tasks
- [ ] Osteoporosis classifier with metrics on internal and external test sets
- [ ] Final model in `ml/models/`, row added to Results in `ML.md`
- [ ] `ml/predict.py` with a function the backend can call (M1, a placeholder is fine at first)
- [ ] Muscle ratios with a threshold mask, and the overlay image
- [ ] Sarcopenia stage rules
- [ ] Heatmap (Grad-CAM)
- [ ] KL grade classifier (bonus)
- [ ] Time one analysis on a laptop CPU

## Nidhi

- [ ] Create `web/` with the command in `FRONTEND.md`
- [ ] App shell that works on a phone screen
- [ ] Results screen with placeholder data
- [ ] Login and token handling
- [ ] Patient list, new patient, patient profile
- [ ] Screening wizard: clinical inputs, handgrip, X-ray upload, progress, results (M1)
- [ ] History graph
- [ ] PWA manifest and icons
- [ ] Spec PDF: add the desktop app, remove the 13 leftover Bluetooth lines
- [ ] Optional: Tauri shell in `desktop/`, Capacitor shell in `mobile/`

## Soham

- [ ] Deck skeleton from `PITCH.md`
- [ ] Architecture slide from `ARCHITECTURE.md`
- [ ] 3 to 5 sample X-rays for the demo, from the public datasets only
- [ ] Demo script
- [ ] Screenshots once M1 works
- [ ] Backup demo video
- [ ] Final check of every number on every slide against `ML.md`

## Working together

- Work in your own folder. If you need a change in someone else's, ask them.
- Work on a branch named `yourname/topic`. Merge into `main` at least once a day. Pull before you push.
- Small commits with a message that says what changed.
- Ten minutes every day: what is done, what is next, who is waiting on whom.
- When a change makes a doc wrong, fix the doc in the same commit.
- Never commit `.env`, datasets, zip files, real patient X-rays, or training checkpoints.

## Left out on purpose

Mobile app in React Native, Bluetooth dynamometer, Orthanc, FHIR, Celery and Redis, MinIO, multi-language UI, patient login. See "What we build first" in `ARCHITECTURE.md` for when each comes back.

## Open questions

| Question | Who decides |
|---|---|
| When is the submission deadline? | Team. The milestones have no dates until this is known. |
| Where does the demo run: a laptop or a cloud server? Files stay on local disk either way, with a Cloudinary copy if it is hosted. | Anish |
| Two AI assistants have edited `backend/` at the same time. Which one writes backend code from here on? | Anish |
| Do the judges need real installers, or is PWA install enough? | Team |
| Which value counts as "low muscle proxy"? | Pravesh |
