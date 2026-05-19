"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Coffee,
  Crown,
  Dumbbell,
  Eye,
  Gem,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Mail,
  Megaphone,
  Mic2,
  Music2,
  Palette,
  Phone,
  Rocket,
  Share2,
  Shirt,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Video,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const AUDIENCES: { label: string; icon: LucideIcon }[] = [
  { label: "Students", icon: GraduationCap },
  { label: "Young Professionals", icon: Briefcase },
  { label: "Music Enthusiasts", icon: Music2 },
  { label: "Creators", icon: Palette },
  { label: "Corporate Teams", icon: Building2 },
  { label: "Lifestyle Communities", icon: Users },
];

const SPONSOR_BENEFITS: { label: string; icon: LucideIcon }[] = [
  { label: "Audience Visibility", icon: Eye },
  { label: "Social Media Promotion", icon: Share2 },
  { label: "Event Branding", icon: Megaphone },
  { label: "On-Stage Mentions", icon: Mic2 },
  { label: "Reels & Content", icon: Video },
  { label: "Community Engagement", icon: HeartHandshake },
  { label: "Premium Association", icon: Award },
];

const SPONSORSHIP_TIERS: {
  name: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
}[] = [
  {
    name: "Community Sponsor",
    description: "Logo placement + social mentions",
    icon: Users,
  },
  {
    name: "Event Partner",
    description: "Stage branding + announcements",
    icon: Star,
    featured: true,
  },
  {
    name: "Premium Sponsor",
    description: "Exclusive visibility + collabs",
    icon: Crown,
  },
];

const IDEAL_SPONSORS: { label: string; icon: LucideIcon }[] = [
  { label: "Cafés", icon: Coffee },
  { label: "Restaurants", icon: UtensilsCrossed },
  { label: "Clothing Brands", icon: Shirt },
  { label: "Gyms", icon: Dumbbell },
  { label: "Jewelry", icon: Gem },
  { label: "Startups", icon: Rocket },
  { label: "Education", icon: GraduationCap },
  { label: "Real Estate", icon: Building2 },
  { label: "Lifestyle", icon: Sparkles },
];

const CONTACT_PHONE = "8688202425";
const CONTACT_EMAIL = "netxevents@outlook.com";

const AMBIENT_BUBBLES = [
  { size: 280, top: "8%", left: "-6%", color: "rgba(251,146,60,0.12)", delay: 0 },
  { size: 180, top: "35%", right: "-4%", color: "rgba(251,191,36,0.1)", delay: 1.2 },
  { size: 120, top: "62%", left: "12%", color: "rgba(255,255,255,0.06)", delay: 0.6 },
  { size: 220, top: "78%", right: "8%", color: "rgba(249,115,22,0.1)", delay: 2 },
  { size: 90, top: "18%", right: "22%", color: "rgba(34,211,238,0.08)", delay: 1.8 },
];

function AmbientBubbles() {
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {AMBIENT_BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            background: b.color,
          }}
          animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </motion.div>
  );
}

function BubbleLabel({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/20 shadow-[0_0_24px_rgba(251,146,60,0.2)] backdrop-blur-md">
        <Icon className="h-5 w-5 text-amber-100" aria-hidden />
      </span>
      <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow-sm md:text-xl">
        {title}
      </h3>
    </div>
  );
}

type BubbleChipProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "warm" | "gold" | "glass";
};

function BubbleChip({
  children,
  className = "",
  size = "md",
  variant = "glass",
}: BubbleChipProps) {
  const sizeClass = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-sm gap-2.5",
  }[size];

  const variantClass = {
    warm: "border-amber-400/35 bg-amber-950/55 text-amber-50 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]",
    gold: "border-amber-300/50 bg-amber-500/25 text-white shadow-[0_0_32px_rgba(251,146,60,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
    glass:
      "border-white/20 bg-zinc-900/70 text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]",
  }[variant];

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`inline-flex items-center justify-center rounded-full border backdrop-blur-xl ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </motion.span>
  );
}

function AudienceOrb({ label, icon: Icon, index }: { label: string; icon: LucideIcon; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-2"
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full border border-amber-400/30 bg-zinc-900/75 p-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl sm:h-24 sm:w-24"
      >
        <Icon className="h-5 w-5 shrink-0 text-amber-200" aria-hidden />
        <span className="text-[10px] font-medium leading-tight text-zinc-100 sm:text-[11px]">
          {label}
        </span>
      </motion.div>
    </motion.li>
  );
}

function TierOrb({
  name,
  description,
  icon: Icon,
  featured,
  index,
}: {
  name: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <motion.div
        whileHover={{ scale: featured ? 1.06 : 1.04 }}
        className={`relative flex aspect-square w-[min(100%,220px)] max-w-[220px] flex-col items-center justify-center gap-3 rounded-full border p-6 text-center backdrop-blur-xl ${
          featured
            ? "border-amber-300/60 bg-amber-500/30 shadow-[0_0_56px_rgba(251,146,60,0.35),inset_0_2px_0_rgba(255,255,255,0.2)]"
            : "border-white/25 bg-zinc-900/80 shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
        }`}
      >
        {featured && (
          <span className="absolute -top-1 rounded-full border border-amber-200/50 bg-amber-400/40 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
            Popular
          </span>
        )}
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            featured ? "bg-white/20" : "bg-amber-500/15"
          }`}
        >
          <Icon className={`h-6 w-6 ${featured ? "text-white" : "text-amber-200"}`} aria-hidden />
        </span>
        <h4 className="text-base font-semibold text-white">{name}</h4>
        <p className="text-xs leading-snug text-zinc-200/90">{description}</p>
      </motion.div>
    </motion.div>
  );
}

export default function PartnerWithNetX() {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-title"
      className="relative overflow-hidden bg-[#0c0a09] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: [
          "linear-gradient(180deg, rgba(12,10,9,0.88) 0%, rgba(28,20,14,0.72) 45%, rgba(12,10,9,0.9) 100%)",
          "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(180,83,9,0.18), transparent 60%)",
          "url('/partnership-handshake.jpg')",
        ].join(", "),
      }}
    >
      <AmbientBubbles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.header
          className="mb-14 text-center md:mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/45 bg-amber-500/25 shadow-[0_0_48px_rgba(251,146,60,0.3)] backdrop-blur-md"
          >
            <Handshake className="h-9 w-9 text-amber-50" aria-hidden />
          </motion.div>
          {/* <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300/90">
            Partnerships
          </p> */}
          <h2
            id="sponsors-title"
            className="mt-3 text-3xl font-bold text-white drop-shadow-md md:text-4xl lg:text-5xl"
          >
            Partner With NetX Events
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-amber-100/80 md:text-lg">
            Reach Audiences Through Music, Culture & Community
          </p>
        </motion.header>

        <div className="space-y-16 md:space-y-24">
          {/* About — speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative rounded-[2.5rem] border border-amber-400/25 bg-zinc-900/75 px-8 py-8 text-center shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-12 md:py-10">
              <div
                className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-b border-r border-amber-400/25 bg-zinc-900/75"
                aria-hidden
              />
              <p className="text-base leading-relaxed text-zinc-100 md:text-lg">
                NetX Events builds meaningful community experiences in{" "}
                <span className="font-medium text-amber-200">Kurnool</span> through live jamming
                sessions, musical nights, private celebrations, and curated social events.
              </p>
            </div>
          </motion.div>

          {/* Audiences — orb cluster */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <BubbleLabel icon={Users} title="Our Events Bring Together" />
            <ul className="flex flex-wrap items-start justify-center gap-6 sm:gap-8">
              {AUDIENCES.map((item, i) => (
                <AudienceOrb key={item.label} {...item} index={i} />
              ))}
            </ul>
          </motion.div>

          {/* Benefits — floating chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <BubbleLabel icon={Award} title="Why Sponsor NetX Events?" />
            <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
              {SPONSOR_BENEFITS.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <BubbleChip variant="warm" size="md">
                    <Icon className="h-4 w-4 shrink-0 text-amber-200" aria-hidden />
                    {label}
                  </BubbleChip>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tiers — large orbs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <BubbleLabel icon={Star} title="Sponsorship Opportunities" />
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
              {SPONSORSHIP_TIERS.map((tier, i) => (
                <TierOrb key={tier.name} {...tier} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Ideal sponsors — pill bubbles */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <BubbleLabel icon={Sparkles} title="Ideal Sponsors" />
            <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
              {IDEAL_SPONSORS.map(({ label, icon: Icon }) => (
                <BubbleChip key={label} variant="glass" size="sm">
                  <Icon className="h-3.5 w-3.5 text-amber-300/90" aria-hidden />
                  {label}
                </BubbleChip>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full border border-amber-400/30 bg-zinc-900/80 px-8 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:px-12 md:py-8"
            >
              <Handshake className="mx-auto mb-3 h-8 w-8 text-amber-200" aria-hidden />
              <h3 className="text-lg font-semibold text-white md:text-xl">
                Let&apos;s build something together
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-200 md:text-base">
                Discuss sponsorship packages tailored to your brand.
              </p>
            </motion.div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=NetX%20Events%20Sponsorship%20Inquiry`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/35 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(251,146,60,0.25)] transition-all hover:bg-amber-500/50 hover:shadow-[0_0_36px_rgba(251,146,60,0.35)]"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Email Us
              </a>
              <a
                href={`tel:+91${CONTACT_PHONE}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-zinc-900/80 px-7 py-3.5 text-sm font-semibold text-zinc-100 backdrop-blur-md transition-all hover:bg-zinc-800/90"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {CONTACT_PHONE}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
