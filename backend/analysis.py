"""Cutoffs, the sarcopenia stage rule, and the call into the ML code. See docs/ML.md."""
from pathlib import Path

from .models import Stage

# AWGS 2019.
GRIP_CUTOFF_KG = {"male": 28.0, "female": 18.0}
CHAIR_STAND_SLOW_SEC = 12.0
SARCF_POSITIVE = 4


def grip_cutoff(sex: str) -> float:
    # ponytail: AWGS gives a cutoff for men and for women only. "other" uses the lower one
    # until a clinician decides what it should be.
    return GRIP_CUTOFF_KG.get(sex, GRIP_CUTOFF_KG["female"])


def sarcopenia_stage(
    sex: str, grip_kg: float | None, chair_stand_sec: float | None, low_muscle: bool | None
) -> Stage:
    """The rule in docs/ML.md. low_muscle is None when no image measurement exists."""
    low_grip = grip_kg is not None and grip_kg < grip_cutoff(sex)
    slow = chair_stand_sec is not None and chair_stand_sec >= CHAIR_STAND_SLOW_SEC
    if not (low_grip or slow):
        return Stage.none
    if not low_muscle:
        return Stage.possible
    return Stage.severe if (low_grip and slow) else Stage.probable


def run_model(image_path: Path, age: int, sex: str, bmi: float) -> dict:
    """Call ml/predict.py. Returns {} while that file is not in the repo yet."""
    try:
        from ml.predict import analyze
    except ModuleNotFoundError as error:
        if error.name in ("ml", "ml.predict"):
            return {}
        raise  # predict.py exists but one of its own imports is missing: that is a real error
    return analyze(image_path=str(image_path), age=age, sex=sex, bmi=bmi)
