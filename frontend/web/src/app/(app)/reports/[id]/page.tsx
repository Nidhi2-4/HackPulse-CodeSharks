"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Findings, StageBadge } from "@/components/app";
import { STAGE, finalStage, update, useStore, type Screening, type Stage } from "@/lib/store";

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const { patients, screenings, user } = useStore();
  const s = screenings.find((x) => x.id === id);
  const p = patients.find((x) => x.id === s?.patientId);
  if (!s || !p) return <p>Report not found.</p>;

  const patch = (change: Partial<Screening>, action: string) =>
    update((st) => ({ screenings: st.screenings.map((x) => (x.id === id ? { ...x, ...change } : x)) }), `${action} for ${p.mrn}`);

  function override(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    patch({ override: { stage: f.get("stage") as Stage, reason: String(f.get("reason")).trim(), by: user!.name } }, "Overrode AI stage");
  }

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="h1">SarcoScan screening report</h1>
        <button className="btn-ghost no-print" onClick={() => window.print()}>
          Print / save PDF
        </button>
      </header>

      <dl className="card grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        {[
          ["Patient", `${p.name} (${p.mrn})`],
          ["Age / sex", `${p.age} / ${p.sex}`],
          ["Screening date", s.date],
          ["Captured by", s.by],
          ["X-ray file", s.xray],
          ["Status", s.finalized ? "Finalized" : "Pending doctor review"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-[#64748b]">{k}</dt>
            <dd className="font-semibold break-words">{v}</dd>
          </div>
        ))}
      </dl>

      <Findings patient={p} r={s} stage={finalStage(s)} />

      {s.override && (
        <p className="card text-sm">
          <strong>Doctor override by {s.override.by}:</strong> AI stage was <StageBadge stage={s.stage} />, changed to{" "}
          <StageBadge stage={s.override.stage} />. Reason: {s.override.reason}
        </p>
      )}

      {user?.role === "doctor" && !s.finalized && (
        <form onSubmit={override} className="card no-print grid gap-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-end">
          <label className="label">
            Override stage
            <select name="stage" defaultValue={finalStage(s)} className="input">
              {Object.entries(STAGE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            Reason (required)
            <input name="reason" required minLength={5} className="input" />
          </label>
          <button className="btn-ghost">Save override</button>
          <button type="button" className="btn" onClick={() => patch({ finalized: true }, "Finalized report")}>
            Finalize report
          </button>
        </form>
      )}

      <Link href={`/patients/${p.id}`} className="no-print text-sm underline">
        Back to patient
      </Link>
    </>
  );
}
