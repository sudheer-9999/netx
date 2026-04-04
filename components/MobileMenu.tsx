"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    if (open) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = "auto"
    }
  }, [open, setOpen])

  return (
    <div
      className={`
         md:hidden fixed inset-0 z-10000000
        bg-black text-white p-4
        flex flex-col
         transition-all duration-500 ease-out
         ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}
      `}
    >
      {/* Close */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(false)}
          className="text-xs uppercase"
        >
          Close
        </button>
      </div>

      {/* Menu */}
      <ul className="flex flex-col mt-32 text-3xl font-bold uppercase">
        <li className="py-2">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
        </li>

        <li className="py-2">
          <Link href="/portfolio" onClick={() => setOpen(false)}>
            Portfolio <span className="text-base ml-2">[21]</span>
          </Link>
        </li>

        <li className="py-2">
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </li>

        <li className="py-2">
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto flex justify-between text-xs uppercase">
        <div className="flex flex-col gap-1">
          <span>Privacy Policy</span>
          <span>Terms Of Service</span>
        </div>

        <span>©2026 T11</span>
      </div>
    </div>
  )
}