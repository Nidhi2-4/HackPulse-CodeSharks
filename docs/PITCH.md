# Pitch and demo

Owner: Soham. Last updated: 2026-10-04.

Status: no deck yet. This file is the outline and the rules for what the deck may claim.

## The one rule

Judges trust a team that says exactly what it built. Every number and every "we have" on a slide must be true on the day.

- The spec's figures (85% sensitivity, osteoporosis AUC 0.80, under 5 seconds, under 5 minutes per patient) are **targets**. The spec says so itself on page 4. Write "target" next to them.
- A measured result goes on a slide only if it is in the Results table in `ML.md`.
- Say "prototype" for the sarcopenia stage and the muscle ratios. They are rule-based and unvalidated (`ML.md`).
- Do not show the Bluetooth dynamometer or its cost as something built. Spec version 2 moved handgrip to manual entry.
- Do not list a security feature that is still `planned` in the checklist in `SECURITY.md`.
- Say "built around DPDP principles", not "DPDP compliant". Say "append-only audit log", not "immutable" or "tamper-proof".
- Say "trained on public datasets labelled from ultrasound T-scores". Do not say "validated against DEXA".

## Slide outline

| # | Slide | Content | Source |
|---|---|---|---|
| 1 | Title | SarcoScan, team CodeSharks, one-line pitch | Spec page 1 |
| 2 | Problem | Sarcopenia is under-diagnosed: confirmation needs DEXA or CT, which smaller hospitals lack. Patients are found late, after falls or fractures. | Spec page 1 |
| 3 | Idea | Knee X-rays and handgrip tests are already routine. Combine them to flag risk. | Spec page 1 |
| 4 | How it works | The screening flow in 5 steps, with a screenshot of each | `ARCHITECTURE.md` |
| 5 | What the AI does | Osteoporosis classifier, muscle ratios, sarcopenia rules, overlay | `ML.md` |
| 6 | Architecture | One secure API, one UI, three ways to open it (web, mobile, desktop) | `ARCHITECTURE.md` |
| 7 | Security and privacy | On-premise, role-based access, audit log, what is built today | `SECURITY.md` |
| 8 | Results | Measured numbers only, with the dataset they were measured on | `ML.md` Results |
| 9 | Limits and validation plan | What is not validated, and how a hospital pilot would validate it | `ML.md`, spec page 7 |
| 10 | Next steps | Labelled data from a partner hospital, pilot, PACS integration | Spec page 4 |

## Prior work

One study supports the core idea that plain X-rays carry a muscle signal:

> Deep Learning-Based Muscle Segmentation and Quantification of Full-Leg Plain Radiograph for Sarcopenia Screening in Patients Undergoing Total Knee Arthroplasty. Journal of Clinical Medicine, 2022. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9267147/

Read the abstract and quote the paper's own numbers. Note the difference when citing it: that study used full-leg radiographs, and SarcoScan uses a knee view, which shows much less muscle.

## Demo script

Run it in this order. Each step should take a few seconds.

1. Log in as a technician.
2. Search for a patient, then register a new one.
3. Start a screening. Enter clinical inputs.
4. Enter handgrip trials. Show the best value marked against the cutoff.
5. Upload a knee X-ray. Show the quality check passing.
6. Analyze. Show the results screen: stage, risk tier, overlay, values next to cutoffs.
7. Download the report.
8. Open the patient's history and show the trend graph.
9. Open the same screen on a phone, and as an installed desktop app.
10. Log in as a role that is not allowed to do something, and show it being refused.

## Before the day

- Use only public dataset images and made-up patient names.
- Pick 3 to 5 X-rays that the system handles well, and one it rejects at the quality check.
- Record the whole script as a video once it works. If the live demo breaks, play the video.
- Rehearse with the internet off if the pitch says "works without internet".

## Questions judges are likely to ask

| Question | Honest answer |
|---|---|
| How accurate is it? | Give the measured numbers for the osteoporosis classifier and name the dataset. The sarcopenia stage is rule-based on published cutoffs; it has no accuracy figure yet. |
| Is it clinically validated? | No. It is a prototype. Validation needs X-rays paired with DEXA results from a partner hospital. |
| Why would a knee X-ray show muscle? | Soft tissue around the bone is visible on the image. Cite the prior work, and say the knee view is a weaker signal than a full leg. |
| Fat looks like muscle on an X-ray. | Correct, and the spec lists it as the first risk (page 4). That is why grip strength and BMI are part of the decision. |
| How is patient data protected? | It stays on the hospital's own server. List only the controls that are built. |
| Does it replace DEXA? | No. It decides who should be referred for DEXA. |
