import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const team = [
  {
    name: "Sanjana",
    role: "Founder & Lead Developer",
    image: "https://rjuhackfest.vercel.app/sanjana.jpg",
    bio: "Passionate about cybersecurity and AI-driven solutions.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Bikram",
    role: "ML Engineer",
    image: "https://rjuhackfest.vercel.app/bikram.jpg",
    bio: "Expert in machine learning algorithms and data science.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Sushmita",
    role: "Full Stack Developer",
    image: "https://rjuhackfest.vercel.app/sushmita.jpeg",
    bio: "Building scalable web applications with modern technologies.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Bishi",
    role: "Backend Developer",
    image: "Bishi.jpeg",
    bio: "Specialized in robust backend systems and APIs.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Brikhesh",
    role: "Frontend Stack Developer",
    image: "Gajendra.jpeg",
    bio: "Creating beautiful and intuitive user interfaces.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
];

export default function Team() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The talented individuals behind PhishGuard, working together to make the internet safer for everyone.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-teal-100 group-hover:border-teal-300 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-teal-600 font-semibold text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <a
                  href={member.social.github}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={member.social.linkedin}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={member.social.twitter}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Join the team section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Want to Join Our Team?</h3>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals passionate about cybersecurity and AI.
            </p>
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
