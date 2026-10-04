import jsPDF from "jspdf";
import { api } from "./api";
import { CHAIR_CUTOFF, SEX_LABEL, STAGE, TIER, finalStage, type Patient, type Screening } from "./store";

// The built-in PDF fonts only cover Latin-1, so every string here sticks to plain characters.

/** The uploaded X-ray as a JPEG data URL, or null if it cannot be fetched. */
async function xrayAsJpeg(xrayId: string): Promise<{ data: string; width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(await api.blob(`/xrays/${xrayId}/image`));
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
    return { data: canvas.toDataURL("image/jpeg", 0.85), width: bitmap.width, height: bitmap.height };
  } catch {
    return null;
  }
}

/** Build the one-page screening report from what the backend stored, and download it. */
export async function downloadReport(patient: Patient, s: Screening): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const left = 14;
  const right = width - 14;
  let y = 0;

  const heading = (text: string) => {
    y += 9;
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(30, 41, 59);
    doc.text(text, left, y);
    y += 2;
    doc.setDrawColor(203, 213, 225).line(left, y, right, y);
    y += 6;
  };
  const row = (label: string, value: string, note = "") => {
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(30, 41, 59);
    doc.text(label, left, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 78, y);
    if (note) doc.setTextColor(100, 116, 139).text(note, 118, y);
    y += 6;
  };
  const flag = (low: boolean) => (low ? "Flagged" : "Normal");

  // Title bar
  doc.setFillColor(30, 41, 59).rect(0, 0, width, 22, "F");
  doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(255, 255, 255);
  doc.text("SarcoScan screening report", left, 10);
  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Screening aid for sarcopenia and osteoporosis risk. Not a diagnosis.", left, 16);
  y = 24;

  heading("Patient and visit");
  row("Patient", `${patient.name} (${patient.mrn})`);
  row("Age, sex", `${patient.age} years, ${SEX_LABEL[patient.sex]}`);
  row("Height, weight, BMI", `${patient.heightCm} cm, ${patient.weightKg} kg, BMI ${s.bmi.toFixed(1)}`);
  row("Screening date", s.date);
  row("Screened by", s.by);
  row("Status", s.finalized ? `Reviewed by ${s.reviewedBy ?? "doctor"}` : "Pending doctor review");

  heading("Result");
  row("Sarcopenia stage", STAGE[finalStage(s)].label, "AWGS 2019 rules");
  if (s.override) row("System's stage", STAGE[s.stage].label, `changed by ${s.override.by}`);
  row(
    "Osteoporosis risk",
    s.osteoTier ? TIER[s.osteoTier].label : "Not available",
    s.osteoProb === null ? "needs the AI model" : `model probability ${Math.round(s.osteoProb * 100)}%`,
  );

  heading("Measured values");
  row(
    "Best handgrip",
    s.bestGrip === null ? "Not entered" : `${s.bestGrip} kg`,
    s.bestGrip === null ? "" : `flag below ${s.gripCutoff} kg: ${flag(s.bestGrip < s.gripCutoff)}`,
  );
  if (s.chairStand != null) row("5-chair-stand time", `${s.chairStand} s`, `flag at ${CHAIR_CUTOFF} s or more: ${flag(s.chairStand >= CHAIR_CUTOFF)}`);
  if (s.sarcF != null) row("SARC-F score", `${s.sarcF}`, `flag at 4 or more: ${flag(s.sarcF >= 4)}`);
  if (s.calfCm != null) row("Calf circumference", `${s.calfCm} cm`);
  const ratio = (x: number | null) => (x === null ? "Not available" : x.toFixed(2));
  row("Thigh soft tissue to bone", ratio(s.features.thigh), "prototype measure, no cutoff");
  row("Calf soft tissue to bone", ratio(s.features.calf), "prototype measure, no cutoff");

  if (!s.modelConnected) {
    y += 1;
    doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(146, 64, 14);
    doc.text(
      doc.splitTextToSize(
        "The AI model was not connected when this screening ran. The stage comes from handgrip and chair-stand rules only. Osteoporosis risk and the X-ray measurements were not produced.",
        right - left,
      ),
      left,
      y,
    );
    y += 10;
  }

  heading("Suggested action");
  doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(30, 41, 59);
  doc.text(doc.splitTextToSize(STAGE[finalStage(s)].action, right - left), left, y);
  y += 8;

  if (s.override) {
    heading("Doctor's note");
    doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(30, 41, 59);
    const note = doc.splitTextToSize(s.override.reason || "No note given.", right - left);
    doc.text(note, left, y);
    y += 5 * note.length + 2;
  }

  const xray = s.xrayId ? await xrayAsJpeg(s.xrayId) : null;
  if (xray) {
    heading("Knee X-ray");
    const room = height - 26 - y;
    const scale = Math.min(70 / xray.width, room / xray.height);
    if (scale > 0) doc.addImage(xray.data, "JPEG", left, y, xray.width * scale, xray.height * scale);
  }

  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(100, 116, 139);
  doc.text(
    doc.splitTextToSize(
      "SarcoScan is a screening and referral aid built as a hackathon prototype. It is not a medical device and does not replace a DEXA scan or a doctor's judgement.",
      right - left,
    ),
    left,
    height - 14,
  );

  doc.save(`SarcoScan_${patient.mrn}_${s.date}.pdf`);
}
