"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      id: 1,
      src: "/api/placeholder/400/300?text=Animation+1",
      title: "Epic Battle Scene",
    },
    {
      id: 2,
      src: "/api/placeholder/400/300?text=Animation+2",
      title: "Character Design",
    },
    {
      id: 3,
      src: "/api/placeholder/400/300?text=Animation+3",
      title: "Visual Effects",
    },
    {
      id: 4,
      src: "/api/placeholder/400/300?text=Animation+4",
      title: "Motion Graphics",
    },
    {
      id: 5,
      src: "/api/placeholder/400/300?text=Animation+5",
      title: "3D Modeling",
    },
    {
      id: 6,
      src: "/api/placeholder/400/300?text=Animation+6",
      title: "Creative Concept",
    },
  ];

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-16 font-orbitron"
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            GALLERY
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="relative overflow-hidden rounded-2xl neon-border">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">
                      {image.title}
                    </h3>
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
