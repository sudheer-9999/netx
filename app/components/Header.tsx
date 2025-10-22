"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
  onSectionChange: (section: string) => void;
  currentSection: string;
}

export default function Header({
  onSectionChange,
  currentSection,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "tournament", label: "Serve & Flex 2025" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavigation = (sectionId: string) => {
    // Update the current section state
    onSectionChange(sectionId);

    // Scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Height of your fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-cyan-500/20"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="object-cover h-14" />
            </div>
            <span className="text-xl font-bold glow-text font-orbitron">
              NetX
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentSection === item.id
                    ? "bg-cyan-500 text-black font-bold"
                    : "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className="w-full h-0.5 bg-cyan-400"></span>
              <span className="w-full h-0.5 bg-cyan-400"></span>
              <span className="w-full h-0.5 bg-cyan-400"></span>
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-black/80 backdrop-blur-md rounded-lg border border-cyan-500/30"
          >
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                onClick={() => handleNavigation(item.id)}
                className={`w-full text-left px-4 py-3 border-b border-cyan-500/10 last:border-b-0 ${
                  currentSection === item.id
                    ? "text-cyan-400 font-bold"
                    : "text-white"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
