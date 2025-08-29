"use client";
import Hero from "@/components/Hero";
import Motivation from "@/components/Motivation";
import Team from "@/components/Team";
import { useState } from "react";
import { apiClient } from "@/lib/api";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://phishguard-api.onrender.com' : 'http://localhost:8000'}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age) }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('API Error:', error);
      setResult({ error: 'Failed to connect to API' });
    }
  };

  return (
    
    <div>
      <Hero/>
      <Team/>
      <Motivation/>


      {/* demo api */}
      <h2>DEMO API FETCH</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleSubmit} style={{backgroundColor:"blue", color: "black", padding: "4px", borderRadius:"20px"}}>Send to FastAPI</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
    </div>
  );
}
