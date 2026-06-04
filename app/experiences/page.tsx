import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/app/components/Footer";
import ExperiencesSection from "@/components/ExperiencesSection";

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-6 border-b border-white/[0.06] pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan-400/80">
                Index / 01
              </p>
              <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
                Experiences
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-500">
                Curated moments from every NetX event — reels, crowds, and
                memories in one place.
              </p>
            </div>
            <Link
              href="/#upcoming"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 lg:self-auto"
            >
              Happening now →
            </Link>
          </header>

          <div className="py-12 lg:py-16">
            <ExperiencesSection showStats />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
