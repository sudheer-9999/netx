"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type FooterLink = {
  name: string;
  href: string;
  external?: boolean; // ✅ optional property
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

export default function Footer() {
  const footerSections: FooterSection[] = [
    {
      title: "Services",
      links: [
        { name: "Sports Tournaments", href: "/services/sports-tournaments" },
        { name: "Corporate Events", href: "/services/corporate-events" },
        { name: "Social Events", href: "/services/social-events" },
        { name: "Club Nights", href: "/services/club-nights" },
      ],
    },
    {
      title: "Connect",
      links: [
        {
          name: "Instagram: @netx.eo",
          href: "https://www.instagram.com/netx.eo?igsh=ZGo0dDk1NHdmbnpw",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-cyan-500/20 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold glow-text font-orbitron">
                NetX
              </span>
            </div>
            <p className="text-cyan-200 max-w-md mb-4">
              Your Vision. Our Execution. Professional event orchestration
              company organizing legendary events.
            </p>
            <div className="flex space-x-4">
              <a href="tel:6300508035" className="text-cyan-300">
                📞 6300508035
              </a>
              <a
                href="mailto:netxeventorganizer@gmail.com"
                className="text-cyan-300"
              >
                📧 netxeventorganizer@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-cyan-400 font-bold mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={`${section.title}-${i}`}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-200 hover:text-cyan-400 transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-cyan-200 hover:text-cyan-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-cyan-500/20 mt-8 pt-8 text-center text-cyan-200 text-sm"
        >
          <p>&copy; 2025 NetX Event Organizers. All rights reserved.</p>
          <p className="mt-2">
            💻 Developed by{" "}
            <a
              href="https://www.linkedin.com/in/bandaru-sudheer?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Bnadaru Sudheer
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
