// frontend/lib/api.ts
export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const { getToken } = await import("./session");
  const token = getToken();
  const headers = new Headers(opts.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  const base = process.env.NEXT_PUBLIC_API_BASE as string;
  const res = await fetch(`${base}${path}`, { ...opts, headers, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
