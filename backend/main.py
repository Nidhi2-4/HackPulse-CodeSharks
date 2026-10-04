"""SarcoScan API. Start it from the repo root: uvicorn backend.main:app --reload"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from .analysis import model_connected
from .db import Base, engine
from .routers import admin, auth, patients, visits


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ponytail: tables are created at startup. Move to Alembic once real data has to survive a schema change.
    Base.metadata.create_all(engine)
    if engine.dialect.name == "postgresql":
        # ponytail: one hand-written schema fix in place of Alembic. Databases created before the phone
        # number became optional still require it. Safe to repeat; drop this once every database has run it.
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE patients ALTER COLUMN phone DROP NOT NULL, ALTER COLUMN phone_hash DROP NOT NULL")
            )
    model_connected()  # load the models now (about 10 s) so the first screening does not wait for it
    yield


app = FastAPI(title="SarcoScan API", lifespan=lifespan)
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(visits.router)
app.include_router(admin.router)


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "model_connected": model_connected()}
