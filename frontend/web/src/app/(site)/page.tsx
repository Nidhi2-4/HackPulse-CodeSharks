"use client";

import React, { useState } from "react";
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

// Preset Sample Knee AP X-Rays for interactive AI screening demo
const SAMPLE_XRAYS = [
  {
    id: "case-normal",
    title: "Patient A · Routine Knee AP",
    age: 62,
    sex: "Male",
    gripStrength: 34.5,
    bmi: 24.2,
    xrayType: "Preserved Thigh Soft-Tissue Mass",
    description: "Adequate cortical bone thickness, normal proximal tibia trabecular architecture, thigh muscle ratio 2.14.",
    sarcopeniaStage: "No Sarcopenia",
    sarcopeniaColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    sarcopeniaProb: 12,
    osteoRisk: "Low Risk",
    osteoColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    osteoProb: 18,
    softTissueRatio: 2.14,
    altText: "Diagnostic knee radiograph showing intact cortical bone thickness and normal thigh muscle-to-bone ratio.",
  },
  {
    id: "case-mild",
    title: "Patient B · Mild Muscle Loss",
    age: 71,
    sex: "Female",
    gripStrength: 17.2,
    bmi: 21.8,
    xrayType: "Borderline Soft-Tissue Ratio",
    description: "Thigh soft tissue thinning, grip below AWGS cutoff (<18kg), slight subchondral sclerosis.",
    sarcopeniaStage: "Possible Sarcopenia",
    sarcopeniaColor: "text-amber-700 bg-amber-50 border-amber-200",
    sarcopeniaProb: 58,
    osteoRisk: "Moderate Risk",
    osteoColor: "text-amber-700 bg-amber-50 border-amber-200",
    osteoProb: 52,
    softTissueRatio: 1.58,
    altText: "Knee radiograph exhibiting borderline soft tissue thinning in the thigh compartment with mild trabecular reduction.",
  },
  {
    id: "case-severe",
    title: "Patient C · Advanced Sarcopenia & Osteopenia",
    age: 79,
    sex: "Female",
    gripStrength: 13.8,
    bmi: 19.1,
    xrayType: "Severe Soft-Tissue Atrophy",
    description: "Marked muscle wasting, reduced proximal tibia trabecular density, severe grip deficiency (<15kg).",
    sarcopeniaStage: "Severe Sarcopenia",
    sarcopeniaColor: "text-rose-700 bg-rose-50 border-rose-200",
    sarcopeniaProb: 89,
    osteoRisk: "High Risk",
    osteoColor: "text-rose-700 bg-rose-50 border-rose-200",
    osteoProb: 84,
    softTissueRatio: 1.12,
    altText: "Knee radiograph revealing severe soft-tissue muscle atrophy and pronounced proximal tibia bone mineral loss.",
  },
];

export default function HomePage() {
  const [selectedCase, setSelectedCase] = useState(SAMPLE_XRAYS[1]);
  const [age, setAge] = useState<number>(selectedCase.age);
  const [sex, setSex] = useState<string>(selectedCase.sex);
  const [grip, setGrip] = useState<number>(selectedCase.gripStrength);
  const [bmi, setBmi] = useState<number>(selectedCase.bmi);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInferred, setHasInferred] = useState(true);
  const [doctorOverride, setDoctorOverride] = useState(false);
  const [overrideNote, setOverrideNote] = useState("");

  const handleSelectCase = (caseItem: typeof SAMPLE_XRAYS[0]) => {
    setSelectedCase(caseItem);
    setAge(caseItem.age);
    setSex(caseItem.sex);
    setGrip(caseItem.gripStrength);
    setBmi(caseItem.bmi);
    setDoctorOverride(false);
    setOverrideNote("");
    setHasInferred(true);
  };

  const handleRunInference = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasInferred(true);
    }, 300);
  };

  // Dynamic calculations based on AWGS 2019 cutoff
  const gripCutoff = sex === "Male" ? 28.0 : 18.0;
  const isGripLow = grip < gripCutoff;

  let calculatedSarcopenia = "No Sarcopenia";
  let sarcopeniaBadgeStyle = "text-emerald-800 bg-[#dae3ec] border-[#bac7b6]";
  let sarcopeniaScore = 15;

  if (grip < gripCutoff - 4 || (grip < gripCutoff && bmi < 20)) {
    calculatedSarcopenia = "Severe Sarcopenia";
    sarcopeniaBadgeStyle = "text-rose-800 bg-rose-100/90 border-rose-300";
    sarcopeniaScore = 88;
  } else if (grip < gripCutoff) {
    calculatedSarcopenia = "Probable Sarcopenia";
    sarcopeniaBadgeStyle = "text-amber-800 bg-amber-100/90 border-amber-300";
    sarcopeniaScore = 67;
  } else if (grip < gripCutoff + 3 && age > 70) {
    calculatedSarcopenia = "Possible Sarcopenia";
    sarcopeniaBadgeStyle = "text-amber-700 bg-[#dae3ec] border-[#bac7b6]";
    sarcopeniaScore = 44;
  }

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
                <span>Try Live AI Simulator</span>
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
                    <h2 className="font-bold text-sm text-[#1e293b]">Multimodal Fusion Model</h2>
                    <p className="text-[11px] text-[#64748b]">Knee AP X-Ray + Handgrip BLE</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#d1d9ca] text-[#1e293b] text-[11px] font-bold">
                  v0.1 Prototype
                </span>
              </div>

              {/* Graphical representation with ALT text */}
              <div
                className="relative rounded-2xl bg-[#eeeeee] p-4 border border-[#dae3ec] space-y-3"
                role="img"
                aria-label="Schematic diagram illustrating Knee AP radiograph soft tissue segmentation fused with grip dynamometer measurements for risk scoring"
              >
                <div className="flex justify-between items-center text-xs font-semibold text-[#1e293b]">
                  <span>1. Routine Knee AP X-Ray</span>
                  <span className="text-emerald-700">Femur & Soft-Tissue Segmented</span>
                </div>
                <div className="h-2 w-full bg-[#dae3ec] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8c9e88] rounded-full w-4/5" />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-[#1e293b] pt-1">
                  <span>2. Handgrip Strength (3 trials)</span>
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

      {/* 2. INTERACTIVE SCREENING SUITE & SKELETON DEMO */}
      <section id="screening-demo" className="scroll-mt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#dae3ec] shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e8e8] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae3ec] text-xs font-bold text-[#1e293b] mb-2">
                <ActivityIcon className="w-3.5 h-3.5" />
                <span>Interactive Screening Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b]">
                SarcoScan Multimodal AI Screening Station
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Simulate patient intake, select sample radiograph cases, and test instant fusion staging.
              </p>
            </div>

          </div>

          {/* Sample Radiograph Cases Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Step 1: Choose or Load Sample Patient Radiograph
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_XRAYS.map((sample) => {
                const isSelected = selectedCase.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectCase(sample)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#8c9e88] bg-[#dae3ec]/40 shadow-sm"
                        : "border-[#e8e8e8] bg-[#eeeeee]/60 hover:bg-[#e8e8e8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#1e293b]">{sample.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sample.sarcopeniaColor}`}
                      >
                        {sample.sarcopeniaStage}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] line-clamp-2 my-1">{sample.description}</p>
                    <div className="text-[11px] text-[#64748b] flex gap-3 pt-1">
                      <span>Age: {sample.age}y</span>
                      <span>Sex: {sample.sex}</span>
                      <span>Grip: {sample.gripStrength} kg</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Clinical Inputs & Diagnostic Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            {/* Left: Interactive Input Controls */}
            <div className="lg:col-span-5 space-y-6 p-6 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca]">
              <div className="flex items-center justify-between border-b border-[#dae3ec] pb-3">
                <span className="font-bold text-sm text-[#1e293b] flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-[#8c9e88]" />
                  Patient Biomarkers & Dynamometer
                </span>
                <button
                  type="button"
                  onClick={handleRunInference}
                  className="px-3 py-1 rounded-lg bg-[#bac7b6] hover:bg-[#8c9e88] text-[#1e293b] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCwIcon className="w-3.5 h-3.5" />
                  <span>Re-Calculate</span>
                </button>
              </div>

              {/* Age Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#1e293b]">
                  <span>Patient Age</span>
                  <span className="font-bold text-[#8c9e88]">{age} years</span>
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

              {/* Sex Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1e293b] block">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Female", "Male"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
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

              {/* Grip Strength Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#1e293b]">
                  <span>Peak Grip Strength (kg)</span>
                  <span className={`font-bold ${isGripLow ? "text-amber-700" : "text-emerald-700"}`}>
                    {grip} kg {isGripLow ? `(< ${gripCutoff}kg cutoff)` : "(Normal)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="55"
                  step="0.5"
                  value={grip}
                  onChange={(e) => setGrip(Number(e.target.value))}
                  className="w-full accent-[#8c9e88]"
                />
                <p className="text-[10px] text-[#64748b]">
                  AWGS 2019 Threshold: &lt;28kg for males, &lt;18kg for females.
                </p>
              </div>

              {/* BMI Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#1e293b]">
                  <span>Body Mass Index (BMI)</span>
                  <span className="font-bold text-[#1e293b]">{bmi} kg/m²</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="38"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="w-full accent-[#8c9e88]"
                />
              </div>

              {/* Soft Tissue & X-Ray Summary */}
              <div className="p-3.5 rounded-xl bg-white border border-[#d1d9ca] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1e293b]">
                  <span>Knee X-Ray Soft-Tissue Ratio</span>
                  <span className="text-[#8c9e88] font-bold">{selectedCase.softTissueRatio}</span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">
                  Measured thigh soft-tissue to femur cortical bone ratio from segmented radiograph.
                </p>
              </div>
            </div>

            {/* Right: AI Output Display or Skeleton Loading State */}
            <div className="lg:col-span-7">
              {isLoading ? (
                <PatientReportSkeleton />
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#bac7b6] shadow-sm space-y-6">
                  {/* Output Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e8e8e8] pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c9e88]">
                        AI Fusion Inference Output
                      </span>
                      <h3 className="text-xl font-bold text-[#1e293b]">
                        Patient Screening Summary
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#dae3ec] text-[#1e293b]">
                        Inference Time: 1.2s (CPU)
                      </span>
                    </div>
                  </div>

                  {/* Staging Result Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca] space-y-2">
                      <span className="text-xs text-[#64748b] font-medium block">Sarcopenia Screening Stage</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${sarcopeniaBadgeStyle}`}>
                          {doctorOverride ? "Doctor Overridden: Probable" : calculatedSarcopenia}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] pt-1">
                        Fusion Model Probability: <strong>{sarcopeniaScore}%</strong>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#eeeeee] border border-[#d1d9ca] space-y-2">
                      <span className="text-xs text-[#64748b] font-medium block">Osteoporosis Risk Tier (Proximal Tibia)</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${selectedCase.osteoColor}`}>
                          {selectedCase.osteoRisk} ({selectedCase.osteoProb}%)
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] pt-1">
                        Trabecular bone mineral density index proxy.
                      </p>
                    </div>
                  </div>

                  {/* Clinician Action Recommendations */}
                  <div className="p-5 rounded-2xl bg-[#dae3ec]/50 border border-[#bac7b6] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] flex items-center gap-1.5">
                      <InfoIcon className="w-4 h-4 text-[#1e293b]" />
                      Suggested Clinical Next Steps
                    </h4>
                    <ul className="text-xs text-[#334155] space-y-1.5 list-disc pl-4">
                      {calculatedSarcopenia.includes("Severe") || calculatedSarcopenia.includes("Probable") ? (
                        <>
                          <li>Priority referral for DXA body composition scan confirmation and geriatric assessment.</li>
                          <li>Recommend structured progressive resistance strength training & protein nutritional guidance.</li>
                          <li>Schedule follow-up handgrip assessment in 90 days.</li>
                        </>
                      ) : calculatedSarcopenia.includes("Possible") ? (
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

                  {/* Doctor Override Simulator */}
                  <div className="pt-2 border-t border-[#e8e8e8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1e293b]">
                      <input
                        type="checkbox"
                        checked={doctorOverride}
                        onChange={(e) => setDoctorOverride(e.target.checked)}
                        className="rounded accent-[#8c9e88] w-4 h-4"
                      />
                      <span>Doctor Override (Apply independent clinical assessment)</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => alert("Report generated in local MinIO store. PDF export ready.")}
                        className="px-3.5 py-1.5 rounded-xl bg-[#bac7b6] hover:bg-[#8c9e88] text-[#1e293b] hover:text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Export Clinical PDF
                      </button>
                    </div>
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
              Nurse or radiographer captures 3 grip trials on the BLE dynamometer and uploads the knee AP radiograph directly from Orthanc PACS.
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
                At screening threshold against reference DEXA DXA measurements.
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
              Fast intake UI to capture BLE grip dynamometer measurements, verify image quality, and trigger inference.
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
