import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Motivation() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <ShieldCheck className="w-14 h-14 text-teal-600 mx-auto" />
        <h2 className="text-4xl font-bold mt-4 text-gray-800">
          Why We Built PhishGuard
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Every day, millions of users fall victim to phishing attacks.
          <span className="text-teal-600 font-semibold">
            {" "}
            PhishGuard
          </span>{" "}
          was born out of a mission to fight back using AI and machine learning.
          Our goal is simple: make the web safer for everyone.
        </p>
      </div>
    </section>
  );
}
