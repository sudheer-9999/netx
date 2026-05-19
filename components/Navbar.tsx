"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { NavItem } from "./NavItem";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("#home");

  useEffect(() => {
    const updateHash = () => {
      if (typeof window === "undefined") return;
      setHash(window.location.hash || "#home");
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-9999999 px-4 py-4 mix-blend-difference">
        <div className="flex justify-between items-start">
          <Link href="/new" className="font-bold">
            <Image
              src="/logo.jpeg"
              alt="NetX Events logo"
              width={70}
              height={70}
              className="object-cover"
              priority
            />
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex gap-6 text-xs uppercase">
            <NavItem
              href="/new#home"
              label="Home"
              active={pathname === "/new" && (hash === "" || hash === "#home")}
            />
            <NavItem
              href="/new#experiences"
              label="Experiences"
              active={pathname === "/new" && hash === "#experiences"}
            />
            <NavItem
              href="/new#upcoming"
              label="Happening Now"
              active={pathname === "/new" && hash === "#upcoming"}
            />
            <NavItem
              href="/new#why-netx"
              label="Why NetX"
              active={pathname === "/new" && hash === "#why-netx"}
            />
            <NavItem
              href="/new#sponsors"
              label="Sponsor"
              active={pathname === "/new" && hash === "#sponsors"}
            />
            <NavItem
              href="/new#partners"
              label="Collaborate"
              active={pathname === "/new" && hash === "#partners"}
            />
          </ul>

          {/* Mobile button */}
          <button
            className="md:hidden text-xs uppercase font-bold"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}
