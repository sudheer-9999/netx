import React from "react";

const NEW_VIDEOS = [
  {
    title: "NetX Event Highlights – Unforgettable Moments",
    src: "/videos/Video-1.mp4",
  },
  {
    title: "NetX Aftermovie – Energy, Music & Crowd Vibes",
    src: "/videos/Video-2.mp4",
  },
];

export default function NewVideosSection() {
  return (
    <section id="new-videos" className="px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            Latest Uploads
          </p>
          {/* <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            New Event Videos
          </h2> */}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {NEW_VIDEOS.map((video) => (
            <article
              key={video.src}
              className="overflow-hidden rounded-xl border border-white/15 bg-white/5"
            >
              <video
                autoPlay
                muted
                loop
                preload="metadata"
                playsInline
                className="aspect-video w-full bg-black object-cover"
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <div className="border-t border-white/10 px-4 py-3">
                <h3 className="text-sm font-medium text-zinc-100">{video.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
