import React from "react";
import { ShieldCheck, Target, Zap, Lock, Eye, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "AI-Powered Detection",
    description: "Advanced machine learning algorithms analyze threats in real-time",
    color: "cyan"
  },
  {
    icon: Target,
    title: "Zero-Day Protection",
    description: "Proactive defense against unknown and emerging threats",
    color: "purple"
  },
  {
    icon: Zap,
    title: "Instant Response",
    description: "Millisecond threat analysis and immediate protection activation",
    color: "green"
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Military-grade encryption and security protocols",
    color: "red"
  }
];

const threats = [
  { name: "Phishing Emails", blocked: "2.3M", color: "red" },
  { name: "Malicious Links", blocked: "1.8M", color: "orange" },
  { name: "Fake Websites", blocked: "950K", color: "yellow" },
  { name: "Social Engineering", blocked: "1.2M", color: "purple" }
];

export default function Motivation() {
  return (
    <section className="relative py-24 bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-6 py-3 text-red-400 border border-red-500/20 mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Critical Mission</span>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-6">
            Why <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">PhishGuard</span> Exists
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Every 39 seconds, a cyberattack occurs. Traditional security measures are no longer enough. 
            We built PhishGuard to fight back with AI-powered protection that evolves with emerging threats.
          </p>
        </div>

        {/* Threat Statistics */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Threats We've <span className="text-red-400">Neutralized</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {threats.map((threat, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center group hover:border-cyan-500/50 transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className={`text-3xl font-bold mb-2 ${
                  threat.color === 'red' ? 'text-red-400' :
                  threat.color === 'orange' ? 'text-orange-400' :
                  threat.color === 'yellow' ? 'text-yellow-400' :
                  'text-purple-400'
                }`}>
                  {threat.blocked}
                </div>
                <div className="text-slate-300 font-medium">{threat.name}</div>
                <div className="text-xs text-slate-500 mt-1">Blocked This Year</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={i}
                className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 animate-fade-in-up"
                style={{animationDelay: `${i * 0.2}s`}}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
                  feature.color === 'cyan' ? 'from-cyan-500/10 to-blue-500/10' :
                  feature.color === 'purple' ? 'from-purple-500/10 to-pink-500/10' :
                  feature.color === 'green' ? 'from-green-500/10 to-teal-500/10' :
                  'from-red-500/10 to-orange-500/10'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${
                    feature.color === 'cyan' ? 'from-cyan-500 to-blue-500' :
                    feature.color === 'purple' ? 'from-purple-500 to-pink-500' :
                    feature.color === 'green' ? 'from-green-500 to-teal-500' :
                    'from-red-500 to-orange-500'
                  } mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-12 text-center animate-fade-in-up">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
          
          <div className="relative z-10">
            <Eye className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse-glow" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Secure Your Digital Life?
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join millions of protected users and experience the future of cybersecurity. 
              Our AI never sleeps, so you can browse with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 glow-cyan">
                Start Free Trial
              </button>
              <button className="border-2 border-cyan-500/30 text-cyan-400 px-8 py-4 rounded-lg font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}