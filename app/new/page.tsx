"use client";

import { CamviewSection } from "@/components/CamviewSection";
import CredView from "@/components/CredView";
import FrameText from "@/components/FrameText";
import Hero from "@/components/Hero";
import { InfiniteImages } from "@/components/InfiniteImages";
import Navbar from "@/components/Navbar";
import ScrollText from "@/components/ScrollText";
import Section from "@/components/Section";
import WhyNextX from "@/components/WhyNextX";
import Footer from "../components/Footer";
import HappeningNow from "@/components/HappeningNow";

export default function NewHomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <CredView />
        <CamviewSection />
        <ScrollText />
        <InfiniteImages />
        <FrameText />
        <WhyNextX />
        
        {/* Experiences */}
        <Section id="experiences" title="What We Do">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-white/10 p-6 bg-white/5">
              <h3 className="text-xl font-semibold">🎸 Madhuram – Jamming Sessions</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Sing, vibe, and lose yourself in music. No stage fear. No judgment. Just a room full
                of people singing together.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-6 bg-white/5">
              <h3 className="text-xl font-semibold">🎤 Open Experiences (Coming Soon)</h3>
              <p className="mt-2 text-sm text-zinc-400">
                From open mics to creative nights — we’re just getting started.
              </p>
            </div>
          </div>
        </Section>

        {/* Upcoming Event */}
        <Section id="upcoming" title="Happening Now">
          <HappeningNow />

        </Section>

        {/* Why NetX - Differentiation */}
        <Section id="why-netx" title="What Makes Us Different">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-200">
            <li className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              No stage fear — just participation
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              No perfect skills needed
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              Real people, real energy
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              Experiences you actually enjoy
            </li>
            <li className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
              Built for students & young crowd
            </li>
          </ul>
        </Section>

        {/* For Colleges / Partners */}
        <Section id="partners" title="Bring NetX To Your Campus">
          <div className="max-w-3xl text-zinc-300 leading-relaxed space-y-4">
            <p>
              Want to host a jamming night or tournament in your college? We collaborate with
              campuses and communities to create unforgettable experiences.
            </p>
            <a
              href="tel:+0000000000"
              className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10 transition-colors"
            >
              👉 Collaborate With Us
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
