import React from "react";
import { Shield, Zap, Eye, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Advanced AI Detection",
    description: "Our machine learning models analyze emails, links, and websites in real-time to detect phishing attempts with high accuracy.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50"
  },
  {
    icon: Zap,
    title: "Instant Protection",
    description: "Get immediate alerts and protection before you click on suspicious links or open dangerous emails.",
    color: "bg-teal-500",
    lightColor: "bg-teal-50"
  },
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description: "Continuous monitoring of your online activities to ensure you're always protected from emerging threats.",
    color: "bg-purple-500",
    lightColor: "bg-purple-50"
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. We prioritize your privacy while keeping you secure.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50"
  }
];

export default function Features() {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block"
          >
            Core Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Powerful Features for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Complete Protection</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
          >
            PhishGuard combines cutting-edge AI technology with user-friendly design to provide comprehensive phishing protection across all your devices.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 hover:border-teal-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              <div className={`w-14 h-14 ${feature.lightColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`w-7 h-7 ${feature.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-teal-600 font-bold text-sm cursor-pointer group/link">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-teal-50 rounded-full blur-[100px] opacity-40 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] opacity-30 -z-10"></div>
    </section>
  );
}
