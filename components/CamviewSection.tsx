import { motion } from "framer-motion";
import React from "react";

export const CamviewSection = () => {
  return (
    <section
      id="CamView"
      aria-label="Hero"
      className="relative isolate min-h-screen  overflow-hidden"
    >
      {/* Background cover video */}
      <div className="absolute inset-0 pointer-events-none h-[80vh] my-auto">
        <motion.video
          aria-hidden="true"
          tabIndex={-1}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <source src="/videos/Video-5.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 pointer-events-none">
          {/* corners */}
          <div className="absolute top-5 left-5 w-10 h-10 border-l-2 border-t-2 border-white" />
          <div className="absolute top-5 right-5 w-10 h-10 border-r-2 border-t-2 border-white" />
          <div className="absolute bottom-5 left-5 w-10 h-10 border-l-2 border-b-2 border-white" />
          <div className="absolute bottom-5 right-5 w-10 h-10 border-r-2 border-b-2 border-white" />

          {/* REC */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs tracking-widest">REC</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50" />

        
      </div>
    </section>
  );
};
