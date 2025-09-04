import React from "react";
import { Github, Linkedin, Shield, Code, Brain, Server, Monitor } from "lucide-react";

const team = [
  {
    name: "Sanjana",
    role: "Founder & Lead Developer",
    image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: Shield,
    specialty: "Cybersecurity Architecture",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    name: "Bikram",
    role: "ML Engineer",
    image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: Brain,
    specialty: "AI Threat Detection",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Sushmita",
    role: "Full Stack Developer",
    image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: Code,
    specialty: "Security Integration",
    gradient: "from-green-500 to-teal-500"
  },
  {
    name: "Bishi",
    role: "Backend Developer",
    image: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: Server,
    specialty: "Infrastructure Security",
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "Brikhesh",
    role: "Frontend Developer",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400",
    icon: Monitor,
    specialty: "Security UX/UI",
    gradient: "from-indigo-500 to-purple-500"
  },
];

export default function Team() {
  return (
    <section className="relative py-24 bg-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Elite Security Team
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Meet the cybersecurity experts protecting millions of users worldwide with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => {
            const IconComponent = member.icon;
            return (
              <div
                key={i}
                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 animate-fade-in-up"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Profile Image with Cyber Frame */}
                  <div className="relative mx-auto mb-4 w-24 h-24">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${member.gradient} p-0.5 animate-pulse-glow`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Role Icon */}
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center border-2 border-slate-800`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-400 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-slate-400 mb-4">{member.specialty}</p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-cyan-500 transition-colors">
                      <Github className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <div className="text-2xl font-bold text-cyan-400">15+</div>
            <div className="text-sm text-slate-400">Years Combined Experience</div>
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '1s'}}>
            <div className="text-2xl font-bold text-purple-400">500K+</div>
            <div className="text-sm text-slate-400">Threats Blocked</div>
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '1.2s'}}>
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-sm text-slate-400">Security Monitoring</div>
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '1.4s'}}>
            <div className="text-2xl font-bold text-red-400">0</div>
            <div className="text-sm text-slate-400">Successful Breaches</div>
          </div>
        </div>
      </div>
    </section>
  );
};

