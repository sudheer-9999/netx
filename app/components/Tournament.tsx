"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import RegisterButton from "./buttons/RegisterButton";

export default function Tournament() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const categories = [
    { name: "Men's Singles (Open)", fee: "₹700" },
    { name: "Men's Jumbo Doubles 60+ (Non-Medalist)", fee: "₹1000" },
    { name: "Men's Doubles (Medalist)", fee: "₹1000" },
    { name: "Mixed Doubles (Open)", fee: "₹1000" },
    { name: "Women's Doubles (Open)", fee: "₹1000" },
  ];

  const prizes = [
    {
      position: "1st",
      amount: "₹6000",
      items: "Racket, T-shirt, Shorts, Kit Bag, Trophy",
    },
    { position: "2nd", amount: "₹4000", items: "Exciting Prizes & Trophy" },
  ];

  return (
    <section id="tournament" ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-orbitron">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SERVE & FLEX 2025
            </span>
          </h2>
          <p className="text-xl text-cyan-200">Badminton Tournament</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tournament Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20"
          >
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">
              Tournament Details
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                <span className="text-cyan-300">Date:</span>
                <span className="text-white font-semibold">
                  25th October 2025
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                <span className="text-cyan-300">Venue:</span>
                <span className="text-white font-semibold text-right">
                  SKBA VR Club Sports
                  <br />
                  Chandanagar, Hyderabad – 502032
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                <span className="text-cyan-300">Registration Deadline:</span>
                <span className="text-white font-semibold">
                  24th October 2025
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cyan-500/20">
                <span className="text-cyan-300">Shuttle Used:</span>
                <span className="text-white font-semibold">Mavis 350</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <p className="text-cyan-200 text-sm">
                <strong>Note:</strong> Once registered, fees are non-refundable.
                Management decision is final.
              </p>
            </div>
          </motion.div>

          {/* Categories & Prizes */}
          <div className="space-y-8">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Categories & Entry Fee
              </h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-cyan-500/10"
                  >
                    <span className="text-cyan-200">{category.name}</span>
                    <span className="text-cyan-400 font-bold">
                      {category.fee}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prizes */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Prizes</h3>
              <div className="space-y-4">
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30"
                  >
                    <div className="text-2xl font-bold text-cyan-400 mb-2">
                      {prize.position} Prize: {prize.amount}
                    </div>
                    <div className="text-cyan-200">{prize.items}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact & Registration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12 bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 text-center"
        >
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">
            Ready to Compete?
          </h3>
          <p className="text-cyan-200 mb-6">
            Contact us for registration and queries
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-cyan-300 font-semibold mb-2">Suresh</div>
              <div className="text-white text-lg">📞 6300508035</div>
            </div>
            <div>
              <div className="text-cyan-300 font-semibold mb-2">Management</div>
              <div className="text-white text-lg">📞 9010038666</div>
            </div>
          </div>

          <RegisterButton />
        </motion.div>
      </div>
    </section>
  );
}
