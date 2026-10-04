# backend

Owner: Anish. The FastAPI app, the database models, and every security check.

Status on 2026-10-04: login, patients, the screening flow, doctor review, and the audit log are written and pass 11 tests on SQLite. Not yet run against PostgreSQL. The ML model is not connected. PDF reports are not built.

Read before changing anything: [API](../docs/API.md), [Database](../docs/DATABASE.md), [Security](../docs/SECURITY.md).

## Layout

```
backend/
├── main.py            app object, includes the routers, creates tables at startup
├── config.py          settings from .env
├── db.py              engine and session
├── models.py          SQLAlchemy tables and the append-only triggers for audit_logs
├── schemas.py         Pydantic request and response models
├── crypto.py          AES-256-GCM column type for name and phone, and the phone hash
├── security.py        password hashing, tokens, role and audit dependencies, login rate limit
├── analysis.py        cutoffs, the sarcopenia stage rule, the call into ml/predict.py
├── storage.py         save and find uploaded files
├── routers/
│   ├── auth.py        login, refresh, logout, me
│   ├── patients.py    register, list and search, details
│   ├── visits.py      visit, inputs, grip, X-ray, analyze, result, review, history, files
│   └── admin.py       audit log
├── seed.py            creates the first admin, doctor, and technician
├── tests/test_api.py
├── requirements.txt
└── uploads/           X-rays and overlays at runtime (ignored by git)
```

## Setup

Run everything from the repo root, so that both `backend` and `ml` can be imported.

```
python -m venv .venv
python -m pip --python .venv\Scripts\python.exe install -r backend/requirements.txt
.venv\Scripts\activate
```

The second line installs into the new environment with your main Python's pip. A fresh environment ships an old pip, and on this network that old pip fails with a certificate error.

Copy `.env.example` to `.env` and fill it in. The file explains how to generate each secret.

Start PostgreSQL in Docker. Use the same password as in `DATABASE_URL`:

```
docker run --name sarcoscan-db -e POSTGRES_DB=sarcoscan -e POSTGRES_PASSWORD=change-me -p 5432:5432 -d postgres:15
```

Create the first three users (passwords come from `.env`), then start the API:

```
python -m backend.seed
uvicorn backend.main:app --reload
```

The generated API page is at http://localhost:8000/docs. Use "Authorize" there with the access token from `/auth/login`.

Seed logins: `admin@sarcoscan.local`, `doctor@sarcoscan.local`, `technician@sarcoscan.local`.

## Tests

```
python -m pytest backend
```

They use a temporary SQLite file and their own keys, so they need neither PostgreSQL nor your `.env`.

## Calling the model

`backend/analysis.py` imports `analyze` from `ml/predict.py`. Its arguments and return values are listed in [ML](../docs/ML.md) under "Handing models to the backend". Until that file exists, the analyze endpoint still works: it stores the rule-based sarcopenia stage and leaves the image-based fields empty.

## Packages to add with their features

`reportlab` for the PDF report. The spec also names WeasyPrint, but on Windows it needs extra system libraries (Pango) that `pip` does not install. `pydicom` if DICOM upload is supported.
