"use client";
import { useEffect, useState } from "react";
import { getToken, setToken } from "@/lib/session";
import { apiFetch } from "@/lib/api";

type Email = { id: number; user_id: string; from_email: string; subject: string; body: string; raw?: string | null };

export default function Dashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    apiFetch<Email[]>("/emails").then(setEmails).catch(e => setError(String(e)));
  }, []);

  const logout = () => { setToken(null); window.location.href="/"; };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={logout} className="px-3 py-1 rounded border">Logout</button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {emails.map(e => (
          <li key={e.id} className="border rounded p-3">
            <div className="font-medium">{e.subject}</div>
            <div className="text-sm text-gray-600">{e.from_email}</div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{e.body.slice(0, 300)}</p>
          </li>
        ))}
        {emails.length === 0 && <p className="text-sm text-gray-600">No emails yet.</p>}
      </ul>
    </div>
  );
}
