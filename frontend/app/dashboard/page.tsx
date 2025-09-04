"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  provider?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (session?.access_token) {
      fetch("/api/emails")
        .then((res) => res.json())
        .then((data) => {
          // Append provider to each email
          const allEmails: Email[] = (data.emails || []).map((email: any) => ({
            ...email,
            provider: data.provider,
          }));
          setEmails(allEmails);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (!session) return <p>Please log in first.</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name}</h1>
      <p className="mb-4">Email: {session.user?.email}</p>
      <button
        className="mb-6 px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => signOut()}
      >
        Sign Out
      </button>

      {loading ? (
        <p>Loading emails...</p>
      ) : emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className="border rounded shadow hover:bg-gray-50 transition p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {email.subject || "(No Subject)"}
                  </p>
                  <p className="text-sm text-gray-700">From: {email.from}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(email.date).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    email.provider === "google"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {email.provider?.toUpperCase()}
                </span>
              </div>

              <div className="mt-2">
                <p>
                  {expandedEmail === email.id
                    ? email.snippet
                    : `${email.snippet.slice(0, 150)}...`}
                </p>
                {email.snippet.length > 150 && (
                  <button
                    className="text-blue-500 text-sm mt-1"
                    onClick={() =>
                      setExpandedEmail(
                        expandedEmail === email.id ? null : email.id
                      )
                    }
                  >
                    {expandedEmail === email.id ? "Collapse" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
