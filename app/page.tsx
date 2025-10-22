"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Tournament from "./components/Tournament";
const About = dynamic(() => import("./components/About"), { ssr: false });

export default function Home() {
  const [currentSection, setCurrentSection] = useState("home");

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <Header
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
      />

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <Tournament />
        {/* <Gallery /> */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
