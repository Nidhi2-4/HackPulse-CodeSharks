"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/demo";
import { signIn, useStore } from "@/lib/store";

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

  async function signInAs(account: string, secret: string) {
    setBusy(true);
    setError("");
    try {
      await signIn(account, secret);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    signInAs(email.trim(), password);
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

      <section className="card mt-4 space-y-3 text-sm">
        <div>
          <h2 className="font-semibold">Try the demo</h2>
          <p className="text-xs text-[#64748b]">
            Sample accounts with made-up patients. Password for both: <code>{DEMO_PASSWORD}</code>
          </p>
        </div>
        {DEMO_ACCOUNTS.map((account) => (
          <div key={account.email} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium">{account.label}</p>
              <p className="break-all text-xs text-[#64748b]">{account.email}</p>
            </div>
            <button
              type="button"
              className="btn-ghost shrink-0 px-3 py-1 text-xs"
              disabled={busy}
              onClick={() => signInAs(account.email, DEMO_PASSWORD)}
            >
              Sign in as {account.role}
            </button>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-xl border border-[#e2e8f0] bg-white p-4 text-sm">
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
