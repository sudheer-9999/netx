"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Tournament from "./components/Tournament";

const About = dynamic(() => import("./components/About"), { ssr: false });

export default function Home() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main Orbital Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-400/30 rounded-full animate-spin-slow">
          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-400/20 rounded-full animate-spin-slow-reverse">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400"></div>
        </div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Pulsing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-15 animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-15 animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-15 animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-green-400 rounded-full filter blur-3xl opacity-10 animate-pulse-slow delay-1500"></div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(12, 212, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(12, 212, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              transform: "perspective(500px) rotateX(60deg)",
              transformOrigin: "center top",
            }}
          />
        </div>

        {/* Mouse Tracker Glow */}
        <div
          className="absolute w-96 h-96 rounded-full filter blur-3xl opacity-10 pointer-events-none transition-all duration-100 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(232, 121, 249, 0.2) 50%, transparent 70%)",
          }}
        />

        {/* Scanning Lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scanning h-1"></div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-400/50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-400/50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-400/50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-400/50"></div>

        {/* Floating Hexagons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-12 border border-cyan-400/30 opacity-40"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              left: `${20 + i * 10}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatHexagon ${20 + i * 2}s infinite ease-in-out`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${i * 45}deg) scale(0.8)`,
            }}
          />
        ))}

        {/* Energy Beams */}
        <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-purple-400/40 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <Header
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
      />

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Tournament />
        <Contact />
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes floatHexagon {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg) scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) rotate(180deg) scale(1);
            opacity: 0.2;
          }
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes scanning {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 35s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-scanning {
          animation: scanning 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
