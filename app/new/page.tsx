"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CamviewSection } from "@/components/CamviewSection";
import CredView from "@/components/CredView";
import FrameText from "@/components/FrameText";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ScrollText from "@/components/ScrollText";
import Section from "@/components/Section";
import WhyNextX from "@/components/WhyNextX";
import NewVideosSection from "@/components/NewVideosSection";
import Footer from "../components/Footer";
import HappeningNow from "@/components/HappeningNow";

type ChatMessage = {
  sender: "user" | "assistant";
  text: string;
  source?: "llm" | "fallback";
};

const EVENT_LINK = "https://konfhub.com/madhuram-chapter-2";
const EVENT_MAP_LINK =
  "https://www.google.com/maps/place/Biryanis+%26+Barbecues+FOOD+RESTAURANT+AND+BANQUET+HALL/@15.8240418,78.034094,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb5ddf60e33eb1d:0xee8df0c7a9c74a64!8m2!3d15.8240418!4d78.0366689!16s%2Fg%2F11bwq96b22?entry=ttu&g_ep=EgoyMDI2MDQyNi4wIKXMDSoASAFQAw%3D%3D";
const CONTACT_PHONE = "8688202425";
const CONTACT_EMAIL = "netxevents@outlook.com";

type IntentKey =
  | "latest_event"
  | "greeting"
  | "venue"
  | "date"
  | "time"
  | "price"
  | "registration"
  | "availability"
  | "contact"
  | "about"
  | "support"
  | "out_of_context";

type IntentDefinition = {
  keywords: string[];
  buildResponse: (event: EventInfo) => string;
};

type EventInfo = {
  id: string;
  name: string;
  dateLabel: string;
  isoDate: string;
  timeLabel: string;
  venue: string;
  city: string;
  mapLink: string;
  ticketPrice: string;
  earlyBirdPrice: string;
  registrationLink: string;
  status: "active" | "upcoming" | "completed";
  ticketTierName: string;
  ticketTierDescription: string;
  availableTillLabel: string;
  ticketsLeft: number;
};

const EVENTS: EventInfo[] = [
  {
    id: "madhuram-chapter-2",
    name: "Madhuram Chapter 2",
    dateLabel: "9th May (Saturday)",
    isoDate: "2026-05-09T18:00:00+05:30",
    timeLabel: "6 PM onwards",
    venue: "Biryanis & Barbecues Food Restaurant and Banquet Hall",
    city: "Kurnool",
    mapLink: EVENT_MAP_LINK,
    ticketPrice: "₹269",
    earlyBirdPrice: "₹200",
    registrationLink: EVENT_LINK,
    status: "active",
    ticketTierName: "Madhuram - chapter 2 early bird",
    ticketTierDescription:
      "Your entry to Madhuram Chapter 2 - an evening packed with music, vibes, and good company.",
    availableTillLabel: "9th May 2026, 09:00 PM (GMT+05:30)",
    ticketsLeft: 2,
  },
];

const getLiveEvent = (): EventInfo => {
  const active = EVENTS.find((event) => event.status === "active");
  if (active) return active;

  const now = Date.now();
  const upcoming = [...EVENTS]
    .filter((event) => new Date(event.isoDate).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime(),
    )[0];
  if (upcoming) return upcoming;

  return [...EVENTS].sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
  )[0];
};

const formatEventHeadline = (event: EventInfo) =>
  `${event.name} is the current live/active event. Date: ${event.dateLabel}, Time: ${event.timeLabel}, Venue: ${event.venue}, ${event.city}. Map: ${event.mapLink}`;

const INTENT_DEFINITIONS: Record<
  Exclude<IntentKey, "out_of_context">,
  IntentDefinition
> = {
  latest_event: {
    keywords: [
      "latest event",
      "current event",
      "live event",
      "active event",
      "ongoing event",
      "what event now",
      "now event",
    ],
    buildResponse: (event) =>
      `${formatEventHeadline(event)} Regular price is ${event.ticketPrice}, and early bird offer is ${event.earlyBirdPrice}. Only ${event.ticketsLeft} tickets left, grab your spot as soon as possible. Available till ${event.availableTillLabel}. Register here: ${event.registrationLink}`,
  },
  greeting: {
    keywords: ["hi", "hello", "hey", "good morning", "good evening"],
    buildResponse: () =>
      "Hello! I am your NetX AI assistant. I can help with event date, time, venue, ticket price, registration, and contact details.",
  },
  venue: {
    keywords: ["where", "venue", "location", "address", "place", "map"],
    buildResponse: (event) =>
      `The venue for ${event.name} is ${event.venue}, ${event.city}. Google Maps: ${event.mapLink}`,
  },
  date: {
    keywords: ["date", "day", "which day", "may", "9th"],
    buildResponse: (event) => `${event.name} is scheduled on ${event.dateLabel}.`,
  },
  time: {
    keywords: ["time", "when", "timing", "start", "starts", "pm"],
    buildResponse: (event) => `${event.name} starts at ${event.timeLabel}.`,
  },
  price: {
    keywords: ["price", "entry", "ticket", "cost", "fee", "amount", "rupees"],
    buildResponse: (event) =>
      `Regular entry fee for ${event.name} is ${event.ticketPrice}. Early bird offer is ${event.earlyBirdPrice}. Tier: ${event.ticketTierName}. Only ${event.ticketsLeft} early-bird tickets are available, so grab your spot as soon as possible. Available till ${event.availableTillLabel}. Reserve your seat on Konfhub: ${event.registrationLink}`,
  },
  registration: {
    keywords: ["register", "registration", "book", "booking", "konfhub", "link", "join"],
    buildResponse: (event) =>
      `You can register for ${event.name} securely here: ${event.registrationLink}. ${event.ticketTierName} (early bird ${event.earlyBirdPrice}, regular ${event.ticketPrice}) is available till ${event.availableTillLabel}.`,
  },
  availability: {
    keywords: [
      "early bird",
      "available till",
      "availability",
      "tickets left",
      "spots left",
      "only",
      "rush",
      "all access vibes",
    ],
    buildResponse: (event) =>
      `${event.ticketTierName}: ${event.ticketTierDescription} Regular price: ${event.ticketPrice}. Early bird offer: ${event.earlyBirdPrice}. Only ${event.ticketsLeft} early-bird tickets available, grab as soon as possible. Available till ${event.availableTillLabel}. Once this phase is gone, it is gone.`,
  },
  contact: {
    keywords: ["contact", "phone", "call", "email", "whatsapp", "support number"],
    buildResponse: () => `You can reach NetX at ${CONTACT_PHONE} or ${CONTACT_EMAIL}.`,
  },
  about: {
    keywords: ["netx", "madhuram", "event", "music", "food", "vibe", "what is netx"],
    buildResponse: (event) =>
      `NetX creates youth-first community experiences. Right now, our highlighted event is ${event.name}. Ask me for venue, time, date, price, or registration.`,
  },
  support: {
    keywords: ["help", "assist", "guide", "what can you do"],
    buildResponse: () =>
      "I can help with latest event details: venue, date, time, ticket price, early-bird availability, registration link, and contact support.",
  },
};

const FOLLOW_UP_HINTS = ["it", "that", "this", "same", "details", "more", "again"];
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const parseRupeeValue = (value: string) => Number(value.replace(/[^\d]/g, ""));

const MEMBER_WORD_TO_COUNT: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const extractMemberCount = (question: string): number | null => {
  const explicitMatch = question.match(/(\d+)\s*(member|members|people|persons|tickets)/i);
  if (explicitMatch?.[1]) return Number(explicitMatch[1]);

  for (const [word, count] of Object.entries(MEMBER_WORD_TO_COUNT)) {
    const pattern = new RegExp(`\\b${word}\\s*(member|members|people|persons|tickets)\\b`, "i");
    if (pattern.test(question)) return count;
  }

  return null;
};

const buildPriceResponse = (event: EventInfo, question: string) => {
  const memberCount = extractMemberCount(question);
  if (!memberCount || memberCount < 2) {
    return INTENT_DEFINITIONS.price.buildResponse(event);
  }

  const regular = parseRupeeValue(event.ticketPrice) * memberCount;
  const earlyBird = parseRupeeValue(event.earlyBirdPrice) * memberCount;
  return `For ${memberCount} members, regular total is ₹${regular} (${event.ticketPrice} each) and early bird total is ₹${earlyBird} (${event.earlyBirdPrice} each). Only ${event.ticketsLeft} early-bird tickets are available. Register here: ${event.registrationLink}`;
};

const renderMessageWithLinks = (message: string) => {
  const parts = message.split(URL_REGEX);

  return parts.map((part, index) => {
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a
          key={`link-${index}-${part}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
        >
          {part}
        </a>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
};

const getAssistantResponse = (
  rawQuestion: string,
  lastIntent: IntentKey | null,
): { response: string; intent: IntentKey } => {
  const question = rawQuestion.trim().toLowerCase();
  const liveEvent = getLiveEvent();

  if (!question) {
    return {
      response:
        "Please ask a question about the event or NetX, and I will be happy to help.",
      intent: "support",
    };
  }

  const tokens = tokenize(question);
  const followUp = tokens.some((token) => FOLLOW_UP_HINTS.includes(token));

  const scoredIntents = (
    Object.entries(INTENT_DEFINITIONS) as [Exclude<IntentKey, "out_of_context">, IntentDefinition][]
  ).map(([intent, config]) => {
    const score = config.keywords.reduce((total, keyword) => {
      const normalizedKeyword = keyword.toLowerCase();
      if (question.includes(normalizedKeyword)) {
        return total + (normalizedKeyword.includes(" ") ? 2 : 1);
      }
      return total;
    }, 0);
    return { intent, score };
  });

  scoredIntents.sort((a, b) => b.score - a.score);
  const best = scoredIntents[0];
  const matchedKnownIntent = best.score > 0;

  if (matchedKnownIntent) {
    if (best.intent === "price") {
      return {
        response: buildPriceResponse(liveEvent, question),
        intent: best.intent,
      };
    }

    return {
      response: INTENT_DEFINITIONS[best.intent].buildResponse(liveEvent),
      intent: best.intent,
    };
  }

  if (followUp && lastIntent && lastIntent !== "out_of_context") {
    if (lastIntent === "price") {
      return {
        response: `${buildPriceResponse(
          liveEvent,
          question,
        )} If you need anything else, I can also share registration and contact details.`,
        intent: lastIntent,
      };
    }

    return {
      response: `${INTENT_DEFINITIONS[lastIntent].buildResponse(
        liveEvent,
      )} If you need anything else, I can also share registration and contact details.`,
      intent: lastIntent,
    };
  }

  return {
    response:
      "This question appears out of context. I can help only with NetX event details such as date, time, venue, ticket price, registration, and contact support.",
    intent: "out_of_context",
  };
};

export default function NewHomePage() {
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showAssistantPrompt, setShowAssistantPrompt] = useState(false);
  const [isAssistantMinimized, setIsAssistantMinimized] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [lastIntent, setLastIntent] = useState<IntentKey | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "AI Assistant is live 🚀 Got questions? Hit up the AI agent for anything about the event.",
    },
  ]);

  useEffect(() => {
    setShowPosterModal(true);
  }, []);

  const handlePosterClose = () => {
    setShowPosterModal(false);
    setShowAssistantPrompt(true);
    setIsAssistantMinimized(false);
  };

  const handleSendMessage = async () => {
    const question = chatInput.trim();
    if (!question || isThinking) return;

    const userMessage: ChatMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    setIsThinking(true);
    try {
      const history = messages.slice(-10).map((message) => ({
        role: message.sender,
        content: message.text,
      }));

      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), 70000);
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: question,
          history,
          lastIntent,
        }),
      }).finally(() => clearTimeout(requestTimeout));

      if (!response.ok) throw new Error("Chat API failed");

      const data = (await response.json()) as {
        reply?: string;
        intent?: IntentKey | null;
        source?: "llm" | "fallback";
      };
      const assistantReply =
        data.reply ??
        "I am unable to answer right now. Please ask again in a moment.";

      setLastIntent((data.intent as IntentKey | null) ?? lastIntent);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: assistantReply,
          source: data.source === "llm" ? "llm" : "fallback",
        },
      ]);
    } catch {
      const { response, intent } = getAssistantResponse(question, lastIntent);
      setLastIntent(intent);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: response, source: "fallback" },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-zinc-950 via-black to-zinc-950 text-white">
      {showPosterModal && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-white/20 bg-zinc-950 p-3 shadow-2xl">
            <button
              type="button"
              onClick={handlePosterClose}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70"
              aria-label="Close event poster"
            >
              Close
            </button>

            <div className="relative overflow-hidden rounded-lg border border-white/10">
              <Image
                src="/poster.jpeg"
                alt="Madhuram Chapter 2 event poster"
                width={700}
                height={1050}
                priority
                className="h-auto w-full object-cover"
              />
            </div>

            <a
              href="https://konfhub.com/madhuram-chapter-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowPosterModal(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-orange-300/50 bg-orange-500/20 px-4 py-2.5 text-sm font-semibold text-orange-100 transition-colors hover:bg-orange-500/30"
            >
              Register on Konfhub
            </a>
          </div>
        </div>
      )}

      {showAssistantPrompt && isAssistantMinimized && (
        <button
          type="button"
          onClick={() => setIsAssistantMinimized(false)}
          className="group fixed bottom-5 right-4 z-110 inline-flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/40 bg-zinc-900/95 shadow-xl backdrop-blur transition-transform hover:scale-105 hover:bg-zinc-800/95"
          aria-label="Open NetX AI Assistant"
        >
          <Image
            src="/chatbot.png"
            alt="AI Assistant Icon"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <span className="pointer-events-none absolute -top-11 right-0 whitespace-nowrap rounded-md border border-cyan-300/40 bg-zinc-900/95 px-2.5 py-1 text-xs text-cyan-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            NetX AI Assistant - tap to chat
          </span>
        </button>
      )}

      {showAssistantPrompt && !isAssistantMinimized && (
        <div className="fixed bottom-5 right-4 z-110 w-[min(92vw,360px)] rounded-xl border border-cyan-300/30 bg-zinc-900/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-cyan-500/10"
            >
              <Image
                src="/chatbot.png"
                alt="AI Assistant"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-200/80">
                  Integrated AI Support
                </p>
                <button
                  type="button"
                  onClick={() => setIsAssistantMinimized(true)}
                  className="rounded-md border border-white/20 px-2 py-0.5 text-[11px] text-zinc-300 hover:bg-white/10"
                  aria-label="Minimize AI assistant"
                >
                  Minimize
                </button>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-2">
                {messages.map((message, index) => (
                  <div
                    key={`${message.sender}-${index}`}
                    className={`rounded-md px-2 py-1.5 text-xs leading-relaxed ${
                      message.sender === "assistant"
                        ? "bg-cyan-500/10 text-zinc-100"
                        : "bg-white/10 text-zinc-200"
                    }`}
                  >
                    {/* {message.sender === "assistant" && message.source && (
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/90">
                        {message.source === "llm" ? "LLM" : "Fallback"}
                      </div>
                    )} */}
                    {renderMessageWithLinks(message.text)}
                  </div>
                ))}
                {isThinking && (
                  <div className="rounded-md bg-cyan-500/10 px-2 py-1.5 text-xs leading-relaxed text-zinc-100">
                    NetX AI is thinking...
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about event details..."
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:border-cyan-300/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="shrink-0 rounded-md border border-cyan-300/40 bg-cyan-500/20 px-3 py-2 text-xs font-medium text-cyan-100 transition-colors hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isThinking}
                >
                  Send
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Where is the venue?",
                  "What is ticket price?",
                  "Share registration link",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setChatInput(suggestion)}
                    className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:bg-white/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <CredView />
        <CamviewSection />
        <NewVideosSection />
        <ScrollText />
        {/* <InfiniteImages /> */}
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
              href="tel:+918328412214"
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
