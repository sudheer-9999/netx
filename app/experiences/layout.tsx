import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Past and upcoming NetX events — photos and videos from every experience.",
};

export default function ExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
