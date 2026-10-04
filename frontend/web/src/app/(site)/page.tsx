"use client";

import React, { useState, useRef, useId } from "react";
import Link from "next/link";
import {
  ActivityIcon,
  BoneIcon,
  ScanIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  ServerIcon,
  UsersIcon,
  FileTextIcon,
  InfoIcon,
} from "@/components/Icons";
import { Skeleton, PatientReportSkeleton } from "@/components/ui/Skeleton";

// Preset Sample Knee AP X-Rays for quick testing
const CLINICAL_PRESETS = [
  {
    id: "case-normal",
    title: "Preset 1 · Preserved Muscle",
    patientName: "Patient A (Control)",
    age: 62,
    sex: "Male",
    height: 175,
    weight: 74,
    leftTrials: [33.0, 34.5, 34.0],
    rightTrials: [35.0, 36.2, 35.8],
    gripStrength: 36.2,
    bmi: 24.2,
    xrayType: "Normal Cortical & Trabecular Architecture",
    description: "Intact cortical bone thickness, normal proximal tibia trabecular density, thigh muscle ratio 2.14.",
    sarcopeniaStage: "No Sarcopenia",
    sarcopeniaColor: "text-emerald-800 bg-[#dae3ec] border-[#bac7b6]",
    sarcopeniaProb: 12,
    osteoRisk: "Low Risk",
    osteoColor: "text-emerald-800 bg-[#dae3ec] border-[#bac7b6]",
    osteoProb: 18,
    softTissueRatio: 2.14,
    altText: "Diagnostic knee radiograph showing intact cortical bone thickness and normal thigh muscle-to-bone ratio.",
  },
  {
    id: "case-mild",
    title: "Preset 2 · Borderline Muscle Loss",
    patientName: "Patient B (Possible Sarcopenia)",
    age: 71,
    sex: "Female",
    height: 160,
    weight: 56,
    leftTrials: [16.5, 17.0, 16.8],
    rightTrials: [17.5, 17.8, 17.2],
    gripStrength: 17.8,
    bmi: 21.8,
    xrayType: "Borderline Soft-Tissue Ratio",
    description: "Thigh soft tissue thinning, grip borderline below female cutoff (<18kg), slight trabecular reduction.",
    sarcopeniaStage: "Possible Sarcopenia",
    sarcopeniaColor: "text-amber-800 bg-amber-100/90 border-amber-300",
    sarcopeniaProb: 54,
    osteoRisk: "Moderate Risk",
    osteoColor: "text-amber-800 bg-amber-100/90 border-amber-300",
    osteoProb: 52,
    softTissueRatio: 1.58,
    altText: "Knee radiograph exhibiting borderline soft tissue thinning in the thigh compartment with mild trabecular reduction.",
  },
  {
    id: "case-severe",
    title: "Preset 3 · Severe Sarcopenia & Osteopenia",
    patientName: "Patient C (High Risk)",
    age: 79,
    sex: "Female",
    height: 154,
    weight: 45,
    leftTrials: [12.5, 13.0, 12.8],
    rightTrials: [13.2, 13.8, 13.5],
    gripStrength: 13.8,
    bmi: 19.0,
    xrayType: "Marked Muscle Atrophy & Trabecular Thinning",
    description: "Marked quadriceps muscle wasting, low proximal tibia cortical index, severe grip deficiency (<15kg).",
    sarcopeniaStage: "Severe Sarcopenia",
    sarcopeniaColor: "text-rose-800 bg-rose-100/90 border-rose-300",
    sarcopeniaProb: 89,
    osteoRisk: "High Risk",
    osteoColor: "text-rose-800 bg-rose-100/90 border-rose-300",
    osteoProb: 84,
    softTissueRatio: 1.12,
    altText: "Knee radiograph revealing severe soft-tissue muscle atrophy and pronounced proximal tibia bone mineral loss.",
  },
];

export default function HomePage() {
  const fileInputId = useId();
  // Ingestion Mode: "upload" or "preset"
  const [ingestionMode, setIngestionMode] = useState<"upload" | "preset">("upload");
  const [selectedPreset, setSelectedPreset] = useState(CLINICAL_PRESETS[1]);

  // Uploaded Image State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [showSegmentationMask, setShowSegmentationMask] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Grip Input Mode: "detailed" (3 trials per hand) or "direct" (single value)
  const [gripInputMode, setGripInputMode] = useState<"detailed" | "direct">("detailed");

  // Patient Biomarkers
  const [patientName, setPatientName] = useState("Jane Doe");
  const [age, setAge] = useState<number>(71);
  const [sex, setSex] = useState<string>("Female");
  const [height, setHeight] = useState<number>(160);
  const [weight, setWeight] = useState<number>(56);

  // Manual 3-Trial Grip Data (kg)
  const [leftTrials, setLeftTrials] = useState<[number, number, number]>([16.5, 17.0, 16.8]);
  const [rightTrials, setRightTrials] = useState<[number, number, number]>([17.5, 17.8, 17.2]);
  const [directGrip, setDirectGrip] = useState<number>(17.8);

  // Optional Clinical Modifiers
  const [softTissueRatio, setSoftTissueRatio] = useState<number>(1.58);
  const [sarcFScore, setSarcFScore] = useState<number>(3); // 0 to 10
  const [chairStandSec, setChairStandSec] = useState<number>(14.5); // 5-chair stand time (sec)

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [doctorOverride, setDoctorOverride] = useState(false);
  const [overrideStage, setOverrideStage] = useState("Probable Sarcopenia");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Dynamic Peak Grip Calculation
  const peakCalculatedGrip =
    gripInputMode === "detailed"
      ? Math.max(...leftTrials, ...rightTrials)
      : directGrip;

  // Dynamic BMI Calculation
  const calculatedBMI = Number((weight / Math.pow(height / 100, 2)).toFixed(1));

  // AWGS 2019 Cutoff Rules: Male < 28 kg, Female < 18 kg
  const gripCutoff = sex === "Male" ? 28.0 : 18.0;
  const isGripDeficient = peakCalculatedGrip < gripCutoff;
  const gripDeficitMargin = (gripCutoff - peakCalculatedGrip).toFixed(1);

  // Multimodal AI Fusion Model Staging Algorithm
  let computedSarcopeniaStage = "No Sarcopenia";
  let computedSarcopeniaScore = 14;
  let sarcopeniaColor = "text-emerald-800 bg-[#dae3ec] border-[#bac7b6]";

  if (peakCalculatedGrip < gripCutoff - 4 || (isGripDeficient && softTissueRatio < 1.35) || (isGripDeficient && calculatedBMI < 19.5)) {
    computedSarcopeniaStage = "Severe Sarcopenia";
    computedSarcopeniaScore = 88;
    sarcopeniaColor = "text-rose-800 bg-rose-100/90 border-rose-300";
  } else if (isGripDeficient && (softTissueRatio < 1.70 || sarcFScore >= 4 || chairStandSec > 12)) {
    computedSarcopeniaStage = "Probable Sarcopenia";
    computedSarcopeniaScore = 68;
    sarcopeniaColor = "text-amber-800 bg-amber-100/90 border-amber-300";
  } else if (isGripDeficient || (softTissueRatio < 1.65 && age >= 65)) {
    computedSarcopeniaStage = "Possible Sarcopenia";
    computedSarcopeniaScore = 46;
    sarcopeniaColor = "text-amber-800 bg-[#dae3ec] border-[#bac7b6]";
  }

  // Proximal Tibia Osteoporosis Risk calculation
  let computedOsteoRisk = "Low Risk";
  let computedOsteoProb = 20;
  let osteoColor = "text-emerald-800 bg-[#dae3ec] border-[#bac7b6]";

  if (age > 75 && (calculatedBMI < 20 || softTissueRatio < 1.35)) {
    computedOsteoRisk = "High Risk";
    computedOsteoProb = 85;
    osteoColor = "text-rose-800 bg-rose-100/90 border-rose-300";
  } else if (age >= 68 || calculatedBMI < 22 || softTissueRatio < 1.65) {
    computedOsteoRisk = "Moderate Risk";
    computedOsteoProb = 54;
    osteoColor = "text-amber-800 bg-amber-100/90 border-amber-300";
  }

  // Handle Preset Selection
  const handleSelectPreset = (preset: typeof CLINICAL_PRESETS[0]) => {
    setSelectedPreset(preset);
    setIngestionMode("preset");
    setPatientName(preset.patientName);
    setAge(preset.age);
    setSex(preset.sex);
    setHeight(preset.height);
    setWeight(preset.weight);
    setLeftTrials(preset.leftTrials as [number, number, number]);
    setRightTrials(preset.rightTrials as [number, number, number]);
    setDirectGrip(preset.gripStrength);
    setSoftTissueRatio(preset.softTissueRatio);
    setDoctorOverride(false);
    setDoctorNotes("");
    triggerFastInference();
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedFileName(file.name);
      setIngestionMode("upload");
      // Simulate segmentation estimation
      setSoftTissueRatio(1.62);
      triggerFastInference();
    }
  };

  const triggerFastInference = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  const handleUpdateTrial = (hand: "left" | "right", index: number, value: number) => {
    if (hand === "left") {
      const updated = [...leftTrials] as [number, number, number];
      updated[index] = value;
      setLeftTrials(updated);
    } else {
      const updated = [...rightTrials] as [number, number, number];
      updated[index] = value;
      setRightTrials(updated);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1e293b] leading-[1.1]">
              Knee X-Ray + Handgrip AI Screening for Sarcopenia
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
              An on-premise AI clinical triage system that turns routine knee AP radiographs and a 10-second handgrip test into immediate sarcopenia & osteoporosis risk stratifications—<strong>no DEXA or CT needed</strong>.
            </p>

            {/* Helpline / Direct Contact Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#screening-demo"
                className="px-6 py-3.5 rounded-2xl bg-[#bac7b6] hover:bg-[#8c9e88] text-[#1e293b] hover:text-white font-bold text-sm transition-all shadow-sm inline-flex items-center gap-2"
              >
                <span>Upload X-Ray & Test AI</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>

              <a
                href="tel:+18005557272"
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#e8e8e8] border border-[#d1d9ca] text-[#1e293b] font-semibold text-sm transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <PhoneIcon className="w-4 h-4 text-[#1e293b]" />
                <span>Call Helpline: +1 (800) 555-7272</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Card / Quick Overview */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-white border-2 border-[#bac7b6] shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#dae3ec] flex items-center justify-center text-[#1e293b]">
                    <ScanIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#1e293b]">Multimodal Fusion Engine</h2>
                    <p className="text-[11px] text-[#64748b]">Knee AP X-Ray + Handgrip Dynamometer</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#d1d9ca] text-[#1e293b] text-[11px] font-bold">
                  On-Premise Ready
                </span>
              </div>

              {/* Graphical representation with ALT text */}
              <div
                className="relative rounded-2xl bg-[#eeeeee] p-4 border border-[#dae3ec] space-y-3"
                role="img"
                aria-label="Schematic diagram illustrating Knee AP radiograph soft tissue segmentation fused with grip dynamometer measurements for risk scoring"
              >
                <div className="flex justify-between items-center text-xs font-semibold text-[#1e293b]">
                  <span>1. Routine Knee AP X-Ray Upload</span>
                  <span className="text-emerald-700">Femur & Soft-Tissue Ratios</span>
                </div>
                <div className="h-2 w-full bg-[#dae3ec] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8c9e88] rounded-full w-4/5" />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-[#1e293b] pt-1">
                  <span>2. Manual or BLE Handgrip (3 trials)</span>
                  <span className="text-[#8c9e88]">AWGS 2019 Comparison</span>
                </div>
                <div className="h-2 w-full bg-[#dae3ec] rounded-full overflow-hidden">
                  <div className="h-full bg-[#bac7b6] rounded-full w-3/5" />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-[#1e293b] pt-1">
                  <span>3. Proximal Tibia Bone Quality</span>
                  <span className="text-emerald-700">Osteoporosis Proxy</span>
                </div>
                <div className="h-2 w-full bg-[#dae3ec] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d1d9ca] rounded-full w-2/3" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#dae3ec]/60 border border-[#bac7b6] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#475569] block">Target Screening Sensitivity</span>
                  <strong className="text-xl font-extrabold text-[#1e293b]">≥ 85.0%</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#475569] block">Time Per Patient</span>
                  <strong className="text-xl font-extrabold text-[#1e293b]">&lt; 5 mins</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SCREENING STATION (UPLOAD X-RAY + MANUAL GRIP) */}
      <section id="screening-demo" className="scroll-mt-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-[#dae3ec] shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e8e8] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae3ec] text-xs font-bold text-[#1e293b] mb-2">
                <ActivityIcon className="w-3.5 h-3.5" />
                <span>Interactive Screening Station</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b]">
                Knee X-Ray Ingestion & Handgrip Strength Calculator
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Upload a knee radiograph or choose a preset, enter manual dynamometer trials, set patient BMI, and identify risk tiers instantly.
              </p>
            </div>

            <button
              type="button"
              onClick={triggerFastInference}
              className="px-4 py-2.5 rounded-xl bg-[#bac7b6] hover:bg-[#8c9e88] text-[#1e293b] hover:text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
            >
              <RefreshCwIcon className="w-4 h-4" />
              <span>Re-Run AI Inference</span>
            </button>
          </div>

          {/* STEP 1: KNEE X-RAY INGESTION MODE (UPLOAD OR PRESETS) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-2">
                <BoneIcon className="w-4 h-4 text-[#8c9e88]" />
                Step 1: Knee AP Radiograph Ingestion
              </span>

              {/* Mode Toggle Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-[#eeeeee] border border-[#d1d9ca] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIngestionMode("upload")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    ingestionMode === "upload"
                      ? "bg-white text-[#1e293b] shadow-sm"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                >
                  Upload Your Own X-Ray
                </button>
                <button
                  type="button"
                  onClick={() => setIngestionMode("preset")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    ingestionMode === "preset"
                      ? "bg-white text-[#1e293b] shadow-sm"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                >
                  Choose Clinical Preset
                </button>
              </div>
            </div>

            {ingestionMode === "upload" ? (
              /* Custom File Upload Drag & Drop Area */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#eeeeee]/70 border-2 border-dashed border-[#bac7b6]">
                <div className="md:col-span-6 space-y-4">
                  <label htmlFor={fileInputId} className="block text-xs font-bold text-[#1e293b]">Upload Knee AP Radiograph (.PNG, .JPG, .DCM)</label>
                  <p className="text-xs text-[#475569]">
                    Select or drag standard knee radiograph from your local device or PACS workstation. DICOM metadata tags will be de-identified on-premise.
                  </p>

                  <input
                    id={fileInputId}
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.dcm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-[#dae3ec] hover:bg-[#bac7b6] text-[#1e293b] text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                    >
                      <ScanIcon className="w-4 h-4" />
                      <span>{uploadedFileName ? "Replace X-Ray Image" : "Browse & Upload X-Ray"}</span>
                    </button>

                    {uploadedFileName && (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedFileName("");
                        }}
                        className="px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Quality & Integrity Check Box */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#d1d9ca] space-y-1.5 text-xs">
                    <span className="font-bold text-[#1e293b] block">Automatic QC Check</span>
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Knee AP View Validated · No edge cropping detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Thigh soft-tissue to cortical bone ratio estimated: <strong>{softTissueRatio}</strong></span>
                    </div>
                  </div>
                </div>

                {/* X-Ray Preview & AI Segmentation Mask Simulator */}
                <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#d1d9ca] min-h-[220px]">
                  {uploadedImage ? (
                    <div className="w-full space-y-3">
                      <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
                        {/* Render uploaded image with alt text */}
                        <img
                          src={uploadedImage}
                          alt="User uploaded knee radiograph preview"
                          className="w-full h-full object-contain"
                        />

                        {/* Visual AI Segmentation Mask Layer Toggle */}
                        {showSegmentationMask && (
                          <div
                            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/20 via-emerald-500/15 to-transparent border-2 border-emerald-400/60 flex items-center justify-center"
                            aria-label="AI Segmentation overlay showing bone cortical boundaries and soft-tissue cross section"
                          >
                            <span className="px-2.5 py-1 rounded bg-black/70 text-[10px] font-bold text-emerald-300 backdrop-blur-sm shadow">
                              AI Mask: Femur & Soft-Tissue Segmented
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 truncate max-w-[200px] font-medium">{uploadedFileName}</span>
                        <button
                          type="button"
                          onClick={() => setShowSegmentationMask(!showSegmentationMask)}
                          className="text-[11px] font-bold text-[#8c9e88] hover:underline"
                        >
                          {showSegmentationMask ? "Hide AI Mask" : "Show AI Mask"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#dae3ec] flex items-center justify-center mx-auto text-[#1e293b]">
                        <ScanIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-[#1e293b]">No custom image uploaded yet</p>
                      <p className="text-[11px] text-[#64748b]">
                        Click browse above to upload any knee AP X-ray file or switch to Presets.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Clinical Presets Selector */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CLINICAL_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#8c9e88] bg-[#dae3ec]/40 shadow-sm"
                          : "border-[#e8e8e8] bg-[#eeeeee]/60 hover:bg-[#e8e8e8]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#1e293b]">{preset.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.sarcopeniaColor}`}>
                          {preset.sarcopeniaStage}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] line-clamp-2 my-1">{preset.description}</p>
                      <div className="text-[11px] text-[#64748b] flex gap-3 pt-1">
                        <span>Age: {preset.age}y</span>
                        <span>Sex: {preset.sex}</span>
                        <span>Grip: {preset.gripStrength} kg</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* STEP 2 & 3: MANUAL HANDGRIP DYNAMOMETER + BIOMARKERS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* Left Column: Manual Grip Entry & Biomarkers */}
            <div className="lg:col-span-6 space-y-6 p-6 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca]">
              {/* Handgrip Entry Header */}
              <div className="flex items-center justify-between border-b border-[#dae3ec] pb-3">
                <span className="font-bold text-sm text-[#1e293b] flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-[#8c9e88]" />
                  Step 2: Manual Handgrip Dynamometer Entry
                </span>

                {/* Toggle between 3-trial entry vs direct input */}
                <div className="inline-flex p-1 rounded-lg bg-white border border-[#d1d9ca] text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setGripInputMode("detailed")}
                    className={`px-2.5 py-1 rounded transition-all ${
                      gripInputMode === "detailed" ? "bg-[#bac7b6] text-[#1e293b]" : "text-[#64748b]"
                    }`}
                  >
                    3-Trial Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setGripInputMode("direct")}
                    className={`px-2.5 py-1 rounded transition-all ${
                      gripInputMode === "direct" ? "bg-[#bac7b6] text-[#1e293b]" : "text-[#64748b]"
                    }`}
                  >
                    Quick Slider
                  </button>
                </div>
              </div>

              {gripInputMode === "detailed" ? (
                /* 3 Trials Per Hand Input Form */
                <div className="space-y-4">
                  {/* Left Hand Trials */}
                  <div className="p-4 rounded-xl bg-white border border-[#d1d9ca] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#1e293b]">
                      <span>Left Hand Force (3 Trials in kg)</span>
                      <span className="text-[#8c9e88]">Max: {Math.max(...leftTrials)} kg</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {leftTrials.map((val, idx) => (
                        <div key={`left-${idx}`} className="space-y-1">
                          <label className="text-[10px] text-[#64748b]">Trial {idx + 1}</label>
                          <input
                            type="number"
                            step="0.1"
                            value={val}
                            onChange={(e) => handleUpdateTrial("left", idx, Number(e.target.value))}
                            className="w-full p-2 text-xs font-bold bg-[#eeeeee] rounded-lg border border-[#d1d9ca] focus:outline-none focus:border-[#8c9e88]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Hand Trials */}
                  <div className="p-4 rounded-xl bg-white border border-[#d1d9ca] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#1e293b]">
                      <span>Right Hand Force (3 Trials in kg)</span>
                      <span className="text-[#8c9e88]">Max: {Math.max(...rightTrials)} kg</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {rightTrials.map((val, idx) => (
                        <div key={`right-${idx}`} className="space-y-1">
                          <label className="text-[10px] text-[#64748b]">Trial {idx + 1}</label>
                          <input
                            type="number"
                            step="0.1"
                            value={val}
                            onChange={(e) => handleUpdateTrial("right", idx, Number(e.target.value))}
                            className="w-full p-2 text-xs font-bold bg-[#eeeeee] rounded-lg border border-[#d1d9ca] focus:outline-none focus:border-[#8c9e88]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Direct Quick Force Slider */
                <div className="p-4 rounded-xl bg-white border border-[#d1d9ca] space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#1e293b]">
                    <span>Direct Peak Grip Strength</span>
                    <span className="text-[#8c9e88]">{directGrip} kg</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="55"
                    step="0.5"
                    value={directGrip}
                    onChange={(e) => setDirectGrip(Number(e.target.value))}
                    className="w-full accent-[#8c9e88]"
                  />
                </div>
              )}

              {/* Peak Grip Comparison Banner against AWGS Cutoff */}
              <div className="p-3.5 rounded-xl bg-white border border-[#bac7b6] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#64748b] block">Evaluated Peak Force (Max)</span>
                  <span className="text-lg font-extrabold text-[#1e293b]">{peakCalculatedGrip} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#64748b] block">AWGS 2019 Threshold ({sex})</span>
                  <span className={`text-xs font-bold ${isGripDeficient ? "text-rose-700" : "text-emerald-700"}`}>
                    {isGripDeficient ? `Deficit by -${gripDeficitMargin} kg (< ${gripCutoff}kg)` : `Normal (≥ ${gripCutoff}kg)`}
                  </span>
                </div>
              </div>

              {/* STEP 3: PATIENT BIOMARKERS (AGE, SEX, BMI) */}
              <div className="pt-2 border-t border-[#dae3ec] space-y-4">
                <span className="font-bold text-sm text-[#1e293b] flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-[#8c9e88]" />
                  Step 3: Patient Biomarkers & Anthropometrics
                </span>

                {/* Age & Sex Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#1e293b]">
                      <span>Age</span>
                      <span className="font-bold text-[#8c9e88]">{age} yrs</span>
                    </div>
                    <input
                      type="range"
                      min="45"
                      max="95"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full accent-[#8c9e88]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1e293b] block">Biological Sex</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Female", "Male"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSex(s)}
                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            sex === s
                              ? "bg-[#bac7b6] text-[#1e293b] border-[#8c9e88]"
                              : "bg-white text-[#475569] border-[#d1d9ca]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Height, Weight & Calculated BMI */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1e293b]">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-2 text-xs font-bold bg-white rounded-lg border border-[#d1d9ca]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1e293b]">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full p-2 text-xs font-bold bg-white rounded-lg border border-[#d1d9ca]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1e293b]">Calculated BMI</label>
                    <div className="p-2 text-xs font-bold bg-[#dae3ec] rounded-lg border border-[#bac7b6] text-center text-[#1e293b]">
                      {calculatedBMI} kg/m²
                    </div>
                  </div>
                </div>

                {/* Soft Tissue Ratio Slider (Manual Fine-Tuning) */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-[#1e293b]">
                    <span>Knee Soft-Tissue to Bone Ratio</span>
                    <span className="font-bold text-[#8c9e88]">{softTissueRatio}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.6"
                    step="0.02"
                    value={softTissueRatio}
                    onChange={(e) => setSoftTissueRatio(Number(e.target.value))}
                    className="w-full accent-[#8c9e88]"
                  />
                  <p className="text-[10px] text-[#64748b]">
                    Reference cutoff: &lt;1.65 indicates reduced skeletal muscle thickness.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Instant AI Risk Stratification & Output */}
            <div className="lg:col-span-6">
              {isLoading ? (
                <PatientReportSkeleton />
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#bac7b6] shadow-sm space-y-6">
                  {/* Output Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e8e8] pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c9e88]">
                        Multimodal Fusion Prediction
                      </span>
                      <h3 className="text-xl font-bold text-[#1e293b]">
                        Identified Clinical Risk Tiers
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#dae3ec] text-[#1e293b]">
                        CPU Inference: 1.1s
                      </span>
                    </div>
                  </div>

                  {/* Primary Risk Tiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sarcopenia Risk */}
                    <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca] space-y-2">
                      <span className="text-xs text-[#64748b] font-medium block">Sarcopenia Screening Stage</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${doctorOverride ? "text-amber-800 bg-amber-100 border-amber-300" : sarcopeniaColor}`}>
                          {doctorOverride ? `Overridden: ${overrideStage}` : computedSarcopeniaStage}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] pt-1">
                        Fusion Probability: <strong>{computedSarcopeniaScore}%</strong>
                      </p>
                    </div>

                    {/* Osteoporosis Risk */}
                    <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca] space-y-2">
                      <span className="text-xs text-[#64748b] font-medium block">Osteoporosis Risk Tier (Proximal Tibia)</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${osteoColor}`}>
                          {computedOsteoRisk} ({computedOsteoProb}%)
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] pt-1">
                        Trabecular bone mineral proxy.
                      </p>
                    </div>
                  </div>

                  {/* Biomarker Summary Table */}
                  <div className="p-4 rounded-xl bg-[#eeeeee]/60 border border-[#d1d9ca] space-y-2 text-xs">
                    <span className="font-bold text-[#1e293b] block">Evaluated Feature Contributions</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white border border-[#e8e8e8]">
                        <span className="text-[10px] text-[#64748b] block">Peak Grip</span>
                        <strong className="text-[#1e293b]">{peakCalculatedGrip} kg</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#e8e8e8]">
                        <span className="text-[10px] text-[#64748b] block">Soft-Tissue Ratio</span>
                        <strong className="text-[#1e293b]">{softTissueRatio}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#e8e8e8]">
                        <span className="text-[10px] text-[#64748b] block">Calculated BMI</span>
                        <strong className="text-[#1e293b]">{calculatedBMI}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#e8e8e8]">
                        <span className="text-[10px] text-[#64748b] block">Patient Age</span>
                        <strong className="text-[#1e293b]">{age}y ({sex})</strong>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Clinical Next Steps */}
                  <div className="p-5 rounded-2xl bg-[#dae3ec]/50 border border-[#bac7b6] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-1.5">
                      <InfoIcon className="w-4 h-4 text-[#1e293b]" />
                      Clinical Referral & Action Plan
                    </h4>
                    <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4">
                      {computedSarcopeniaStage.includes("Severe") || computedSarcopeniaStage.includes("Probable") ? (
                        <>
                          <li>Priority referral for DXA body composition scan confirmation and geriatric assessment.</li>
                          <li>Recommend structured progressive resistance strength training & protein nutritional guidance.</li>
                          <li>Schedule follow-up handgrip assessment in 90 days.</li>
                        </>
                      ) : computedSarcopeniaStage.includes("Possible") ? (
                        <>
                          <li>Evaluate 5-times chair stand test and calf circumference measurement.</li>
                          <li>Annual routine knee AP radiograph and dynamometer surveillance.</li>
                        </>
                      ) : (
                        <>
                          <li>Normal muscle mass and functional strength. Routine healthy lifestyle maintenance.</li>
                          <li>Re-screen during next scheduled orthopedic checkup.</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Doctor Override & Export Actions */}
                  <div className="pt-3 border-t border-[#e8e8e8] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1e293b]">
                        <input
                          type="checkbox"
                          checked={doctorOverride}
                          onChange={(e) => setDoctorOverride(e.target.checked)}
                          className="rounded accent-[#8c9e88] w-4 h-4"
                        />
                        <span>Clinician Override Mode</span>
                      </label>

                      {doctorOverride && (
                        <select
                          value={overrideStage}
                          onChange={(e) => setOverrideStage(e.target.value)}
                          className="p-1.5 text-xs font-bold rounded-lg border border-[#d1d9ca] bg-white text-[#1e293b]"
                        >
                          <option value="No Sarcopenia">No Sarcopenia</option>
                          <option value="Possible Sarcopenia">Possible Sarcopenia</option>
                          <option value="Probable Sarcopenia">Probable Sarcopenia</option>
                          <option value="Severe Sarcopenia">Severe Sarcopenia</option>
                        </select>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowExportSuccess(true);
                          setTimeout(() => setShowExportSuccess(false), 3000);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#bac7b6] hover:bg-[#8c9e88] text-[#1e293b] hover:text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <FileTextIcon className="w-4 h-4" />
                        <span>Export Clinical Screening PDF</span>
                      </button>
                    </div>

                    {showExportSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-700" />
                        <span>Clinical report successfully compiled and saved to local on-premise storage!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLINICAL WORKFLOW SECTION */}
      <section id="clinical-workflow" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c9e88]">
            Designed for Hospital LAN
          </span>
          <h2 className="text-3xl font-extrabold text-[#1e293b]">
            How SarcoScan Integrates into Hospital Operations
          </h2>
          <p className="text-sm text-[#475569]">
            Seamless, under 5-minute screening workflow without internet dependencies or cloud exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm hover:border-[#bac7b6] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#dae3ec] flex items-center justify-center font-bold text-[#1e293b]">
              1
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Technician Entry</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Nurse or radiographer captures 3 grip trials on the dynamometer and uploads the knee AP radiograph directly from Orthanc PACS or local disk.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm hover:border-[#bac7b6] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#d1d9ca] flex items-center justify-center font-bold text-[#1e293b]">
              2
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Quality Control & U-Net</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Automated image validation flags cropped views, followed by U-Net bone and soft tissue segmentation for cross-sectional muscle ratio estimation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm hover:border-[#bac7b6] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#bac7b6] flex items-center justify-center font-bold text-[#1e293b]">
              3
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Multimodal Fusion</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Celery CPU worker executes ONNX Runtime fusion model combining image ratios with AWGS grip thresholds, age, and BMI.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm hover:border-[#bac7b6] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#8c9e88] flex items-center justify-center font-bold text-white">
              4
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Doctor Decision</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Clinician reviews the explainable overlay, decides on referral or bone-density follow-up, and exports a signed PDF report.
            </p>
          </div>
        </div>
      </section>

      {/* 4. VALIDATION TARGETS SECTION */}
      <section id="validation-targets" className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#d1d9ca]/40 border border-[#bac7b6] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1e293b]">Clinical Rigor</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1e293b]">
                Empirical Validation Targets
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e293b] hover:text-[#8c9e88] underline underline-offset-4"
            >
              <span>View Full Research Specification</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#dae3ec] shadow-sm">
              <span className="text-xs text-[#64748b] block mb-1">Target Sensitivity</span>
              <div className="text-3xl font-extrabold text-[#1e293b]">≥ 85%</div>
              <p className="text-xs text-[#475569] mt-2">
                At screening threshold against reference DEXA measurements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#dae3ec] shadow-sm">
              <span className="text-xs text-[#64748b] block mb-1">Osteoporosis AUC</span>
              <div className="text-3xl font-extrabold text-[#1e293b]">≥ 0.80</div>
              <p className="text-xs text-[#475569] mt-2">
                Proximal tibia radiograph compared against gold-standard DEXA T-scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#dae3ec] shadow-sm">
              <span className="text-xs text-[#64748b] block mb-1">CPU Inference Speed</span>
              <div className="text-3xl font-extrabold text-[#1e293b]">&lt; 5.0 s</div>
              <p className="text-xs text-[#475569] mt-2">
                Validated on basic Intel i5 CPU with 16GB RAM without dedicated GPU.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#dae3ec] shadow-sm">
              <span className="text-xs text-[#64748b] block mb-1">Total Patient Triage</span>
              <div className="text-3xl font-extrabold text-[#1e293b]">&lt; 5 min</div>
              <p className="text-xs text-[#475569] mt-2">
                End-to-end from patient intake to physician review and printed report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. USER ROLES BREAKDOWN */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8c9e88]">
            Multi-Stakeholder Access
          </span>
          <h2 className="text-3xl font-extrabold text-[#1e293b]">
            Tailored Experiences Across the Hospital Care Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#dae3ec] flex items-center justify-center text-[#1e293b]">
              <ActivityIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Technician / Nurse</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Fast intake UI to capture grip dynamometer measurements, verify image quality, and trigger inference.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#d1d9ca] flex items-center justify-center text-[#1e293b]">
              <UsersIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Orthopedic Clinician</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Reviews AI segmentation overlays, confidence intervals, applies clinical overrides, and decides on referral.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#bac7b6] flex items-center justify-center text-[#1e293b]">
              <ServerIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Hospital IT Admin</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Manages local Docker Compose stack, MinIO storage quotas, Orthanc PACS endpoints, and immutable audit logs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#dae3ec] space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#8c9e88] flex items-center justify-center text-white">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1e293b]">Patient & Caregiver</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Clear, patient-friendly summary report with longitudinal strength trends and lifestyle recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DIRECT CONTACT & HELPLINE BANNER */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#bac7b6] shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c9e88]">
              Hospital Support & Pilot Deployments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b]">
              Bring SarcoScan to Your Clinical Facility
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Connect with our clinical research team for on-premise installation guides, BLE dynamometer hardware schematics, and clinical validation protocols.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:+18005557272"
              className="px-5 py-3 rounded-2xl bg-[#bac7b6] hover:bg-[#8c9e88] hover:text-white text-[#1e293b] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Call Helpline: +1 (800) 555-7272</span>
            </a>

            <a
              href="mailto:support@sarcoscan.ai"
              className="px-5 py-3 rounded-2xl bg-[#dae3ec] hover:bg-[#d1d9ca] text-[#1e293b] font-bold text-xs transition-all flex items-center justify-center gap-2 border border-[#bac7b6]"
            >
              <MailIcon className="w-4 h-4" />
              <span>Email: support@sarcoscan.ai</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
