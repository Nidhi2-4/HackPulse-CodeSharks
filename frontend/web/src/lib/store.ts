"use client";

import { useSyncExternalStore } from "react";

export type Role = "admin" | "doctor" | "technician";
export type Sex = "M" | "F";
export type Stage = "none" | "possible" | "probable" | "severe";
export type Tier = "low" | "moderate" | "high";

export type User = { name: string; email: string; role: Role };
export type Patient = {
  id: string;
  mrn: string;
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  phone?: string;
};
export type ScreeningInput = {
  left: number[];
  right: number[];
  sarcF?: number;
  chairStand?: number;
  calfCm?: number;
};
export type Screening = ScreeningInput & {
  id: string;
  patientId: string;
  date: string;
  xray: string;
  by: string;
  bestGrip: number;
  features: { thigh: number; calf: number; plateau: number; areaRatio: number };
  sarcoProb: number;
  stage: Stage;
  osteoProb: number;
  osteoTier: Tier;
  override?: { stage: Stage; reason: string; by: string };
  finalized: boolean;
};
export type Audit = { at: string; user: string; action: string };
type State = { ready: boolean; user: User | null; patients: Patient[]; screenings: Screening[]; audit: Audit[] };

export const USERS: User[] = [
  { name: "Dr. Meera Iyer", email: "doctor@sarcoscan.local", role: "doctor" },
  { name: "Rohit Kulkarni", email: "tech@sarcoscan.local", role: "technician" },
  { name: "Asha Verma", email: "admin@sarcoscan.local", role: "admin" },
];

export const STAGE: Record<Stage, { label: string; cls: string; action: string }> = {
  none: { label: "No sarcopenia", cls: "bg-emerald-100 text-emerald-800", action: "No referral needed. Re-screen in 12 months." },
  possible: {
    label: "Possible",
    cls: "bg-amber-100 text-amber-800",
    action: "Advise resistance exercise and protein intake. Re-screen in 6 months.",
  },
  probable: {
    label: "Probable",
    cls: "bg-orange-100 text-orange-800",
    action: "Refer for DEXA or BIA confirmation. Start physiotherapy and nutrition review.",
  },
  severe: {
    label: "Severe",
    cls: "bg-red-100 text-red-800",
    action: "Urgent referral for DEXA confirmation, falls-risk assessment and geriatric review.",
  },
};
export const TIER: Record<Tier, { label: string; cls: string }> = {
  low: { label: "Low", cls: "bg-emerald-100 text-emerald-800" },
  moderate: { label: "Moderate", cls: "bg-amber-100 text-amber-800" },
  high: { label: "High", cls: "bg-red-100 text-red-800" },
};

// AWGS 2019 handgrip cutoffs (kg)
export const gripCutoff = (sex: Sex) => (sex === "M" ? 28 : 18);
export const THIGH_CUTOFF = 1.0;
export const CHAIR_CUTOFF = 12;
export const bmi = (p: Patient) => p.weightKg / (p.heightCm / 100) ** 2;
export const finalStage = (s: Screening) => s.override?.stage ?? s.stage;

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const r2 = (x: number) => Math.round(x * 100) / 100;

// ponytail: image features and probabilities are simulated from age, BMI and grip.
// Replace this function with the POST /api/v1/screenings result once the ML backend exists.
export function analyze(p: Patient, i: ScreeningInput) {
  const bestGrip = Math.max(...i.left, ...i.right);
  const cutoff = gripCutoff(p.sex);
  const b = bmi(p);
  const thigh = r2(Math.min(2.2, Math.max(0.4, 1.15 + (b - 22) * 0.05 - (p.age - 60) * 0.012 + (bestGrip / cutoff - 1) * 0.35)));
  const lowGrip = bestGrip < cutoff;
  const lowMuscle = thigh < THIGH_CUTOFF;
  const lowPerf = (i.chairStand ?? 0) >= CHAIR_CUTOFF;
  const stage: Stage =
    !lowGrip && !lowPerf ? "none" : !lowMuscle ? "possible" : lowGrip && lowPerf ? "severe" : "probable";
  const osteoProb = r2(sigmoid(0.07 * (p.age - 65) + (p.sex === "F" ? 0.7 : 0) - 0.15 * (b - 22) - 0.6));
  return {
    bestGrip,
    features: { thigh, calf: r2(thigh * 0.82), plateau: r2(thigh * 1.9), areaRatio: r2(thigh / (thigh + 1)) },
    sarcoProb: r2(
      sigmoid(3.2 * (1 - bestGrip / cutoff) + 2.5 * (1 - thigh) + 0.04 * (p.age - 65) + (lowPerf ? 0.8 : 0) + ((i.sarcF ?? 0) >= 4 ? 0.5 : 0) - 1),
    ),
    stage,
    osteoProb,
    osteoTier: (osteoProb < 0.33 ? "low" : osteoProb < 0.66 ? "moderate" : "high") as Tier,
  };
}

function seed(): Omit<State, "ready"> {
  const patients: Patient[] = [
    { id: "p1", mrn: "SS-1001", name: "Ramesh Patil", age: 72, sex: "M", heightCm: 165, weightKg: 58, phone: "9800000001" },
    { id: "p2", mrn: "SS-1002", name: "Sunita Deshmukh", age: 68, sex: "F", heightCm: 152, weightKg: 49, phone: "9800000002" },
    { id: "p3", mrn: "SS-1003", name: "Abdul Shaikh", age: 64, sex: "M", heightCm: 170, weightKg: 76 },
    { id: "p4", mrn: "SS-1004", name: "Lakshmi Nair", age: 81, sex: "F", heightCm: 148, weightKg: 42, phone: "9800000004" },
    { id: "p5", mrn: "SS-1005", name: "Harish Gupta", age: 59, sex: "M", heightCm: 172, weightKg: 80 },
  ];
  const visits: [string, string, number, number, number?][] = [
    ["p1", "2026-03-12", 29, 28],
    ["p1", "2026-06-20", 26, 25, 11],
    ["p1", "2026-09-28", 23, 22, 14],
    ["p2", "2026-05-02", 19, 17],
    ["p2", "2026-09-15", 17, 16, 10],
    ["p3", "2026-08-21", 36, 34],
    ["p4", "2026-09-30", 13, 12, 16],
  ];
  const screenings = visits.map(([patientId, date, r, l, chairStand], n): Screening => {
    const input = { right: [r - 2, r, r - 1], left: [l - 1, l, l - 2], chairStand, sarcF: chairStand ? 4 : 1 };
    return {
      id: `s${n + 1}`,
      patientId,
      date,
      xray: `knee_ap_${patientId}_${date}.dcm`,
      by: USERS[1].name,
      ...input,
      ...analyze(patients.find((p) => p.id === patientId)!, input),
      finalized: date < "2026-09-20",
    };
  });
  return { user: null, patients, screenings, audit: [] };
}

const KEY = "sarcoscan-v1";
const server: State = { ready: false, user: null, patients: [], screenings: [], audit: [] };
let state: State | null = null;
const subs = new Set<() => void>();

function get(): State {
  if (!state) {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    } catch {}
    state = { ...(saved ?? seed()), ready: true };
  }
  return state!;
}

/** Apply a change, persist it, and (when `action` is given) append an audit log entry. */
export function update(fn: (s: State) => Partial<State>, action?: string) {
  const s = get();
  const next = { ...s, ...fn(s) };
  if (action) {
    next.audit = [{ at: new Date().toISOString(), user: (next.user ?? s.user)?.name ?? "system", action }, ...next.audit];
  }
  state = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  subs.forEach((f) => f());
}

export function resetDemo() {
  localStorage.removeItem(KEY);
  state = null;
  subs.forEach((f) => f());
}

export const newId = () => Date.now().toString(36);

export const useStore = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    get,
    () => server,
  );
