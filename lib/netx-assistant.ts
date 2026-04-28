import eventsData from "@/local-ai/events.json";

export type AssistantRole = "user" | "assistant";

export type ChatTurn = {
  role: AssistantRole;
  content: string;
};

type EventStatus = "active" | "upcoming" | "completed";

export type EventInfo = {
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
  status: EventStatus;
  ticketTierName: string;
  ticketTierDescription: string;
  availableTillLabel: string;
  ticketsLeft: number;
};

export type IntentKey =
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
  buildResponse: (event: EventInfo, question: string) => string;
};

const EVENTS = eventsData as EventInfo[];

const CONTACT_PHONE = "8688202425";
const CONTACT_EMAIL = "netxevents@outlook.com";

// Words that hint the user is continuing from a prior topic
const FOLLOW_UP_HINTS = [
  "it",
  "that",
  "this",
  "same",
  "details",
  "more",
  "again",
  "what about",
  "tell me",
  "and",
  "also",
  "how about",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const similarity = (a: string, b: string) => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x.includes(y) || y.includes(x);
};

const parseRupeeValue = (value: string) => Number(value.replace(/[^\d]/g, ""));

const formatRupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const urgencyBar = (left: number): string => {
  if (left <= 10) return "🔴 Almost sold out!";
  if (left <= 30) return "🟡 Selling fast";
  return "🟢 Available";
};

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
  const explicitMatch = question.match(
    /(\d+)\s*(member|members|people|persons|tickets?)/i,
  );
  if (explicitMatch?.[1]) return Number(explicitMatch[1]);

  for (const [word, count] of Object.entries(MEMBER_WORD_TO_COUNT)) {
    const pattern = new RegExp(
      `\\b${word}\\s*(member|members|people|persons|tickets?)\\b`,
      "i",
    );
    if (pattern.test(question)) return count;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

const buildPriceResponse = (event: EventInfo, question: string): string => {
  const memberCount = extractMemberCount(question);

  if (/worth|value|good deal|is it cheap/i.test(question)) {
    const saved =
      parseRupeeValue(event.ticketPrice) -
      parseRupeeValue(event.earlyBirdPrice);
    return `ngl it's a total steal 😭🔥 early bird saves you ${formatRupees(saved)} per person — that's literally a free meal bro. cop it before it's gone!\n\n🔗 ${event.registrationLink}`;
  }

  if (!memberCount || memberCount < 2) {
    return `aight here's the tea on pricing for **${event.name}** 💸\n\nRegular: ${event.ticketPrice}\n🔥 Early Bird (limited!!): ${event.earlyBirdPrice}\n\n${urgencyBar(event.ticketsLeft)} · ${event.ticketsLeft} tickets left\n🔗 ${event.registrationLink}`;
  }

  const regular = parseRupeeValue(event.ticketPrice) * memberCount;
  const earlyBird = parseRupeeValue(event.earlyBirdPrice) * memberCount;
  const savings = regular - earlyBird;

  return `squad of **${memberCount}**? let's go!! 🫂\n\nRegular (don't be this guy): ${formatRupees(regular)}\n🔥 Early Bird (smart move): ${formatRupees(earlyBird)}\n💰 u save: ${formatRupees(savings)} — that's on us fr\n\n${urgencyBar(event.ticketsLeft)} · only ${event.ticketsLeft} spots left bestie\n🔗 ${event.registrationLink}`;
};

// ---------------------------------------------------------------------------
// Active event resolution
// ---------------------------------------------------------------------------

export const getLiveEvent = (): EventInfo => {
  const active = EVENTS.find((e) => e.status === "active");
  if (active) return active;

  const now = Date.now();
  const upcoming = [...EVENTS]
    .filter((e) => new Date(e.isoDate).getTime() >= now)
    .sort(
      (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime(),
    )[0];

  if (upcoming) return upcoming;

  return [...EVENTS].sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
  )[0];
};

// ---------------------------------------------------------------------------
// Welcome message (call this when chat first opens)
// ---------------------------------------------------------------------------

export const getWelcomeMessage = (): string => {
  const event = getLiveEvent();
  return `yo bestie 👋✨ welcome to NetX!\n\n**${event.name}** is literally around the corner and it's gonna go crazy 🔥 ask me anything — tickets, venue, vibes, all of it. what's good?`;
};

// ---------------------------------------------------------------------------
// Quick reply suggestions per intent (for UI chips)
// ---------------------------------------------------------------------------

export const getSuggestedQuestions = (intent: IntentKey): string[] => {
  const suggestions: Record<IntentKey, string[]> = {
    greeting: [
      "what's the event? 👀",
      "how much are tickets?",
      "where's it at?",
    ],
    latest_event: [
      "how much are tickets? 💸",
      "bro where is this?",
      "how do i get in?",
    ],
    price: [
      "lock in my spot 🎟",
      "how many tickets left?",
      "where's the venue?",
    ],
    venue: [
      "what time does it start?",
      "how do i cop tickets?",
      "how many spots left?",
    ],
    date: ["what time tho? ⏰", "drop the venue", "how much are tickets?"],
    time: ["where is it?", "how much are tickets?", "register me 🙋"],
    registration: [
      "how much does it cost? 💸",
      "tickets selling fast?",
      "when is it?",
    ],
    availability: ["book now 🔥", "early bird price?", "when's the deadline?"],
    contact: [
      "tell me about the event",
      "how do i register?",
      "ticket prices?",
    ],
    about: [
      "what's the next event?",
      "ticket prices? 💰",
      "where's it happening?",
    ],
    support: [
      "tell me about the event 🎉",
      "how much are tickets?",
      "where's the venue?",
    ],
    out_of_context: [
      "tell me about the event",
      "ticket prices?",
      "how do i register?",
    ],
  };

  return suggestions[intent] ?? suggestions.support;
};

// ---------------------------------------------------------------------------
// Intent definitions
// ---------------------------------------------------------------------------

const INTENT_DEFINITIONS: Record<
  Exclude<IntentKey, "out_of_context">,
  IntentDefinition
> = {
  latest_event: {
    keywords: [
      "latest event",
      "current event",
      "ongoing",
      "now event",
      "what's on",
      "upcoming event",
      "next event",
      "show event",
    ],
    buildResponse: (event) =>
      `okay so THIS is the one 🫨🔥\n\n**${event.name}**\n📅 ${event.dateLabel}\n⏰ ${event.timeLabel}\n📍 ${event.venue}, ${event.city}\n💸 ${event.ticketPrice} · Early Bird: ${event.earlyBirdPrice}\n🎟 ${event.ticketsLeft} tickets left (not a lot ngl)\n🔗 ${event.registrationLink}`,
  },

  greeting: {
    keywords: [
      "hi",
      "hello",
      "hey",
      "how are you",
      "how r u",
      "good morning",
      "good evening",
      "sup",
      "hiya",
      "what's up",
    ],
    buildResponse: () =>
      `heyyy!! 👋😭 welcome to the NetX squad\n\ni got all the deets — tickets, venue, timings, the whole drip ✨ what you tryna know?`,
  },

  venue: {
    keywords: [
      "where",
      "venue",
      "location",
      "map",
      "place",
      "address",
      "directions",
      "how to reach",
      "how to get there",
    ],
    buildResponse: (event) =>
      `the vibes are gonna be at 📍\n\n**${event.venue}**, ${event.city}\n\nngl the location is lowkey a serve 😤 drop your location in maps rn →\n🗺 ${event.mapLink}`,
  },

  date: {
    keywords: ["date", "day", "when", "which day", "what day", "schedule"],
    buildResponse: (event) =>
      `mark ur calendar rn bestie 📅🔒\n\n**${event.name}** is going down on **${event.dateLabel}**\n\nno excuses, no skipping 😤`,
  },

  time: {
    keywords: [
      "time",
      "timing",
      "start",
      "begin",
      "what time",
      "opening",
      "doors open",
    ],
    buildResponse: (event) =>
      `doors go up at ⏰ **${event.timeLabel}**\n\nplease don't be that person who shows up 2 hours late 💀 pull up on time and catch the full vibe fr`,
  },

  price: {
    keywords: [
      "price",
      "cost",
      "fee",
      "how much",
      "ticket",
      "charge",
      "rate",
      "amount",
      "pay",
      "expensive",
      "cheap",
      "worth",
      "value",
    ],
    buildResponse: buildPriceResponse,
  },

  registration: {
    keywords: [
      "register",
      "booking",
      "book",
      "join",
      "link",
      "sign up",
      "sign-up",
      "get ticket",
      "buy ticket",
      "purchase",
      "enroll",
    ],
    buildResponse: (event) =>
      `locking in ur spot rn is the only correct move 🎟🔥\n\n👉 ${event.registrationLink}\n\n⚠️ psa: early bird at ${event.earlyBirdPrice} is literally flying — only ${event.ticketsLeft} left. don't cry abt it later bestie`,
  },

  availability: {
    keywords: [
      "tickets left",
      "availability",
      "spots",
      "available",
      "sold out",
      "remaining",
      "how many left",
      "seats",
    ],
    buildResponse: (event) =>
      `${urgencyBar(event.ticketsLeft)}\n\n**${event.ticketsLeft} tickets** still up for grabs 👀\n⏳ available till ${event.availableTillLabel}\n\nthe clock is literally ticking rn → ${event.registrationLink}`,
  },

  contact: {
    keywords: [
      "contact",
      "phone",
      "call",
      "email",
      "reach",
      "get in touch",
      "support",
      "help line",
      "whatsapp",
    ],
    buildResponse: () =>
      `slide into their dms/inbox anytime 📲\n\n📞 ${CONTACT_PHONE}\n📧 ${CONTACT_EMAIL}\n\nthey actually respond (not like ur situationship) 💀`,
  },

  about: {
    keywords: [
      "netx",
      "about",
      "who are",
      "what is netx",
      "music",
      "vibe",
      "organiser",
      "company",
      "team",
    ],
    buildResponse: (event) =>
      `NetX is literally that friend who throws the best parties 🎉✨ — youth-first, culture-heavy, no boring stuff ever.\n\nnext one up: **${event.name}** — it's gonna be unreal, no cap 🔥`,
  },

  support: {
    keywords: ["help", "assist", "what can you do", "options", "menu"],
    buildResponse: () =>
      `omg i got u 🫶 here's the full menu:\n\n🎉 event deets\n📍 venue & how to get there\n💸 ticket prices (early bird too)\n🎟 registration link\n📞 contact the team\n\njust ask and i'll spill everything no filter 😤`,
  },
};

// ---------------------------------------------------------------------------
// Intent resolution
// ---------------------------------------------------------------------------

export const fallbackIntentResponse = (
  rawQuestion: string,
  lastIntent: IntentKey | null,
): { response: string; intent: IntentKey } => {
  const question = rawQuestion.trim().toLowerCase();
  const liveEvent = getLiveEvent();

  if (!question) {
    return {
      response:
        "bestie say something 😭 ask me about the event, tickets, venue — anything!",
      intent: "support",
    };
  }

  const tokens = tokenize(question);
  const isFollowUp =
    tokens.some((t) => FOLLOW_UP_HINTS.includes(t)) ||
    FOLLOW_UP_HINTS.some((hint) => question.includes(hint));

  // Score each intent
  const scoredIntents = Object.entries(INTENT_DEFINITIONS).map(
    ([intent, config]) => {
      const score = config.keywords.reduce((total, keyword) => {
        if (similarity(question, keyword)) return total + 2;
        const kwTokens = tokenize(keyword);
        const matches = kwTokens.filter((k) => tokens.includes(k)).length;
        return total + matches;
      }, 0);
      return { intent: intent as Exclude<IntentKey, "out_of_context">, score };
    },
  );

  scoredIntents.sort((a, b) => b.score - a.score);
  const bestMatch = scoredIntents[0];

  // Use best match if confident
  if (bestMatch && bestMatch.score >= 2) {
    const builder =
      bestMatch.intent === "price"
        ? buildPriceResponse
        : INTENT_DEFINITIONS[bestMatch.intent].buildResponse;

    return {
      response: builder(liveEvent, question),
      intent: bestMatch.intent,
    };
  }

  // Fall back to last intent if user seems to be following up
  if (isFollowUp && lastIntent && lastIntent !== "out_of_context") {
    const builder =
      lastIntent === "price"
        ? buildPriceResponse
        : INTENT_DEFINITIONS[lastIntent]?.buildResponse;

    if (builder) {
      return { response: builder(liveEvent, question), intent: lastIntent };
    }
  }

  // Friendly dead-end with actionable suggestions
  return {
    response: `okay ngl i'm a lil lost rn 😭 didn't quite catch that\n\nbut i CAN help u with:\n• ticket prices & early bird deals\n• event date, time & venue\n• how to register\n• contact the team\n\njust drop ur q and i gotchu fr 🫶 (it's about **${liveEvent.name}** btw)`,
    intent: "out_of_context",
  };
};

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/** Simulated typing delay for a more natural feel (ms) */
const TYPING_DELAY_MS = 600;

export const generateAssistantReply = async (
  message: string,
  _history: ChatTurn[],
  lastIntent: IntentKey | null,
): Promise<{
  reply: string;
  source: "fallback";
  intent: IntentKey;
  suggestions: string[];
}> => {
  // Natural typing pause
  await new Promise((res) => setTimeout(res, TYPING_DELAY_MS));

  const fallback = fallbackIntentResponse(message, lastIntent);

  return {
    reply: fallback.response,
    source: "fallback",
    intent: fallback.intent,
    suggestions: getSuggestedQuestions(fallback.intent),
  };
};
