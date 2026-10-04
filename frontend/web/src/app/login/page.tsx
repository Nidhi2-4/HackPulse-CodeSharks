"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { USERS, update } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const user = USERS.find((u) => u.email === String(data.get("email")).trim().toLowerCase());
    // ponytail: demo auth, any non-empty password. Swap for POST /api/v1/auth/login (JWT) with the backend.
    if (!user || !data.get("password")) return setError("Unknown email or empty password.");
    update(() => ({ user }), "Logged in");
    router.replace("/dashboard");
  }

  return (
    <main className="m-auto w-full max-w-sm p-4">
      <h1 className="h1 text-center">SarcoScan</h1>
      <p className="mt-1 mb-6 text-center text-sm text-[#64748b]">Sign in to the clinic dashboard</p>
      <form onSubmit={submit} className="card space-y-4">
        <label className="label">
          Email
          <input name="email" type="email" required autoFocus className="input" defaultValue="doctor@sarcoscan.local" />
        </label>
        <label className="label">
          Password
          <input name="password" type="password" required className="input" />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="btn w-full">Sign in</button>
      </form>
      <p className="mt-4 text-xs text-[#64748b]">
        Demo accounts (any password): {USERS.map((u) => u.email).join(", ")}
      </p>
      <Link href="/" className="mt-4 block text-center text-sm underline">
        Back to home
      </Link>
    </main>
  );
}
