# SarcoScan

**Team CodeSharks · HackPulse**

A screening tool that combines a routine knee AP X-ray with a handgrip test to flag sarcopenia and osteoporosis risk, with no DEXA or CT needed.

> Status on 2026-10-04: the web app and the backend work end to end: sign in, register a patient, enter handgrip and clinical inputs, upload an X-ray, run the screening, doctor review, PDF report. The AI model is not connected yet, so the sarcopenia stage comes from the AWGS 2019 rules and the image-based results are shown as not available. Numbers in this README are targets to validate, not measured results.

## Problem statement

Sarcopenia (age-related loss of muscle mass and strength) is under-diagnosed in elderly patients. Confirming it needs DEXA or CT, which Tier-2 and Tier-3 hospitals often do not have. As a result, patients are diagnosed late, usually after a fall or a fragility fracture.

Two things are already done routinely in these hospitals: knee X-rays and handgrip tests. Nobody combines them to assess muscle health.

## What it does

1. A technician registers the patient and enters handgrip strength (3 trials per hand) and optional clinical inputs (SARC-F, 5-chair-stand time, calf circumference).
2. The technician uploads the knee AP X-ray. The server checks the file and stores it.
3. "Run screening" works out the sarcopenia stage (None / Possible / Probable / Severe). When a model is connected it also gives an osteoporosis risk tier, the soft-tissue-to-bone ratios, and an overlay.
4. The doctor reviews the result, can override the stage, and downloads a one-page PDF report.
5. Each patient's visits build a trend over time.

The claim the project still has to prove is that **X-ray plus grip screens better than grip strength alone**.

### What it is not

- Not a replacement for DEXA. It is a screening and referral tool, not a confirmed diagnosis.
- Not an osteoarthritis diagnosis (the KL grade is an informational bonus).
- Not a treatment prescription.

## Who uses it

| User | What they do |
| --- | --- |
| Technician / nurse | Registers the patient, enters grip, uploads the X-ray, runs the screening |
| Orthopedic or geriatric doctor | Reviews the result, can override the stage, decides on referral |
| Hospital admin | Reads the audit log |

## How it is built

```
Browser (desktop or phone)
        |
  Next.js web app  (frontend/web)      forwards /api to the backend, so there is one origin
        |
  FastAPI backend  (backend)           login, roles, encryption, audit log, screening rules
    |          |             |
PostgreSQL   uploads/     ml/predict.py   (not in the repo yet)
```

The spec also describes a task queue, object storage, PACS integration, FHIR export, and a native mobile app. Those are not built; [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) lists what was left out and when it comes back.

## Repository structure

```
backend/          FastAPI app, database models, security, tests
frontend/web/     Next.js web app (the clinic dashboard and the public site)
frontend/mobile/  Expo template, not started. Phones use the web app for now.
ml/               Training scripts, the four models' weights (not committed), inference code, reports
docs/             Spec, pitch deck, and the design docs listed below
```

## Getting started

Backend, from the repo root (details in [backend/README.md](backend/README.md)):

```
python -m venv .venv
python -m pip --python .venv\Scripts\python.exe install -r backend/requirements.txt
.venv\Scripts\activate
copy .env.example .env        # then fill it in
python -m backend.seed
uvicorn backend.main:app --reload
```

Web app:

```
cd frontend/web
npm install
npm run dev
```

Open http://localhost:3000 and sign in with one of the seed accounts (`technician@sarcoscan.local`, `doctor@sarcoscan.local`, `admin@sarcoscan.local`; passwords are the ones in your `.env`).

Tests: `python -m pytest backend`.

## Documentation

| File | Answers |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the parts fit, and what is cut from the spec and why |
| [docs/PLAN.md](docs/PLAN.md) | Who does what, and what is done |
| [docs/API.md](docs/API.md) | Which endpoints exist and who may call them |
| [docs/DATABASE.md](docs/DATABASE.md) | Tables and columns |
| [docs/SECURITY.md](docs/SECURITY.md) | Login, tokens, roles, encryption, uploads, audit log, and the checklist |
| [docs/ML.md](docs/ML.md) | Datasets, models, checks, results, and how a model plugs into the backend |
| [docs/FRONTEND.md](docs/FRONTEND.md) | The web app: structure, data flow, screens, and the plan for phone and desktop |
| [docs/PITCH.md](docs/PITCH.md) | What the deck may claim, and the demo script |

## Targets to validate

| Metric | Target (pilot) |
| --- | --- |
| Fusion model AUC vs grip alone | Higher, statistically significant (DeLong test) |
| Sensitivity at screening threshold | 85% or higher |
| Osteoporosis AUC vs DXA labels | 0.80 or higher |
| Inference time | Under 5 s on an i5 CPU, 16 GB RAM, no GPU |
| Time per patient | Under 5 minutes |

None of these has been measured yet.

## Data and privacy

Patient X-rays, DICOM files, generated reports, `.env` files, keys, datasets and training checkpoints must never be committed. `.gitignore` covers the common cases; check `git status` before every commit.

## Disclaimer

SarcoScan is a hackathon prototype for research and demonstration. It is not a medical device and must not be used for clinical decisions.
