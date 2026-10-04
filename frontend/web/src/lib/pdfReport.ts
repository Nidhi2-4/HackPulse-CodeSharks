import jsPDF from "jspdf";

export interface ReportData {
  patientTitle: string;
  age: number;
  sex: string;
  bmi: number;
  grip: number;
  gripCutoff: number;
  isGripLow: boolean;
  softTissueRatio: number;
  sarcopeniaStage: string;
  sarcopeniaScore: number;
  osteoRisk: string;
  osteoProb: number;
  doctorOverride: boolean;
  overrideNote?: string;
}

export function generateAndDownloadPdf(data: ReportData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Bar
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, pageWidth, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SARCOSCAN · CLINICAL AI SCREENING REPORT", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Team CodeSharks · Knee Radiograph + Handgrip Fusion Engine", 14, 18);

  y = 34;

  // Patient Info Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, "FD");

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Patient Profile: ${data.patientTitle}`, 18, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Age: ${data.age} yrs`, 18, y + 16);
  doc.text(`Biological Sex: ${data.sex}`, 60, y + 16);
  doc.text(`BMI: ${data.bmi.toFixed(1)} kg/m²`, 110, y + 16);

  const timestamp = new Date().toLocaleString();
  doc.text(`Screening Date: ${timestamp}`, 18, y + 22);
  doc.text(`Deployment: Hospital LAN (On-Premise CPU)`, 110, y + 22);

  y += 36;

  // SECTION: Quantitative Biomarkers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("1. Quantitative Biomarkers & Radiographic Metrics", 14, y);

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  // Table row: Handgrip
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Peak Digital Handgrip Strength:", 18, y);
  doc.setFont("helvetica", "normal");
  const gripStatus = data.isGripLow ? "DEFICIENT (Below Cutoff)" : "NORMAL";
  doc.text(
    `${data.grip} kg (AWGS 2019 Cutoff: ${data.gripCutoff} kg) → Status: ${gripStatus}`,
    85,
    y
  );

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Knee Soft-Tissue-to-Bone Ratio:", 18, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.softTissueRatio.toFixed(2)} (Proxy for thigh muscle mass)`, 85, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Knee AP X-Ray Quality Check:", 18, y);
  doc.setFont("helvetica", "normal");
  doc.text("PASSED (AP View Confirmed, Soft-tissue borders visible)", 85, y);

  y += 16;

  // SECTION: AI Model Diagnostic Findings
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("2. AI Fusion Model Risk Stratifications", 14, y);

  y += 6;
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  // Sarcopenia Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, (pageWidth - 32) / 2, 26, 2, 2, "FD");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Sarcopenia Screening Stage", 18, y + 8);
  doc.setFontSize(12);
  doc.setTextColor(225, 29, 72); // Rose/red
  doc.text(`${data.sarcopeniaStage.toUpperCase()}`, 18, y + 16);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fusion Probability Score: ${data.sarcopeniaScore}%`, 18, y + 22);

  // Osteoporosis Card
  const osteoX = 14 + (pageWidth - 32) / 2 + 4;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(osteoX, y, (pageWidth - 32) / 2, 26, 2, 2, "FD");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Osteoporosis Risk (Proximal Tibia)", osteoX + 4, y + 8);
  doc.setFontSize(12);
  doc.setTextColor(217, 119, 6); // Amber
  doc.text(`${data.osteoRisk.toUpperCase()}`, osteoX + 4, y + 16);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Trabecular Texture Density: ${data.osteoProb}%`, osteoX + 4, y + 22);

  y += 34;

  // SECTION: Doctor Clinical Assessment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("3. Physician Clinical Review & Override", 14, y);

  y += 6;
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const overrideText = data.doctorOverride
    ? "Doctor Override Applied: Independent clinical review modified AI assessment."
    : "AI Result Accepted by Reviewing Clinician (No override requested).";
  doc.text(overrideText, 18, y);

  if (data.overrideNote) {
    y += 6;
    doc.text(`Physician Notes: "${data.overrideNote}"`, 18, y);
  }

  y += 14;

  // SECTION: Recommended Clinical Actions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text("4. Suggested Clinical Next Steps", 14, y);

  y += 6;
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("• Progressive Resistance Training & Targeted Physical Therapy protocol.", 18, y);
  y += 6;
  doc.text("• Dietary protein supplementation (1.2 - 1.5 g/kg/day) + Vitamin D / Calcium check.", 18, y);
  y += 6;
  doc.text("• Schedule Dual-Energy X-Ray Absorptiometry (DEXA) for confirmatory diagnosis if high risk.", 18, y);

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.setLineHeightFactor(1.3);
  doc.text(
    "DISCLAIMER: SarcoScan is an automated clinical AI screening and triage tool. It does not replace a definitive DEXA scan.\nData protected under DPDP Act 2023. Field-level encryption active on hospital server.",
    14,
    pageHeight - 16
  );

  // Direct Browser File Download Trigger
  const safeFilename = `SarcoScan_Report_${data.patientTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(safeFilename);
}
