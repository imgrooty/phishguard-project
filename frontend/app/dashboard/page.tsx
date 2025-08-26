"use client";

import React, { useState, useEffect } from "react";
import { Inbox, UserCircle } from "lucide-react";

// ------------------ TYPES ------------------
interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
}

interface Email {
  id: string;
  from: string;
  subject?: string;
  snippet: string;
  date: string;
}

// ------------------ EMAILS COMPONENT ------------------
const EmailsPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/emails/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) setEmails(data);
        else setEmails([]);
      } catch (err) {
        console.error("Error fetching emails:", err);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
    const interval = setInterval(fetchEmails, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <p className="text-gray-600">Loading emails...</p>;
  if (emails.length === 0)
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Inbox</h3>
        <p className="text-gray-500">No emails found.</p>
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Inbox</h3>
      <div className="space-y-3">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
          >
            <h4 className="font-medium text-gray-900">{email.subject || "(No subject)"}</h4>
            <p className="text-sm text-gray-600">{email.snippet}</p>
            <p className="text-xs text-gray-400 mt-1">From: {email.from}</p>
            <p className="text-xs text-gray-400">
              Date: {new Date(email.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------ PROFILE COMPONENT ------------------
const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-6 bg-white rounded-xl shadow-lg w-full">
      <div className="space-y-4 w-full max-w-md">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</h3>
          <p className="text-xl font-semibold text-gray-800">{user.name}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
          <p className="text-xl font-semibold text-gray-800">{user.email}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</h3>
          <p className="text-sm font-mono text-gray-700">{user.id}</p>
        </div>
        {user.provider && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Provider</h3>
            <p className="text-sm text-gray-700">{user.provider}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ------------------ DASHBOARD COMPONENT ------------------
const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [dashboardPage, setDashboardPage] = useState<"profile" | "emails">("profile");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Dashboard</h2>
          <button
            onClick={() => {
              window.history.pushState({}, document.title, "/");
              window.location.reload();
            }}
            className="text-sm text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-4 p-2 bg-white rounded-lg shadow mb-4">
          <button
            onClick={() => setDashboardPage("profile")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              dashboardPage === "profile"
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserCircle className="w-5 h-5 mr-2" /> Profile
          </button>
          <button
            onClick={() => setDashboardPage("emails")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              dashboardPage === "emails"
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Inbox className="w-5 h-5 mr-2" /> Emails
          </button>
        </nav>

        {/* Main Content */}
        {dashboardPage === "profile" ? <ProfilePage user={user} /> : <EmailsPage userId={user.id} />}
      </div>
    </div>
  );
};

export default Dashboard;
