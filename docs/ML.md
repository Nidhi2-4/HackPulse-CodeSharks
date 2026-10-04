# Machine learning

Owner: Pravesh. Last updated: 2026-10-04.

Status: two DenseNet121 classifiers (osteoporosis, KL grade) are trained and connected to the app through `ml/predict.py`. The training script is not in the repo, so the inference preprocessing is unconfirmed, and neither model has an external test or an overlap check. Muscle ratios, overlay, and Grad-CAM are not built.

## What the product needs from ML

| Output | In the spec | Approach | Training data | Status |
|---|---|---|---|---|
| Osteoporosis risk: probability and tier (low, moderate, high) | Must-have 10 | Image classifier (fine-tuned CNN) on the knee X-ray | `osteoporosis/main`, tested on `osteoporosis/external` | done (internal test only) |
| KL osteoarthritis grade, 0 to 4 | Should-have, bonus only | Image classifier (fine-tuned CNN) | `kl_grade/main`, tested on `external` and `cgmh` | done (internal test only) |
| Muscle proxy: four soft-tissue-to-bone ratios | Must-have 5 and 6 | Segmentation mask, then pixel counting | No labelled masks exist | planned |
| Sarcopenia stage (none, possible, probable, severe) | Must-have 9 | AWGS-style rules for now | No public labelled data found | planned |
| X-ray quality check | Must-have 4 | Simple rules first | none needed | planned |
| Heatmap (Grad-CAM) | Must-have 11 | `pytorch-grad-cam` on the osteoporosis CNN | none needed | planned |

Order of work: osteoporosis first (it is a must-have and has data), then the muscle ratios and sarcopenia rules (the product's headline), then KL grade (bonus).

## Datasets

All five are from Kaggle. Unzip each into its folder under `ml/data/`. Git ignores the contents.

| Task | Folder | Dataset | Download | Use |
|---|---|---|---|---|
| Osteoporosis | `osteoporosis/main/` | [mohamedgobara/multi-class-knee-osteoporosis-x-ray-dataset](https://www.kaggle.com/datasets/mohamedgobara/multi-class-knee-osteoporosis-x-ray-dataset) | 1.17 GB | Train and validate |
| Osteoporosis | `osteoporosis/external/` | [majesticd/osteoporosis-x-ray](https://www.kaggle.com/datasets/majesticd/osteoporosis-x-ray) | 182 MB | Test only |
| KL grade | `kl_grade/main/` | [shashwatwork/knee-osteoarthritis-dataset-with-severity](https://www.kaggle.com/datasets/shashwatwork/knee-osteoarthritis-dataset-with-severity) | 204 MB | Train and validate |
| KL grade | `kl_grade/external/` | [peymannejat/osail-knee-osteoarthritis-kl-scoring-dataset](https://www.kaggle.com/datasets/peymannejat/osail-knee-osteoarthritis-kl-scoring-dataset) | 402 MB | Test only |
| KL grade | `kl_grade/cgmh/` | [tommyngx/cgmh-oa](https://www.kaggle.com/datasets/tommyngx/cgmh-oa) | 582 MB | Test only (hospital data, doctor-graded) |

### What the public pages say

Checked on 2026-10-04 from each dataset's published metadata. Nobody has opened the image folders for this file yet.

- **Osteoporosis main:** JPG and PNG images. The description says it is the data of the paper "Knee Osteoporosis Diagnosis Based on Deep Learning" (DOI 10.1007/s44196-024-00615-4) and was "gathered from various sources". It gives no image count.
- **Osteoporosis external:** JPG images plus one Excel file. No description.
- **KL main:** PNG images, organised from the Osteoarthritis Initiative, originally published by Chen (2018) on Mendeley. Made for knee joint detection and KL grading.
- **KL external (OSAIL):** PNG images. No description.
- **CGMH:** PNG images from Chang Gung Memorial Hospital, KL graded.

### The likely common source

The [Knee X-ray Osteoporosis Database](https://data.mendeley.com/datasets/fxjm8fb6mw/2) on Mendeley (Wani and Arora, 2021). Its README states:

- 240 subjects and 239 X-ray images: 36 normal, 154 osteopenia, 49 osteoporosis.
- An Excel sheet with each participant's clinical details and a T-score "obtained from Quantitative Ultrasound System".
- For research use only.

The external osteoporosis set is almost certainly a copy of this database. Both hold JPG images plus an Excel sheet, and the archives are the same size: the Mendeley zip is 190,531,319 bytes, which is 181.7 MiB, the figure Kaggle shows for the external set. If so, the external test set has only 239 images.

The main set was gathered from several sources and probably includes this database as well. Treat overlap between `main` and `external` as likely until the check below says otherwise.

### Things to check before trusting any number

1. **Overlap between `main` and `external`.** If the external set contains images that are also in the training set, the test score will look far better than it is. Run this once per task:

   ```python
   import hashlib, pathlib

   def hashes(folder):
       out = {}
       for p in pathlib.Path(folder).rglob("*"):
           if p.suffix.lower() in {".png", ".jpg", ".jpeg"}:
               out.setdefault(hashlib.md5(p.read_bytes()).hexdigest(), []).append(p)
       return out

   main = hashes("ml/data/osteoporosis/main")
   ext = hashes("ml/data/osteoporosis/external")
   print(len(set(main) & set(ext)), "files appear in both sets")
   ```

   This finds exact copies only. Resized or augmented copies need a perceptual hash (the `imagehash` package). Remove every overlapping image from the test set, and write the count in the Results notes.

2. **Augmented copies inside one dataset.** If file names show that one original was turned into several variants, keep all variants of one original on the same side of the train/validation split.

3. **Where the labels came from.** In the Mendeley database the classes come from a T-score measured by quantitative ultrasound, not by DEXA. The spec's target is "AUC against DXA labels". State this difference in the limits; do not call the model DEXA-validated.

4. **Uneven classes.** The Mendeley source has 36 normal, 154 osteopenia, and 49 osteoporosis images. A model that always answers "osteopenia" already scores 64% accuracy on it. Accuracy alone says little; report recall per class.

5. **No patient-level split.** The spec asks for a patient-level split with no leakage (page 7). A dataset merged from several sources does not say which images belong to the same patient, so that cannot be guaranteed. Say so.

6. **Cropped images.** The main KL dataset was made for joint detection and grading and is understood to be small crops of the knee joint. Crops like that have no soft-tissue edge, so they cannot be used for the muscle ratios. Check which datasets show the full width of the leg before building the ratio pipeline on them.

### Links that do not work

A longer dataset list went round the team on 2026-10-04. These entries were checked and are wrong; do not spend time on them:

| Link | What is there |
|---|---|
| `kaggle.com/datasets/mohamedgobara/knee-osteoporosis-dataset-multiclasses` | Page not found |
| `kaggle.com/datasets/thedevastator/osteoporosis-knee-xray-dataset` | Page not found. A dataset with a similar name exists at `stevepython/osteoporosis-knee-xray-dataset`; its contents have not been checked. |
| `kaggle.com/datasets/vigneshbaskar/bone-xray-image-dataset` | Page not found |
| `zenodo.org/records/6641975` | An unrelated software package for tracking objects in drone videos |
| `oai.ucsf.edu` | The address does not exist. OAI data is at https://nda.nih.gov/oai and needs an NDA account and acceptance of its data-use terms. |

The same list gave image counts and class counts for the Mendeley database (350 images, 120/110/120) and called its T-scores a DEXA proxy. The database's own README says otherwise; use the figures above.

## Training

- **Images go to a CNN.** Fine-tune a pretrained ResNet18 or EfficientNet-B0. Do not feed flattened pixels to a plain fully connected network (ANN) or to XGBoost; both throw away the image structure. X-rays are greyscale; repeat the channel three times to fit the pretrained input.
- **XGBoost is for tables**, such as the fusion step in the spec (ratios, grip, age, sex, BMI, SARC-F, chair stand). That step needs sarcopenia labels, which do not exist yet, so it is not trained in the hackathon build.
- Use mild augmentation only: small rotations, brightness and contrast changes, horizontal flip.
- Classes are uneven. Use class weights in the loss.
- Stop on validation loss, not training loss.

### What to report for each classifier

Report on the internal test split and on the external dataset separately:

- Accuracy and macro-F1
- Recall per class (recall of the osteoporosis class matters most for screening)
- AUC, one class against the rest
- The confusion matrix

Then add a row to the Results table. A model with no row there does not get mentioned on a slide.

### Use the heatmap as a check

Grad-CAM is in the spec as an explanation for doctors. It is also the quickest way to catch a model that cheats. Look at the heatmaps for about 20 test images. If they light up on image corners, text markers, or borders instead of bone, the model has learned a shortcut and its score cannot be trusted.

## Muscle ratios

From the spec (page 6):

1. Segment the image into three classes: 0 background, 1 bone, 2 soft tissue.
2. Find the joint line: the row with the fewest bone pixels in the middle of the image.
3. Measure the tibial plateau width. It is the ruler.
4. Go 0.6 times the plateau width above the joint (thigh level) and below it (calf level). Count bone and soft-tissue pixels on those rows.
5. Output `thigh_soft_to_bone`, `calf_soft_to_bone`, `soft_to_plateau`, `soft_area_ratio`.
6. Save an overlay image: the mask and the measurement lines drawn on the X-ray.

There are no labelled masks to train a U-Net on. Start with thresholds: air is dark, soft tissue is mid-grey, bone is bright, so `skimage.filters.threshold_multiotsu` with three classes gives a rough mask. Call it a heuristic everywhere it is described. Replace it with a trained segmentation model only if someone labels masks.

Thresholding does not work on every image. It fails on white borders, text burned into the picture, very dark or very bright exposures, and images where the other leg is in frame. Reject those at the quality check instead of returning wrong ratios.

## Sarcopenia stage

No public knee X-ray dataset with sarcopenia labels was found, so no model can be trained for this now. The stage comes from rules.

Reference cutoffs:

| Measure | Low when | Source |
|---|---|---|
| Handgrip | below 28 kg (men), below 18 kg (women) | Spec FR-6, AWGS 2019 |
| 5-chair-stand time | 12 seconds or more | AWGS 2019 |
| SARC-F | 4 or more | AWGS 2019 |
| Calf circumference | below 34 cm (men), below 33 cm (women) | AWGS 2019 |

The spec states only the grip cutoff. Check the other three against the AWGS 2019 consensus paper before quoting them.

Proposed rule (prototype, team to confirm):

| Stage | Condition |
|---|---|
| none | Grip normal and chair stand normal |
| possible | Low grip, or slow chair stand |
| probable | Possible, and low muscle proxy from the X-ray |
| severe | Low grip, slow chair stand, and low muscle proxy |

Three honest limits:

- **The cutoff for "low muscle proxy" is not validated.** No study gives a threshold for these X-ray ratios. Whatever value is chosen is a prototype setting and must be described that way.
- **Rules give no probability.** Leave `sarcopenia_prob` empty. Do not show a percentage that was not computed from data. Show the stage and each input next to its cutoff.
- **SHAP does not apply.** SHAP explains a trained tabular model. With rules, the explanation is the table of inputs next to their cutoffs, which is already clearer than a SHAP chart.

## Handing models to the backend

- Put the final model files in `ml/models/`: `osteoporosis_best.pt` and `arthritis_best.pt`. Git ignores `*.pt`, so they are not in the repo; each teammate copies them in by hand from the team's Drive folder: https://drive.google.com/drive/folders/1Zxi-auctfcBx3Jhcx89zlIls5CgT20VN Without them (or without torch) the app runs and shows "AI model: not connected". The `*_last.pt` files are training checkpoints and are not needed.
- Write the inference code in `ml/predict.py`. The backend already calls it (`backend/analysis.py`), so the name and arguments are fixed:

  ```python
  def analyze(image_path: str, age: int, sex: str, bmi: float) -> dict:
  ```

  `sex` is `"male"`, `"female"`, or `"other"`. The image is a PNG or JPG in the uploads folder.

  Return a dict with any of these keys. Leave out, or set to `None`, whatever is not ready:

  | Key | Value |
  |---|---|
  | `model_version` | Short text naming the models used, for example `"osteo-resnet18-0.1"`. Always include it. |
  | `osteoporosis_prob` | Number from 0 to 1 |
  | `osteoporosis_tier` | `"low"`, `"moderate"`, or `"high"` |
  | `thigh_soft_to_bone`, `calf_soft_to_bone`, `soft_to_plateau`, `soft_area_ratio` | Numbers |
  | `low_muscle` | `True` or `False`: is the muscle measure below the prototype threshold |
  | `kl_grade` | 0 to 4 |
  | `overlay_path`, `gradcam_path` | Paths of images written into the same folder as the input image |

  The backend works out the sarcopenia stage itself from grip, chair stand, and `low_muscle`. The model does not return a stage.

  - Load each model once, when the module is imported, not on every call.
  - Raise a clear exception when the image cannot be analysed. The backend turns it into an error message.
  - Until this file exists, the backend stores the rule-based stage and leaves every image-based field empty.
- Any package `ml/predict.py` imports must also be in `backend/requirements.txt`.
- The spec's target is under 5 seconds per study on a CPU with no GPU. Measure it on a laptop and record it.

## Results

Figures are copied from Pravesh's training reports (`models/models/*_report.json`). They were not re-measured.

| Model | Date | Trained on | Internal test | External test | Notes |
|---|---|---|---|---|---|
| Osteoporosis, DenseNet121, 3 classes (`osteoporosis_best.pt`) | 2026-10-04 | 544 train, 69 validation images; started from the KL model's weights | 68 images: accuracy 0.765, macro-F1 0.765, AUC (one-vs-rest) 0.892. Normal vs bone loss: sensitivity 0.915 (43/47), specificity 0.762 (16/21) | not run | Small test set, so wide error margins. Overlap check not recorded. Which dataset the 681 images came from is not recorded. |
| KL grade, DenseNet121, 5 classes (`arthritis_best.pt`) | 2026-10-04 | 8800 train, 1100 validation images | 1100 images: accuracy 0.735, macro-F1 0.752, quadratic kappa 0.862, within one grade 0.955. KL1 recall 0.545 | not run | Random split; images of the same patient may be on both sides. |

How the app uses them: the tier is the predicted class (Normal = low, Osteopenia = moderate, Osteoporosis = high) and `osteoporosis_prob` is the probability of the Osteoporosis class. CPU time on Anish's laptop: about 170 ms per image for both models, about 10 s to load at startup.

## Limits to state in the pitch

- No sarcopenia-labelled data: the stage is rule-based and the muscle proxy is unvalidated.
- Osteoporosis labels come from public datasets whose known source used ultrasound T-scores, not DEXA.
- Small, uneven public datasets, no patient-level split, no clinical validation.
- The source database is marked for research use only.
- It is a screening aid, not a diagnosis (spec page 1).
