import EventAdminPanel from "@/components/admin/EventAdminPanel";

export const metadata = {
  title: "Event Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 via-black to-zinc-950 text-white">
      <EventAdminPanel />
    </div>
  );
}
