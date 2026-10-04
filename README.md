# SarcoScan

<<<<<<< HEAD
**Team CodeSharks · HackPulse**

An on-premise AI screening tool that combines a routine knee AP X-ray with a 10-second handgrip test to flag sarcopenia and osteoporosis risk, with no DEXA or CT needed.

> Status: early development. The repository currently holds the project structure and the web and mobile app scaffolds. Numbers in this README are targets to validate, not measured results.

## Problem statement

Sarcopenia (age-related loss of muscle mass and strength) is under-diagnosed in elderly patients. Confirming it needs DEXA or CT, which Tier-2 and Tier-3 hospitals often do not have. As a result, patients are diagnosed late, usually after a fall or a fragility fracture.

Two things are already done routinely in these hospitals: knee X-rays and handgrip tests. Nobody combines them to assess muscle health.

## What we are solving

SarcoScan turns data the hospital already collects into a screening and referral decision:

1. A technician uploads the patient's knee AP X-ray and enters handgrip strength (3 trials per hand).
2. The system segments bone and soft tissue on the X-ray and measures soft-tissue-to-bone ratios at thigh and calf level as a proxy for muscle.
3. A fusion model combines those image features with grip strength, age, sex, BMI and optional clinical inputs (SARC-F, 5-chair-stand time, calf circumference).
4. The doctor gets a sarcopenia stage (No / Possible / Probable / Severe), an osteoporosis risk tier (Low / Moderate / High) from the proximal tibia, an explainable overlay, and a printable report.

The core claim we need to prove is that **X-ray plus grip screens better than grip strength alone**.

### What it is not

- Not a replacement for DEXA. It is a screening and referral tool, not a confirmed diagnosis.
- Not an osteoarthritis diagnosis (the KL grade is an informational bonus).
- Not a treatment prescription.

## Who uses it

| User | What they do |
| --- | --- |
| Technician / nurse | Registers the patient, captures grip, uploads the X-ray |
| Orthopedic or geriatric doctor | Reviews the result, can override the AI stage, decides on referral |
| Hospital admin | Manages users and devices, views audit logs |
| Patient / caregiver | Views their own report and trend (mobile, read-only) |

## Key features (MVP)

- Login with role-based access (doctor, technician, admin)
- Patient registration and visit history
- Knee X-ray upload (DICOM, JPG, PNG) with a quality check for wrong view or cropped edges
- AI segmentation of femur, tibia and soft tissue, with overlay
- Handgrip entry compared against AWGS 2019 cutoffs (below 28 kg male, below 18 kg female)
- Fusion model giving sarcopenia probability and stage
- Osteoporosis risk probability and tier
- Explainability: Grad-CAM heatmap and measured values against cutoffs
- Standardized PDF report with suggested actions
- Trend graphs across visits, doctor override, audit log

Planned after the MVP: Orthanc PACS integration, FHIR DiagnosticReport export, KL grade, Hindi UI, offline mobile mode.

## Targets to validate

| Metric | Target (pilot) |
| --- | --- |
| Fusion model AUC vs grip alone | Higher, statistically significant (DeLong test) |
| Sensitivity at screening threshold | 85% or higher |
| Osteoporosis AUC vs DXA labels | 0.80 or higher |
| Inference time | Under 5 s on an i5 CPU, 16 GB RAM, no GPU |
| Time per patient | Under 5 minutes |

## Architecture

Everything runs in Docker Compose on a single on-premise machine, so it works on a hospital LAN without internet and patient data never leaves the site.

```
[Web App]   [Mobile App + BLE Grip Device]
      \        /
   [Nginx reverse proxy, HTTPS]
              |
      [FastAPI Backend]---[Redis queue]---[Celery Worker: ML Inference]
        |        |                               |
 [PostgreSQL] [MinIO]                 [ONNX / OpenVINO models]
        |
 [Orthanc PACS] <--- DICOM from hospital X-ray machine
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Web | Next.js, TypeScript, Tailwind CSS, Recharts |
| Mobile | React Native (Expo), TypeScript, react-native-ble-plx |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Alembic, Celery, Redis |
| Data | PostgreSQL 15, MinIO, Orthanc |
| ML training | PyTorch, MONAI, U-Net, XGBoost, scikit-learn |
| ML inference | ONNX Runtime, OpenVINO (CPU only) |
| Grip hardware | ESP32, HX711, load cell (about INR 1.5k) |

## Repository structure

```
backend/     FastAPI app (api, models, schemas, services, workers, core)
frontend/
  web/       Next.js dashboard for clinic and admin use
  mobile/    Expo app for grip capture and quick screening
ml/          Training code, notebooks
firmware/    ESP32 grip dynamometer firmware
infra/       Docker Compose, Nginx, Orthanc config
docs/        Project documents
```

## Getting started

Web:

```bash
cd frontend/web
npm install
npm run dev
```

Mobile (BLE needs a dev build, not Expo Go):

```bash
cd frontend/mobile
npm install
npx expo start
```

Backend, ML and infra setup will be added as those parts are built.

## Data and privacy

Patient X-rays, DICOM files, generated reports, `.env` files, keys and model weights are excluded by `.gitignore` and must never be committed. Copy `.env.example` to `.env` for local configuration once it exists.

## Disclaimer

SarcoScan is a hackathon prototype for research and demonstration. It is not a medical device and must not be used for clinical decisions.
=======
An on-premise AI screening tool that combines a routine knee AP X-ray with a 10-second handgrip test to flag sarcopenia and osteoporosis risk, with no DEXA or CT needed. Built by team CodeSharks for HackPulse.

Status on 2026-10-04: the backend is written and passes its tests. The web app is being built. No model is connected yet. Progress is tracked in [docs/PLAN.md](docs/PLAN.md).

Full spec: [docs/Documentation - SarcoScan (2).pdf](docs/Documentation%20-%20SarcoScan%20%282%29.pdf)

## Start here

| You are | Read |
|---|---|
| New to the project | [Architecture](docs/ARCHITECTURE.md), then [Plan](docs/PLAN.md) |
| Anish (backend) | [backend/README.md](backend/README.md), [API](docs/API.md), [Database](docs/DATABASE.md), [Security](docs/SECURITY.md) |
| Pravesh (models) | [ml/README.md](ml/README.md), [ML](docs/ML.md) |
| Nidhi (UI, mobile, desktop) | [Frontend](docs/FRONTEND.md), [desktop/README.md](desktop/README.md), [mobile/README.md](mobile/README.md) |
| Soham (pitch) | [Pitch](docs/PITCH.md) |

## Layout

```
.
├── backend/           Anish     FastAPI app, PostgreSQL models, security
│   └── uploads/                 X-rays at runtime, not committed
├── ml/                Pravesh   datasets, training, models, inference
│   ├── data/                    Kaggle datasets, contents not committed
│   ├── notebooks/               training notebooks and scripts
│   └── models/                  final models the backend loads
├── web/               Nidhi     Next.js UI, the only UI codebase
├── mobile/            Nidhi     notes now, Capacitor shell later
├── desktop/           Nidhi     notes now, Tauri shell later
└── docs/              everyone  spec, design docs, plan, pitch
```

`web/` is not in the repo yet. The command that creates it needs the folder to be missing or empty; it is in [docs/FRONTEND.md](docs/FRONTEND.md).

## Documentation

| File | Answers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the parts fit, how web, mobile, and desktop share one UI, what is cut from the spec and why |
| [docs/PLAN.md](docs/PLAN.md) | Who does what, in which order, and what is done |
| [docs/API.md](docs/API.md) | Which endpoints exist, who may call them, their status |
| [docs/DATABASE.md](docs/DATABASE.md) | Tables and columns |
| [docs/SECURITY.md](docs/SECURITY.md) | Login, tokens, roles, uploads, audit log, and the checklist |
| [docs/ML.md](docs/ML.md) | Datasets, models, checks, results, and the hand-off to the backend |
| [docs/FRONTEND.md](docs/FRONTEND.md) | Creating the web app, screens, login on the client, PWA, shells |
| [docs/PITCH.md](docs/PITCH.md) | Slide outline, demo script, and what the deck may claim |

Each doc has one owner and a "Last updated" date at the top. When a change makes a doc wrong, fix the doc in the same commit.

## Before you commit

Never commit `.env` files, datasets, zip files, real patient X-rays, or training checkpoints. Only final models go in `ml/models/`, and GitHub rejects any file over 100 MB. Team rules are in [docs/PLAN.md](docs/PLAN.md) under "Working together".
>>>>>>> 3cdcd58 (chore: sync root docs and gitignore)
