import React from "react";
import Link from "next/link";
import { Download, Chrome, Globe, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function DownloadExtension() {
  return (
    <section className="bg-teal-900 py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center text-white mb-16">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            Stay Protected <span className="text-teal-400 text-glow">Everywhere</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-teal-100 opacity-90 max-w-2xl mx-auto font-medium"
          >
            Install our lightweight browser extension for real-time analysis of websites and links as you browse.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { name: "Chrome", icon: <Chrome className="w-12 h-12" />, color: "from-blue-500 to-blue-600", desc: "For Google Chrome" },
            { name: "Firefox", icon: <Globe className="w-12 h-12" />, color: "from-orange-500 to-orange-600", desc: "For Mozilla Firefox" },
            { name: "Safari", icon: <Compass className="w-12 h-12" />, color: "from-sky-500 to-sky-600", desc: "For Apple Safari" }
          ].map((browser, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 text-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${browser.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                <div className="text-white">
                  {browser.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{browser.name}</h3>
              <p className="text-teal-200/60 font-bold text-xs uppercase tracking-widest mb-8">{browser.desc}</p>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 bg-white text-teal-900 px-6 py-4 rounded-2xl font-black text-sm hover:bg-teal-50 transition-colors shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  Get Extension
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-full bg-black/20 border border-white/5 backdrop-blur-sm text-teal-100/60 text-xs font-black uppercase tracking-[0.2em]">
            <span>Free Download</span>
            <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
            <span>No Signup Required</span>
            <span className="w-1 h-1 bg-teal-500 rounded-full"></span>
            <span>Auto Updates</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500 rounded-full blur-[150px] opacity-20"></div>
    </section>
  );
}
