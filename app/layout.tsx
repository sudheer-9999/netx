import "./globals.css";
import { Orbitron, Exo_2, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-exo",
});

export const metadata = {
  title: "NetX - Your Vision. Our Execution.",
  description:
    "Professional event orchestration company organizing sports tournaments, corporate events, and social celebrations",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(orbitron.variable, exo2.variable, "font-sans", geist.variable)}>
      <body className="font-exo">{children}</body>
    </html>
  );
}
