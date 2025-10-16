"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DownloadExtension from "@/components/DownloadExtension";
import DemoForm from "@/components/DemoForm";
import Motivation from "@/components/Motivation";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DownloadExtension />
      <DemoForm />
      <Motivation />
      <Team />
    </div>
  );
}
