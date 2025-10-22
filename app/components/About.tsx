"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: "execution",
      title: "End-to-End Event Management",
      description: "Complete planning and execution from concept to completion",
    },
    {
      icon: "branding",
      title: "Custom Themes & Branding",
      description: "Personalized event themes that match your vision",
    },
    {
      icon: "trusted-network",
      title: "Trusted Network",
      description: "Verified vendors, artists, and service providers",
    },
    {
      icon: "professional",
      title: "Professional Execution",
      description: "Experienced team ensuring flawless event delivery",
    },
  ];

  return (
    <section id="about" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Why NETX ?
            </span>
          </h2>
          <p className="text-xl text-cyan-200 max-w-4xl mx-auto mb-8">
            NetX is an all-in-one event orchestrator specializing in sports
            tournaments, corporate launches, and social celebrations. We
            transform your vision into unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 text-center"
            >
              <Player
                src={`/animations/${feature.icon}.json`}
                className="w-32 h-32"
                autoplay
                loop
                speed={1.5}
              />
              <h3 className="text-xl font-bold mb-3 text-cyan-400">
                {feature.title}
              </h3>
              <p className="text-cyan-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
