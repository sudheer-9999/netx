import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/app/components/Footer";
import EventExperienceDetail from "@/components/EventExperienceDetail";
import { getEventById, reloadEvents } from "@/lib/events-store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  reloadEvents();
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return { title: "Experience not found" };

  const title = event.subtitle ? `${event.name} – ${event.subtitle}` : event.name;
  return {
    title,
    description: `${event.dateLabel} · ${event.city} — NetX Events experience gallery`,
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  reloadEvents();
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(139,92,246,0.06),transparent)]" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/experiences"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          All experiences
        </Link>
        <EventExperienceDetail event={event} />
      </main>

      <Footer />
    </div>
  );
}
