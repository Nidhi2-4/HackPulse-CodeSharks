"""Where uploaded X-rays and overlays are kept. Supports local disk and Cloudinary."""
import logging
import shutil
import uuid
from pathlib import Path
from typing import BinaryIO

from .config import settings

logger = logging.getLogger(__name__)

# Configure Cloudinary if URL is available
_cloudinary_configured = False
if settings.cloudinary_url:
    try:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(cloudinary_url=settings.cloudinary_url)
        _cloudinary_configured = True
    except Exception as e:
        logger.warning("Failed to configure Cloudinary: %s", e)


def save(source: BinaryIO, suffix: str) -> str:
    """Store a file locally (so ML can read it fast) and mirror to Cloudinary if enabled."""
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    key = f"{uuid.uuid4().hex}{suffix}"
    local_path = settings.upload_dir / key

    with open(local_path, "wb") as target:
        shutil.copyfileobj(source, target)

    # Mirror to Cloudinary if active
    if _cloudinary_configured and settings.storage_backend == "cloudinary":
        try:
            import cloudinary.uploader

            cloudinary.uploader.upload(
                str(local_path),
                public_id=Path(key).stem,
                folder="sarcoscan",
                resource_type="auto",
            )
        except Exception as e:
            logger.error("Cloudinary upload failed: %s", e)

    return key


def path(key: str) -> Path:
    # Keys come from save(). Anything with a folder in it is refused, so a bad row cannot point outside uploads.
    if Path(key).name != key:
        raise ValueError("Not a storage key")
    return settings.upload_dir / key


def get_url(key: str) -> str | None:
    """Returns Cloudinary URL if configured, else None (served via local endpoint)."""
    if _cloudinary_configured and settings.storage_backend == "cloudinary":
        try:
            import cloudinary.utils

            url, _ = cloudinary.utils.cloudinary_url(
                f"sarcoscan/{Path(key).stem}",
                resource_type="image",
                secure=True,
            )
            return url
        except Exception:
            return None
    return None
