"use client";

import { useRouter } from "next/navigation";
import { newId, update, type Patient, type Sex } from "@/lib/store";

export default function NewPatient() {
  const router = useRouter();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = newId();
    const patient: Patient = {
      id,
      mrn: `SS-${id.slice(-5).toUpperCase()}`,
      name: String(f.get("name")).trim(),
      age: Number(f.get("age")),
      sex: f.get("sex") as Sex,
      heightCm: Number(f.get("heightCm")),
      weightKg: Number(f.get("weightKg")),
      phone: String(f.get("phone")) || undefined,
    };
    update((s) => ({ patients: [patient, ...s.patients] }), `Registered patient ${patient.mrn}`);
    router.push(`/patients/${id}`);
  }

  return (
    <>
      <h1 className="h1">New patient</h1>
      <form onSubmit={submit} className="card grid max-w-2xl gap-4 sm:grid-cols-2">
        <label className="label sm:col-span-2">
          Full name
          <input name="name" required minLength={2} className="input" />
        </label>
        <label className="label">
          Age (years)
          <input name="age" type="number" required min={18} max={120} className="input" />
        </label>
        <label className="label">
          Sex
          <select name="sex" required className="input">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label>
        <label className="label">
          Height (cm)
          <input name="heightCm" type="number" required min={100} max={220} className="input" />
        </label>
        <label className="label">
          Weight (kg)
          <input name="weightKg" type="number" required min={25} max={250} step="0.1" className="input" />
        </label>
        <label className="label sm:col-span-2">
          Phone (optional)
          <input name="phone" type="tel" pattern="[0-9+ -]{7,15}" className="input" />
        </label>
        <button className="btn sm:col-span-2">Register patient</button>
      </form>
    </>
  );
}
