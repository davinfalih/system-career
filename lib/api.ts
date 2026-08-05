import { getSessionToken } from "@/lib/session";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch<T = any>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function serverApi<T = any>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T }> {
  const token = await getSessionToken();
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
