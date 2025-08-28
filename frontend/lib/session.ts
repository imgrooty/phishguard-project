// frontend/lib/session.ts
let cached: string | null = null;

export function setToken(t: string | null) {
  cached = t;
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem("pg_token", t);
  else localStorage.removeItem("pg_token");
}

export function getToken(): string | null {
  if (cached) return cached;
  if (typeof window === "undefined") return null;
  cached = localStorage.getItem("pg_token");
  return cached;
}
