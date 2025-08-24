"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Motivation from "@/components/Motivation";
import Team from "@/components/Team";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    const res = await fetch("https://phishguard-project.onrender.com/predict", {
      // const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number(age) }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    
    <div>
      <Header/>
      <Hero/>
      <Team/>
      <Motivation/>
      <Footer/>


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
