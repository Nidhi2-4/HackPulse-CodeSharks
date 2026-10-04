"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useStore } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const { ready, user } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await signIn(String(data.get("email")).trim(), String(data.get("password")));
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <main className="m-auto w-full max-w-sm p-4">
      <h1 className="h1 text-center">SarcoScan</h1>
      <p className="mt-1 mb-6 text-center text-sm text-[#64748b]">Sign in to the clinic dashboard</p>
      <form onSubmit={submit} className="card space-y-4">
        <label className="label">
          Email
          <input name="email" type="email" required autoFocus autoComplete="username" className="input" />
        </label>
        <label className="label">
          Password
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="btn w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-xs text-[#64748b]">Accounts are created by the hospital admin.</p>
      <Link href="/" className="mt-4 block text-center text-sm underline">
        Back to home
      </Link>
    </main>
  );
}
