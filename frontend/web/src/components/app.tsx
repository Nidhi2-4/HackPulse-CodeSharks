"use client";

import Link from "next/link";
import {
  CHAIR_CUTOFF,
  STAGE,
  THIGH_CUTOFF,
  TIER,
  bmi,
  finalStage,
  gripCutoff,
  useStore,
  type Patient,
  type Screening,
  type Stage,
  type Tier,
} from "@/lib/store";

export const StageBadge = ({ stage }: { stage: Stage }) => (
  <span className={`badge ${STAGE[stage].cls}`}>{STAGE[stage].label}</span>
);

export const TierBadge = ({ tier }: { tier: Tier }) => <span className={`badge ${TIER[tier].cls}`}>{TIER[tier].label}</span>;

export const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Screenings table shared by the dashboard, reports list and patient history. */
export function ScreeningTable({ rows }: { rows: Screening[] }) {
  const { patients } = useStore();
  if (!rows.length) return <p className="text-sm text-[#64748b]">No screenings yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Best grip</th>
            <th>Sarcopenia</th>
            <th>Osteoporosis risk</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const p = patients.find((x) => x.id === s.patientId);
            return (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{p ? <Link href={`/patients/${p.id}`}>{p.name}</Link> : "Unknown"}</td>
                <td>{s.bestGrip} kg</td>
                <td>
                  <StageBadge stage={finalStage(s)} /> {pct(s.sarcoProb)}
                </td>
                <td>
                  <TierBadge tier={s.osteoTier} /> {pct(s.osteoProb)}
                </td>
                <td>{s.finalized ? "Finalized" : "Pending review"}</td>
                <td>
                  <Link href={`/reports/${s.id}`} className="font-semibold underline">
                    Report
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const byDateDesc = (a: Screening, b: Screening) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id);

type Result = Pick<Screening, "bestGrip" | "features" | "sarcoProb" | "stage" | "osteoProb" | "osteoTier" | "sarcF" | "chairStand" | "calfCm">;

/** Result summary and measured-vs-cutoff table, shared by the wizard's last step and the report. */
export function Findings({ patient, r, stage = r.stage }: { patient: Patient; r: Result; stage?: Stage }) {
  const calfCut = patient.sex === "M" ? 34 : 33;
  const rows: [string, string, string, boolean][] = [
    ["Best handgrip", `${r.bestGrip} kg`, `< ${gripCutoff(patient.sex)} kg`, r.bestGrip < gripCutoff(patient.sex)],
    ["Thigh soft-tissue to bone ratio", `${r.features.thigh}`, `< ${THIGH_CUTOFF}`, r.features.thigh < THIGH_CUTOFF],
    ["Calf soft-tissue to bone ratio", `${r.features.calf}`, "-", false],
    ["Soft tissue to plateau width", `${r.features.plateau}`, "-", false],
    ["Soft-tissue area ratio", `${r.features.areaRatio}`, "-", false],
  ];
  if (r.chairStand != null) rows.push(["5-chair-stand time", `${r.chairStand} s`, `>= ${CHAIR_CUTOFF} s`, r.chairStand >= CHAIR_CUTOFF]);
  if (r.sarcF != null) rows.push(["SARC-F score", `${r.sarcF}`, ">= 4", r.sarcF >= 4]);
  if (r.calfCm != null) rows.push(["Calf circumference", `${r.calfCm} cm`, `< ${calfCut} cm`, r.calfCm < calfCut]);

  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <dt className="h2">Sarcopenia stage</dt>
          <dd>
            <StageBadge stage={stage} /> <span className="text-sm">probability {pct(r.sarcoProb)}</span>
          </dd>
        </div>
        <div className="card">
          <dt className="h2">Osteoporosis risk</dt>
          <dd>
            <TierBadge tier={r.osteoTier} /> <span className="text-sm">probability {pct(r.osteoProb)}</span>
          </dd>
        </div>
        <div className="card">
          <dt className="h2">BMI</dt>
          <dd className="text-xl font-bold">{bmi(patient).toFixed(1)}</dd>
        </div>
      </dl>
      <table className="table">
        <thead>
          <tr>
            <th>Measurement</th>
            <th>Value</th>
            <th>Flag when</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, cut, low]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{value}</td>
              <td>{cut}</td>
              <td className={low ? "font-semibold text-red-700" : ""}>{cut === "-" ? "" : low ? "Flagged" : "Normal"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm">
        <strong>Suggested action:</strong> {STAGE[stage].action}
      </p>
      <p className="text-xs text-[#64748b]">
        Demo mode: X-ray features and probabilities are simulated until the ML backend is connected. Screening aid only, not a
        diagnosis.
      </p>
    </>
  );
}
