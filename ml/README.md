# ml

Owner: Pravesh. Datasets, training, and the inference code the backend calls.

Everything about the models, the datasets, and how to report results is in [docs/ML.md](../docs/ML.md). Read it first.

## Layout

```
ml/
├── data/                  Kaggle datasets. Folders are in git, contents are ignored.
│   ├── osteoporosis/
│   │   ├── main/          train and validate
│   │   └── external/      test only
│   └── kl_grade/
│       ├── main/          train and validate
│       ├── external/      test only
│       └── cgmh/          test only (hospital data, doctor-graded)
├── notebooks/             training notebooks and scripts
├── models/                final models the backend loads. Committed. Under 100 MB each.
└── predict.py             functions the backend imports (not written yet)
```

## Rules

- Training checkpoints stay out of git. Only the final model goes in `models/`.
- A model is not mentioned anywhere until its numbers are in the Results table in `docs/ML.md`.
- Check for overlap between `main` and `external` before reporting a test score.
