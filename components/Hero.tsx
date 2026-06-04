"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative isolate min-h-screen pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden"
    >
      {/* Background cover video */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.video
          aria-hidden="true"
          tabIndex={-1}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster="/logo.jpeg"
          className="h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <source src="/videos/Video-4.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-x-0 bottom-2 left-0 right-0 w-full">
        <div className="mx-1 w-full max-w-7xl">
          <h1
            className="split-line-mask text-xl sm:text-xl lg:text-6xl leading-[1.05] sm:leading-[1.05] capitalize font-bold text-left"
            style={{
              position: "relative",
              display: "block",
              textAlign: "left",
              overflow: "clip",
            }}
          >
            <div
              className="split-line"
              aria-hidden="true"
              style={{
                position: "relative",
                display: "block",
                textAlign: "left",
                translate: "none",
                rotate: "none",
                scale: "none",
                transform: "translate(0px, 0px)",
              }}
            >
              NetX Events: Not Events. <br className="hidden sm:block" />
              Experiences.
            </div>
          </h1>

          {/* Subheadline */}
          <div className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-xl text-white/80 max-w-3xl">
            NetX Events brings jamming nights, sports tournaments, and
            high-energy campus experiences for students and communities.
          </div>

          {/* CTAs */}
          <div className="mt-5 sm:mt-7 flex flex-wrap gap-3">
            <Link
              href="/experiences"
              className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10 transition-colors"
            >
              ⚡ Explore What’s Happening
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 flex w-full md:justify-end">
            <div className="flex flex-row items-center w-full md:w-1/2">
              {/* Button */}
              <button
                className="flex w-fit items-center gap-2 shrink-0 cursor-pointer pr-0 sm:pr-4 py-2"
                style={{ opacity: 1 }}
                type="button"
              >
                {/* Icon */}
                <div className="w-4 h-4 rotate-90 brightness-200">
                  <svg
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full"
                  >
                    <circle
                      cx="500"
                      cy="500"
                      r="480"
                      stroke="#abacb0"
                      strokeWidth="32"
                      fill="none"
                    />
                    <path
                      d="M300 500 L700 500 M520 320 L700 500 L520 680"
                      stroke="#abacb0"
                      strokeWidth="32"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Scroll text */}
                <span
                  className="font-monument-mono text-[10px] text-white font-medium uppercase tracking-wider"
                  aria-label="Scroll"
                >
                  <span
                    className="split-line-mask block"
                    style={{
                      position: "relative",
                      display: "block",
                      textAlign: "center",
                      overflow: "clip",
                    }}
                  >
                    <span
                      className="split-line block"
                      style={{
                        position: "relative",
                        display: "block",
                        textAlign: "center",
                        transform: "translate(0px,0px)",
                      }}
                    >
                      Scroll
                    </span>
                  </span>
                </span>
              </button>

              {/* Marquee */}
              <div
                className="min-w-0 flex-1 overflow-hidden sm:pl-4"
                style={{ clipPath: "inset(0px 0% 0px 0px)" }}
              >
                <div
                  className="flex w-max"
                  style={{ animation: "marquee 34s linear infinite" }}
                >
                  <span className="font-monument-mono text-[10px] text-white/50 font-medium uppercase tracking-wider shrink-0 whitespace-nowrap">
                    At NetX, we don’t create events — we create experiences. No
                    pressure, no perfection, just people coming together to
                    vibe, play, and be part of something real. Whether it’s
                    singing your heart out at a jam session or competing in a
                    high-energy tournament, NetX is where strangers turn into a
                    vibe.
                  </span>

                  <span className="font-monument-mono text-[10px] text-white/50 font-medium uppercase tracking-wider shrink-0 whitespace-nowrap">
                    At NetX, we don’t create events — we create experiences. No
                    pressure, no perfection, just people coming together to
                    vibe, play, and be part of something real. Whether it’s
                    singing your heart out at a jam session or competing in a
                    high-energy tournament, NetX is where strangers turn into a
                    vibe.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
