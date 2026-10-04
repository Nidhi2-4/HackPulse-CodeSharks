"use client";

import Link from "next/link";
import { byDateDesc } from "@/components/app";
import { useStore } from "@/lib/store";

export default function Studies() {
  const { screenings, patients } = useStore();

  return (
    <>
      <h1 className="h1">Studies inbox</h1>
      <p className="text-sm text-[#64748b]">
        X-ray studies uploaded through screenings. Automatic import from the hospital PACS (Orthanc) is planned after the MVP.
      </p>
      <section className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Received</th>
              <th>File</th>
              <th>Patient</th>
              <th>Uploaded by</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[...screenings].sort(byDateDesc).map((s) => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.xray}</td>
                <td>{patients.find((p) => p.id === s.patientId)?.name ?? "Unassigned"}</td>
                <td>{s.by}</td>
                <td>
                  <Link href={`/reports/${s.id}`} className="font-semibold underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
