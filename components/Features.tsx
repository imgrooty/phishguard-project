import React from "react";
import { Shield, Zap, Eye, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Advanced AI Detection",
    description: "Our machine learning models analyze emails, links, and websites in real-time to detect phishing attempts with high accuracy."
  },
  {
    icon: Zap,
    title: "Instant Protection",
    description: "Get immediate alerts and protection before you click on suspicious links or open dangerous emails."
  },
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description: "Continuous monitoring of your online activities to ensure you're always protected from emerging threats."
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. We prioritize your privacy while keeping you secure."
  }
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Complete Protection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PhishGuard combines cutting-edge AI technology with user-friendly design to provide comprehensive phishing protection.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
