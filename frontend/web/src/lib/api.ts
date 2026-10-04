/**
 * SarcoScan Frontend API Client
 * Automatically routed through Next.js proxy to FastAPI backend (/api/v1)
 */

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "technician";
}

export interface PatientCreate {
  mrn: string;
  name: string;
  age: number;
  sex: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  phone: string;
  consent_given: boolean;
}

export interface AnalysisOutput {
  id: string;
  sarcopenia_stage: "none" | "possible" | "probable" | "severe";
  sarcopenia_prob?: number;
  osteoporosis_tier: "low" | "moderate" | "high";
  osteoporosis_prob: number;
  thigh_soft_to_bone?: number;
  calf_soft_to_bone?: number;
  kl_grade?: number;
  inference_ms: number;
  overlay_url?: string;
  gradcam_url?: string;
}

// In-memory token storage (XSS safe per SECURITY.md)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`/api/v1${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<TokenResponse> {
    const res = await request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(res.access_token);
    return res;
  },

  async getMe(): Promise<UserProfile> {
    return request<UserProfile>("/auth/me");
  },

  async logout(): Promise<void> {
    await request("/auth/logout", { method: "POST" });
    setAccessToken(null);
  },

  // Patients
  async createPatient(patient: PatientCreate) {
    return request("/patients", {
      method: "POST",
      body: JSON.stringify(patient),
    });
  },

  async getPatients(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/patients${query}`);
  },

  // Visits & Screening Flow
  async createVisit(patientId: string) {
    return request(`/patients/${patientId}/visits`, {
      method: "POST",
    });
  },

  async submitGrip(visitId: string, trials: { left: number[]; right: number[] }) {
    return request(`/visits/${visitId}/grip`, {
      method: "POST",
      body: JSON.stringify(trials),
    });
  },

  async uploadXray(visitId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/visits/${visitId}/xray`, {
      method: "POST",
      body: formData,
    });
  },

  async runAnalysis(visitId: string): Promise<AnalysisOutput> {
    return request<AnalysisOutput>(`/visits/${visitId}/analyze`, {
      method: "POST",
    });
  },

  async getResult(visitId: string): Promise<AnalysisOutput> {
    return request<AnalysisOutput>(`/visits/${visitId}/result`);
  },

  async submitReview(visitId: string, review: { final_stage: string; agrees_with_ai: boolean; notes: string }) {
    return request(`/visits/${visitId}/review`, {
      method: "POST",
      body: JSON.stringify(review),
    });
  },
};
