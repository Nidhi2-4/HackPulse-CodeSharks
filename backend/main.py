"""SarcoScan API. Start it from the repo root: uvicorn backend.main:app --reload"""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from .db import Base, engine
from .routers import admin, auth, patients, visits


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ponytail: tables are created at startup. Move to Alembic once real data has to survive a schema change.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="SarcoScan API", lifespan=lifespan)
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(visits.router)
app.include_router(admin.router)


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}
