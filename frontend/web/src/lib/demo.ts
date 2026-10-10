// Demo accounts for the hackathon, public on purpose: made-up patients only. The login page lists
// them; the Admin page creates them in one click and can deactivate them. Remove before real use.
// No admin account here: a public admin could lock everyone else out.
export const DEMO_PASSWORD = "SarcoScan-Demo-2026";

export const DEMO_ACCOUNTS = [
  { name: "Demo Doctor", role: "doctor", label: "Doctor", email: "demo.doctor@sarcoscan.local" },
  { name: "Demo Technician", role: "technician", label: "Technician", email: "demo.technician@sarcoscan.local" },
] as const;
