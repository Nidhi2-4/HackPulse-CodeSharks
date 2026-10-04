"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Findings } from "@/components/app";
import { analyze, gripCutoff, newId, update, useStore, type Screening } from "@/lib/store";

const STEPS = ["Clinical inputs", "Handgrip", "X-ray upload & QC", "Analysis", "Results & review"];
const PHASES = ["Quality check", "Segmenting bone and soft tissue", "Measuring muscle features", "Osteoporosis classifier", "Fusion model"];
const HANDS = ["right", "left"] as const;
const num = (s: string) => (s === "" ? undefined : Number(s));

export default function ScreeningWizard() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { patients, user } = useStore();
  const patient = patients.find((p) => p.id === id);

  const [step, setStep] = useState(0);
  const [clin, setClin] = useState({ sarcF: "", chairStand: "", calfCm: "" });
  const [grip, setGrip] = useState({ right: ["", "", ""], left: ["", "", ""] });
  const [xray, setXray] = useState<{ name: string; url?: string; ok: boolean; msg: string } | null>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (step !== 3) return;
    const t = setInterval(() => setPhase((p) => Math.min(p + 1, PHASES.length)), 700);
    return () => clearInterval(t);
  }, [step]);

  if (!patient) return <p>Patient not found.</p>;
  const current = step === 3 && phase >= PHASES.length ? 4 : step;
  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };
  const best = Math.max(0, ...[...grip.right, ...grip.left].map(Number));
  const cutoff = gripCutoff(patient.sex);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return setXray(null);
    const name = file.name;
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "dcm") return setXray({ name, ok: true, msg: "DICOM accepted. View and crop checks run on the server." });
    if (!["jpg", "jpeg", "png"].includes(ext)) return setXray({ name, ok: false, msg: "Unsupported file. Use DICOM, JPG or PNG." });
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch {
      return setXray({ name, ok: false, msg: "Could not read this image." });
    }
    const size = `${img.naturalWidth} x ${img.naturalHeight}`;
    const ok = Math.min(img.naturalWidth, img.naturalHeight) >= 512;
    setXray({
      name,
      url,
      ok,
      msg: ok
        ? `Resolution OK (${size}). Wrong-view and cropped-edge checks run on the server.`
        : `Image too small (${size}). The short side must be at least 512 px.`,
    });
  }

  const input = {
    right: grip.right.map(Number),
    left: grip.left.map(Number),
    sarcF: num(clin.sarcF),
    chairStand: num(clin.chairStand),
    calfCm: num(clin.calfCm),
  };
  const result = current === 4 ? analyze(patient, input) : null;

  function save() {
    const s: Screening = {
      id: newId(),
      patientId: patient!.id,
      date: new Date().toISOString().slice(0, 10),
      xray: xray!.name, // only the file name is kept; the image never leaves this browser tab
      by: user!.name,
      ...input,
      ...result!,
      finalized: false,
    };
    update((st) => ({ screenings: [s, ...st.screenings] }), `Screened patient ${patient!.mrn}`);
    router.push(`/reports/${s.id}`);
  }

  return (
    <>
      <h1 className="h1">
        Screening <small className="text-sm font-normal text-[#64748b]">{patient.name}</small>
      </h1>
      <ol className="flex flex-wrap gap-2 text-xs font-semibold">
        {STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === current ? "step" : undefined}
            className="rounded-full bg-white px-3 py-1 text-[#64748b] aria-[current]:bg-[#5f7a5a] aria-[current]:text-white"
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {current === 0 && (
        <form onSubmit={next} className="card grid max-w-2xl gap-4 sm:grid-cols-3">
          <p className="text-sm text-[#64748b] sm:col-span-3">All three are optional. Leave blank if not measured.</p>
          <label className="label">
            SARC-F score (0 to 10)
            <input type="number" min={0} max={10} className="input" value={clin.sarcF} onChange={(e) => setClin({ ...clin, sarcF: e.target.value })} />
          </label>
          <label className="label">
            5-chair-stand time (s)
            <input type="number" min={1} max={120} step="0.1" className="input" value={clin.chairStand} onChange={(e) => setClin({ ...clin, chairStand: e.target.value })} />
          </label>
          <label className="label">
            Calf circumference (cm)
            <input type="number" min={15} max={70} step="0.1" className="input" value={clin.calfCm} onChange={(e) => setClin({ ...clin, calfCm: e.target.value })} />
          </label>
          <button className="btn sm:col-span-3 sm:justify-self-end">Next</button>
        </form>
      )}

      {current === 1 && (
        <form onSubmit={next} className="card max-w-2xl space-y-4">
          <p className="text-sm text-[#64748b]">Three trials per hand, in kg. The best value is used.</p>
          {HANDS.map((hand) => (
            <fieldset key={hand} className="grid grid-cols-3 gap-3">
              <legend className="label mb-1 capitalize">{hand} hand</legend>
              {grip[hand].map((v, i) => (
                <input
                  key={i}
                  type="number"
                  required
                  min={1}
                  max={100}
                  step="0.1"
                  aria-label={`${hand} hand trial ${i + 1}`}
                  placeholder={`Trial ${i + 1}`}
                  className="input"
                  value={v}
                  onChange={(e) => setGrip({ ...grip, [hand]: grip[hand].with(i, e.target.value) })}
                />
              ))}
            </fieldset>
          ))}
          <p className="text-sm">
            Best: <strong>{best || "-"} kg</strong>. AWGS 2019 cutoff for this patient: {cutoff} kg.
            {best > 0 && <strong className={best < cutoff ? "text-red-700" : "text-emerald-700"}> {best < cutoff ? "Low grip strength" : "Normal"}</strong>}
          </p>
          <div className="flex justify-between">
            <button type="button" className="btn-ghost" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="btn">Next</button>
          </div>
        </form>
      )}

      {current === 2 && (
        <form
          onSubmit={(e) => {
            setPhase(0);
            next(e);
          }}
          className="card max-w-2xl space-y-4"
        >
          <label className="label">
            Knee AP X-ray (DICOM, JPG or PNG)
            <input type="file" required accept=".dcm,.jpg,.jpeg,.png" className="input" onChange={pick} />
          </label>
          {xray && (
            <p role="status" className={`text-sm font-medium ${xray.ok ? "text-emerald-700" : "text-red-700"}`}>
              {xray.msg}
            </p>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
          {xray?.url && <img src={xray.url} alt="Uploaded knee X-ray preview" className="max-h-72 rounded-lg" />}
          <div className="flex justify-between">
            <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn" disabled={!xray?.ok}>
              Run analysis
            </button>
          </div>
        </form>
      )}

      {current === 3 && (
        <section className="card max-w-2xl space-y-3" aria-live="polite">
          <progress value={phase} max={PHASES.length} className="h-2 w-full accent-[#5f7a5a]" />
          <p className="text-sm font-medium">{PHASES[phase]}...</p>
        </section>
      )}

      {result && (
        <section className="space-y-4">
          <Findings patient={patient} r={{ ...input, ...result }} />
          <div className="flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn" onClick={save}>
              Save and open report
            </button>
          </div>
        </section>
      )}
    </>
  );
}
