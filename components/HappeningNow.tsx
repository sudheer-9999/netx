import React from 'react'
import ElectricBorder from './UI/ElectricBorder'

const HappeningNow = () => {
  return (
    <div
      className="my-4rect
     w-full md:w-1/2 container "
    >
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.12}
        style={{ borderRadius: 16 }}
      >
        <div>
          <div className="grid grid-cols-1  items-start">
            <div className="md:col-span-3 rounded-lg border border-white/10 p-6 bg-white/5">
              <h3 className="text-2xl font-semibold">
                Madhuram2 – Let’s Jammify
              </h3>
              <ul className="mt-4 space-y-2 text-zinc-300">
                <li>📍 Fun n Food, Kissan Ghat, Kurnool</li>
                <li>📅 May 9</li>
                <li>🕖 6 PM onwards</li>
                <li>🎟 Entry: ₹269</li>
              </ul>
              <div className="mt-4 inline-flex items-center gap-2 text-orange-400">
                🔥 Limited Spots Available
              </div>
              <div className="mt-6">
                <a
                  href="https://konfhub.com/madhuram-chapter-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10 transition-colors"
                >
                  👉 Book Your Spot Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}

export default HappeningNow