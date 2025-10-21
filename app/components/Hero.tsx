"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative pt-20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-6xl md:text-8xl font-bold mb-6 font-orbitron"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              NetX
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-cyan-200">
              Your Vision. <span className="text-cyan-400">Our Execution.</span>
            </h2>
            <p className="text-xl md:text-2xl text-cyan-200 max-w-3xl mx-auto">
              Professional event orchestration company organizing everything
              from thrilling sports tournaments to high-energy corporate and
              social events.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-lg w-full sm:w-auto"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Plan Your Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg text-lg w-full sm:w-auto hover:bg-cyan-500/10"
              onClick={() =>
                document
                  .getElementById("tournament")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Serve & Flex 2025
            </motion.button>
          </motion.div>

          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              {
                icon: "🏆",
                title: "Sports Tournaments",
                desc: "Badminton, Football & More",
              },
              {
                icon: "💼",
                title: "Corporate Events",
                desc: "Launches & Meetings",
              },
              {
                icon: "🎉",
                title: "Social Events",
                desc: "Parties & Celebrations",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {item.title}
                </h3>
                <p className="text-cyan-200">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
