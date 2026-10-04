"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useStore } from "@/lib/store";

// Local demo only: read from .env.local, which is never committed. Empty in any build without it,
// and then the demo buttons are not shown at all.
const DEMO_PASSWORDS: Record<string, string> = JSON.parse(process.env.NEXT_PUBLIC_DEMO_LOGINS || "{}");

export default function Login() {
  const router = useRouter();
  const { ready, user } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <main className="m-auto w-full max-w-sm p-4">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <Image src="/logo-mark.png" alt="" width={40} height={50} priority />
        <h1 className="h1">Sign in to SarcoScan</h1>
        <p className="text-sm text-[#64748b]">For clinic staff: technicians, doctors and admins.</p>
      </div>

      <form onSubmit={submit} className="card space-y-4">
        <label className="label">
          Work email
          <input
            type="email"
            required
            autoFocus
            autoComplete="username"
            placeholder="name@hospital.org"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              className="input pr-16"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-pressed={show}
              className="absolute inset-y-0 right-0 mt-1 px-3 text-xs font-semibold text-[#0369a1]"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}. Check the email and password. After five wrong tries, wait a minute.
          </p>
        )}
        <button className="btn w-full" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {Object.keys(DEMO_PASSWORDS).length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
          Demo accounts on this machine:
          {Object.entries(DEMO_PASSWORDS).map(([role, demoPassword]) => (
            <button
              key={role}
              type="button"
              className="btn-ghost px-2 py-1 text-xs capitalize"
              onClick={() => {
                setEmail(`${role}@sarcoscan.local`);
                setPassword(demoPassword);
                setError("");
              }}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      <section className="mt-6 rounded-xl border border-[#e2e8f0] bg-white p-4 text-sm">
        <h2 className="font-semibold">Need an account?</h2>
        <p className="mt-1 text-[#64748b]">
          There is no public sign-up, because an account opens patient records. Ask your hospital&apos;s SarcoScan admin:
          they create accounts from the Admin page.
        </p>
      </section>

      <Link href="/" className="mt-4 block text-center text-sm underline">
        Back to home
      </Link>
    </main>
  );
}
