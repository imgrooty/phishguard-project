"use client";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    fetch("/api/save-user", { method: "POST" });
  }, []);

  return <h1>Welcome!</h1>;
}
