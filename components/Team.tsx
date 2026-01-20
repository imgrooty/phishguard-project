import React from "react";
import { Github, Linkedin, Twitter, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    image: "https://avatars.githubusercontent.com/u/225837697?v=4",
    bio: "Specialized in robust backend systems and APIs.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
  {
    name: "Brikhesh",
    role: "Frontend Stack Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Creating beautiful and intuitive user interfaces.",
    social: { github: "#", linkedin: "#", twitter: "#" }
  },
];

export default function Team() {
  return (
    <section className="bg-gray-50 py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Users className="w-6 h-6 text-teal-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Meet Our <span className="text-teal-600">Visionaries</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
          >
            The experts working tirelessly to redefine digital security and make the internet a safer place for everyone.
          </motion.p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-[2.5rem] p-8 text-center border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 transition-all duration-500 relative z-10">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-teal-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">{member.bio}</p>

                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  {[
                    { icon: <Github className="w-4 h-4" />, link: member.social.github },
                    { icon: <Linkedin className="w-4 h-4" />, link: member.social.linkedin },
                    { icon: <Twitter className="w-4 h-4" />, link: member.social.twitter }
                  ].map((soc, idx) => (
                    <motion.a
                      key={idx}
                      whileHover={{ y: -3, scale: 1.1 }}
                      href={soc.link}
                      className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-all duration-300"
                    >
                      {soc.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Decorative background shape */}
              <div className="absolute top-4 left-4 right-4 bottom-4 bg-teal-600/5 rounded-[2.5rem] -rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Join the team section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="bg-white rounded-[3rem] p-12 max-w-4xl mx-auto shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ready to Secure the Future?</h3>
              <p className="text-gray-500 font-medium mb-8 max-w-xl mx-auto">
                We're always looking for brilliant minds passionate about AI and cybersecurity. Join our mission today.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
              >
                Explore Opportunities
              </motion.button>
            </div>

            {/* Decorative background */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-50 rounded-full blur-[80px] group-hover:bg-teal-100 transition-colors duration-500"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-[80px] group-hover:bg-blue-100 transition-colors duration-500"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
