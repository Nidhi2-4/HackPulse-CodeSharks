import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import AuditLog, RefreshToken, Role, User
from ..schemas import AuditOut, UserActiveIn, UserAdminOut, UserIn
from ..security import Audit, hash_password, require_roles

router = APIRouter(prefix="/api/v1", tags=["admin"])


@router.get("/audit-logs", response_model=list[AuditOut])
def audit_logs(
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.admin)),
):
    return db.scalars(select(AuditLog).order_by(AuditLog.id.desc()).limit(limit)).all()


# There is no public sign-up: an account opens patient records, so only an admin creates one.


@router.get("/users", response_model=list[UserAdminOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_roles(Role.admin))):
    return db.scalars(select(User).order_by(User.created_at)).all()


@router.post("/users", response_model=UserAdminOut, status_code=status.HTTP_201_CREATED)
def create_user(
    body: UserIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.admin)),
    audit: Audit = Depends(),
):
    email = body.email.strip().lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    user = User(name=body.name.strip(), email=email, role=body.role, password_hash=hash_password(body.password))
    db.add(user)
    db.flush()
    audit.log(admin, "CREATE", "user", user.id)
    db.commit()
    return user


@router.patch("/users/{user_id}", response_model=UserAdminOut)
def set_user_active(
    user_id: uuid.UUID,
    body: UserActiveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.admin)),
    audit: Audit = Depends(),
):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such user")
    if user.id == admin.id and not body.is_active:
        raise HTTPException(status.HTTP_409_CONFLICT, "You cannot switch off your own account")
    user.is_active = body.is_active
    if not body.is_active:  # end their sessions now, not when the access token runs out
        db.execute(update(RefreshToken).where(RefreshToken.user_id == user.id).values(revoked=True))
    audit.log(admin, "UPDATE", "user", user.id)
    db.commit()
    return user
