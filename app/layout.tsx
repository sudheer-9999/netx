import "./globals.css";
import { Orbitron, Exo_2 } from "next/font/google";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className="font-exo">{children}</body>
    </html>
  );
}
