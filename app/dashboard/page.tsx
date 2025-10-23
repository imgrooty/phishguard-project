"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Save user info to your database only when logged in
      fetch("/api/save-user", { method: "POST" });
    } else if (status === "unauthenticated") {
      // Redirect to custom login page
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  // Once authenticated, show dashboard content
  if (status === "authenticated") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">Welcome, {session.user?.name} 👋</h1>
        <p className="text-gray-600 mt-3">You have successfully logged in.</p>
      </div>
    );
  }

  return null;
}
