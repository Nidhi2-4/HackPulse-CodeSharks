"use client";

import { useState } from "react";
import { resetDemo, useStore } from "@/lib/store";

export default function Settings() {
  const { user } = useStore();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <h1 className="h1">Settings</h1>
      <dl className="card grid max-w-xl grid-cols-[6rem_1fr] gap-2 text-sm">
        <dt className="text-[#64748b]">Name</dt>
        <dd>{user?.name}</dd>
        <dt className="text-[#64748b]">Email</dt>
        <dd>{user?.email}</dd>
        <dt className="text-[#64748b]">Role</dt>
        <dd className="capitalize">{user?.role}</dd>
      </dl>
      <section className="card max-w-xl space-y-3">
        <h2 className="h2">Demo data</h2>
        <p className="text-sm text-[#64748b]">
          All data is stored in this browser only. Resetting removes every patient and screening you added and signs you out.
        </p>
        {confirming ? (
          <button className="btn bg-red-700 hover:bg-red-800" onClick={resetDemo}>
            Yes, erase and reset
          </button>
        ) : (
          <button className="btn-ghost" onClick={() => setConfirming(true)}>
            Reset demo data
          </button>
        )}
      </section>
    </>
  );
}
