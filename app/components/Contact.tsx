"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
    alert("Thank you for your inquiry! We will contact you soon.");
    setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 font-orbitron">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CONTACT US
            </span>
          </h2>
          <p className="text-xl text-cyan-200 text-center mb-12">
            Ready to create an unforgettable event? Get in touch with us!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-cyan-300 mb-2">Full Name</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-300 mb-2">Email</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-2">Phone</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2">Event Type</label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                    required
                  >
                    <option value="">Select Event Type</option>
                    <option value="sports">Sports Tournament</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="social">Social Event</option>
                    <option value="party">Club Night/Party</option>
                    <option value="other">Other</option>
                  </motion.select>
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2">Message</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 text-white resize-none"
                    required
                  ></motion.textarea>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-lg"
                >
                  Send Message
                </motion.button>
              </div>
            </motion.form>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                  Get In Touch
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400">📞</span>
                    </div>
                    <div>
                      <div className="text-cyan-300 font-semibold">Phone</div>
                      <div className="text-white text-lg">
                        6300508035 (NetX)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400">📧</span>
                    </div>
                    <div>
                      <div className="text-cyan-300 font-semibold">Email</div>
                      <div className="text-white text-lg">
                        netxeventorganizer@gmail.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  Tournament Venue
                </h3>
                <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <div className="text-cyan-200 font-semibold">
                      SKBA VR Club Sports
                    </div>
                    <div className="text-cyan-300">
                      Chandanagar, Hyderabad – 502032
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
