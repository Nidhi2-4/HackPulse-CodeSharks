"""Create the first admin and doctor. Run from the repo root: python -m backend.seed

With --demo it also creates the public demo doctor shown on the sign-in page (frontend/web/src/lib/demo.ts).
Use --demo only on a database that holds made-up patients.
"""
import os
import sys

from sqlalchemy import select

from .db import Base, SessionLocal, engine
from .models import Role, User
from .security import hash_password

USERS = (
    ("Sunita Nair", "admin@sarcoscan.local", Role.admin, "SEED_ADMIN_PASSWORD"),
    ("Dr. Arvind Rao", "doctor@sarcoscan.local", Role.doctor, "SEED_DOCTOR_PASSWORD"),
)
# Public on purpose: the sign-in page shows it. Keep in step with frontend/web/src/lib/demo.ts.
DEMO_DOCTOR = ("Demo Doctor", "demo@doctor.com", Role.doctor, "demo@123")


def main() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        for name, email, role, variable in USERS:
            if db.scalar(select(User.id).where(User.email == email)):
                continue
            password = os.environ.get(variable, "")
            if len(password) < 8:
                raise SystemExit(f"{variable} must be set in .env and be at least 8 characters long.")
            db.add(User(name=name, email=email, password_hash=hash_password(password), role=role))
        if "--demo" in sys.argv:
            name, email, role, password = DEMO_DOCTOR
            if db.scalar(select(User.id).where(User.email == email)):
                print(f"The demo doctor {email} already exists.")
            else:
                db.add(User(name=name, email=email, password_hash=hash_password(password), role=role))
                print(f"Created the demo doctor {email}.")
        db.commit()
    print("Seed users are ready.")


if __name__ == "__main__":
    main()
