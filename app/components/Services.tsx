"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const services = [
    {
      icon: "🏸",
      title: "Sports Tournaments",
      description:
        "Badminton, Football, Cricket tournaments with professional organization",
      features: [
        "Professional Referees",
        "Quality Equipment",
        "Prize Distribution",
        "Media Coverage",
      ],
    },
    {
      icon: "🎉",
      title: "Club Nights & Parties",
      description: "High-energy events with DJs, lighting, and entertainment",
      features: ["DJ & Music", "Lighting Effects", "Security", "Bar Services"],
    },
    {
      icon: "🎂",
      title: "Social Events",
      description: "Marriages, Birthdays, Annual Days & Special Celebrations",
      features: [
        "Theme Decoration",
        "Catering",
        "Photography",
        "Entertainment",
      ],
    },
    {
      icon: "💼",
      title: "Corporate Events",
      description: "Product Launches, Conferences, and Corporate Meetings",
      features: ["Branding", "AV Equipment", "Guest Management", "Networking"],
    },
  ];

  return (
    <section id="services" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          className="text-4xl md:text-6xl font-bold text-center mb-4 font-orbitron"
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            OUR SERVICES
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-cyan-200 text-center mb-12 max-w-2xl mx-auto"
        >
          Comprehensive event solutions tailored to your needs
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
              }
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl flex-shrink-0">{service.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-cyan-200 mb-4">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-cyan-100 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
