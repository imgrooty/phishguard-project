"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      
      <h1>I am Grooty</h1>
    </div>
  );
}
