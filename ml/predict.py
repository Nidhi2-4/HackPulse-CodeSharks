"""Inference code the backend calls. See "Handing models to the backend" in docs/ML.md.

Both models are DenseNet121 classifiers trained by Pravesh (reports in models/models/).
The weight files are not in git: copy osteoporosis_best.pt and arthritis_best.pt into ml/models/.
"""
from pathlib import Path

import torch
import torchvision
from PIL import Image
from torchvision import transforms

MODELS = Path(__file__).parent / "models"
MODEL_VERSION = "osteo-densenet121-0.1+kl-densenet121-0.1"

# TODO(Pravesh): confirm this matches the eval transform in the training script. The script is
# not in the repo, so this is the usual ImageNet setup. A different resize or normalisation
# shifts the probabilities (measured: osteopenia 0.47 to 0.58 on one sample across variants).
_PREPROCESS = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)

# The classifier's three classes map straight onto the three tiers. No cutoff is chosen here.
_TIER = {"Normal": "low", "Osteopenia": "moderate", "Osteoporosis": "high"}


def _load(name: str) -> tuple[torch.nn.Module, list[str]]:
    # weights_only=True refuses anything in the file that is not plain tensors and names.
    checkpoint = torch.load(MODELS / name, map_location="cpu", weights_only=True)
    classes = checkpoint["classes"]
    model = torchvision.models.densenet121(weights=None)
    model.classifier = torch.nn.Sequential(
        torch.nn.Dropout(0.3), torch.nn.Linear(model.classifier.in_features, len(classes))
    )
    model.load_state_dict(checkpoint["model"])
    return model.eval(), classes


_osteo, _osteo_classes = _load("osteoporosis_best.pt")
_kl, _kl_classes = _load("arthritis_best.pt")


def analyze(image_path: str, age: int, sex: str, bmi: float) -> dict:
    """age, sex, and bmi are accepted but unused: both models look at the image only."""
    with Image.open(image_path) as image:
        batch = _PREPROCESS(image.convert("RGB")).unsqueeze(0)
    with torch.inference_mode():
        osteo = torch.softmax(_osteo(batch), dim=1)[0]
        kl = torch.softmax(_kl(batch), dim=1)[0]
    return {
        "model_version": MODEL_VERSION,
        "osteoporosis_prob": float(osteo[_osteo_classes.index("Osteoporosis")]),
        "osteoporosis_tier": _TIER[_osteo_classes[int(osteo.argmax())]],
        "kl_grade": int(_kl_classes[int(kl.argmax())].removeprefix("KL")),
        # Not built yet: muscle ratios, low_muscle, overlay, Grad-CAM.
    }
