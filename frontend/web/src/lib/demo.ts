// Demo accounts for the hackathon, public on purpose: made-up patients only. The login page lists
// them; the Admin page creates them in one click and can deactivate them. Remove before real use.
// Two doctors, so the demo shows that each doctor sees only their own patients.
// No admin account here: a public admin could lock everyone else out.
export const DEMO_PASSWORD = "SarcoScan-Demo-2026";

export const DEMO_ACCOUNTS = [
  { name: "Demo Doctor A", role: "doctor", label: "Doctor A", email: "demo.doctor.a@sarcoscan.local" },
  { name: "Demo Doctor B", role: "doctor", label: "Doctor B", email: "demo.doctor.b@sarcoscan.local" },
] as const;
