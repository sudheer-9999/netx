"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useState } from "react";

export default function RegisterButton() {
  const [isPopping, setIsPopping] = useState(false);

  const triggerConfetti = () => {
    setIsPopping(true);

    // Multiple confetti effects
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
    });

    // Side cannons
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#06b6d4", "#3b82f6"],
    });

    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#8b5cf6", "#10b981"],
    });

    // Stars effect
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        scalar: 0.8,
        shapes: ["star"],
        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
      });
    }, 250);

    // Firework effect
    setTimeout(() => {
      const end = Date.now() + 1000;
      const colors = ["#06b6d4", "#3b82f6"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }, 1000);

    // Reset after animation
    setTimeout(() => setIsPopping(false), 2000);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerConfetti();

    setTimeout(() => {
      window.open(
        "https://app.formsuite.co/l/Hcfz866IWmf0vBll2T?fbclid=PAb21jcANktnhleHRuA2FlbQIxMQABp0oiEZonRn4M_oas_jNAYZDn1UBfZp3c8IK_AWdXrRK1QCI4CT3o-vd7G12s_aem_cztf7aPl1edN8qn6-I80fg",
        "_blank"
      );
    }, 2500);
  };

  return (
    <motion.a
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-lg relative overflow-hidden cursor-pointer"
    >
      {/* Ripple effect */}
      {isPopping && (
        <motion.div
          className="absolute inset-0 bg-cyan-400 rounded-lg"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Button text with glow */}
      <motion.span
        animate={
          isPopping
            ? {
                scale: [1, 1.1, 1],
                textShadow: ["0 0 0px #fff", "0 0 20px #fff", "0 0 0px #fff"],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        Register Now
      </motion.span>
    </motion.a>
  );
}
