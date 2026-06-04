"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventInfo, EventMediaItem, EventPoster, EventStatus } from "@/lib/events";
import { ADMIN_HEADER } from "@/lib/admin-auth";
import EventMediaManager from "./EventMediaManager";
import EventPosterManager from "./EventPosterManager";
import {
  emptyForm,
  eventToForm,
  formToPayload,
  slugify,
  type EventFormState,
} from "./event-form-utils";

const ADMIN_KEY_STORAGE = "netx-admin-key";

const STATUS_STYLES: Record<EventStatus, string> = {
  active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  upcoming: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  completed: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40",
};

const inputClass =
  "w-full rounded-md border border-white/15 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none";

const labelClass = "mb-1 block text-xs font-medium text-zinc-400";

const EventAdminPanel = () => {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<EventFormState>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAdminKey(stored);
  }, []);

  const authHeaders = useCallback((): HeadersInit => {
    if (!adminKey) return {};
    return { [ADMIN_HEADER]: adminKey };
  }, [adminKey]);

  const loadEvents = useCallback(async () => {
    const res = await fetch("/api/events", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load events");
    const data = (await res.json()) as { events: EventInfo[] };
    setEvents(data.events);
  }, []);

  useEffect(() => {
    if (!adminKey) return;
    loadEvents().catch(() => setError("Could not load events."));
  }, [adminKey, loadEvents]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });
    const data = (await res.json()) as { ok?: boolean };
    if (!data.ok) {
      setLoginError("Invalid password.");
      return;
    }
    sessionStorage.setItem(ADMIN_KEY_STORAGE, passwordInput);
    setAdminKey(passwordInput);
    setPasswordInput("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey(null);
  };

  const selectEvent = (event: EventInfo) => {
    setIsNew(false);
    setSelectedId(event.id);
    setForm(eventToForm(event));
    setMessage("");
    setError("");
  };

  const startNew = () => {
    setIsNew(true);
    setSelectedId(null);
    setForm(emptyForm());
    setMessage("");
    setError("");
  };

  const handleMediaChange = (media: EventMediaItem[], event?: EventInfo) => {
    setForm((prev) => ({
      ...prev,
      media,
      poster: event?.poster ?? prev.poster,
    }));
    if (event) {
      setSelectedId(event.id);
      setIsNew(false);
    }
    void loadEvents();
  };

  const handlePosterChange = (poster: EventPoster | null, event?: EventInfo) => {
    setForm((prev) => ({
      ...prev,
      poster,
      media: event?.media ?? prev.media,
    }));
    if (event) {
      setSelectedId(event.id);
      setIsNew(false);
    }
    void loadEvents();
  };

  const updateField = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && isNew && typeof value === "string") {
        next.id = slugify(value);
      }
      return next;
    });
  };

  const updateTier = (index: number, field: "price" | "label", value: string) => {
    setForm((prev) => {
      const tiers = [...prev.ticketTiers];
      tiers[index] = { ...tiers[index], [field]: value };
      return { ...prev, ticketTiers: tiers };
    });
  };

  const addTier = () => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { price: "₹", label: "" }],
    }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) return;

    setLoading(true);
    setMessage("");
    setError("");

    const payload = formToPayload(form);
    if (!payload.id) {
      setError("Event ID is required.");
      setLoading(false);
      return;
    }
    if (payload.ticketTiers.length === 0) {
      setError("Add at least one ticket tier (price + label).");
      setLoading(false);
      return;
    }

    try {
      const url = isNew
        ? "/api/events"
        : `/api/events?id=${encodeURIComponent(payload.id)}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; event?: EventInfo };
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
        return;
      }

      setMessage(
        isNew
          ? "Event created. You can now upload images and videos below."
          : "Event updated.",
      );
      setIsNew(false);
      setSelectedId(payload.id);
      if (data.event) setForm(eventToForm(data.event));
      await loadEvents();
    } catch {
      setError("Network error while saving.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async () => {
    if (!adminKey || !selectedId || isNew) return;
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `/api/events?id=${encodeURIComponent(selectedId)}`,
        { method: "DELETE", headers: authHeaders() },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Delete failed.");
        return;
      }
      setMessage("Event deleted.");
      startNew();
      setForm(emptyForm());
      setSelectedId(null);
      await loadEvents();
    } catch {
      setError("Network error while deleting.");
    } finally {
      setLoading(false);
    }
  };

  if (!adminKey) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold text-white">NetX Admin</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to manage events.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className={labelClass} htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={inputClass}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Event Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create and edit events — changes go live on the site immediately.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            View site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
          <button
            type="button"
            onClick={startNew}
            className="mb-4 w-full rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            + New event
          </button>
          <ul className="space-y-2">
            {events.map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => selectEvent(ev)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    selectedId === ev.id && !isNew
                      ? "border-cyan-400/50 bg-cyan-500/10 text-white"
                      : "border-transparent text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="block font-medium truncate">{ev.name}</span>
                  <span
                    className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] uppercase ${STATUS_STYLES[ev.status]}`}
                  >
                    {ev.status}
                  </span>
                </button>
              </li>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-zinc-500">No events yet.</p>
            )}
          </ul>
        </aside>

        <main className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
          {!selectedId && !isNew ? (
            <p className="text-zinc-400">
              Select an event to edit or create a new one.
            </p>
          ) : (
            <form onSubmit={saveEvent} className="space-y-6">
              <h2 className="text-lg font-semibold text-white">
                {isNew ? "New event" : `Edit: ${form.name}`}
              </h2>

              {message && (
                <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  {message}
                </p>
              )}
              {error && (
                <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <section className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Event name</label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>ID (slug)</label>
                  <input
                    className={inputClass}
                    value={form.id}
                    onChange={(e) => updateField("id", e.target.value)}
                    disabled={!isNew}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Subtitle</label>
                  <input
                    className={inputClass}
                    value={form.subtitle}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      updateField("status", e.target.value as EventStatus)
                    }
                  >
                    <option value="active">active — live on site + popup</option>
                    <option value="upcoming">upcoming — live on site</option>
                    <option value="completed">completed — hidden from site</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tickets left</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.ticketsLeft}
                    onChange={(e) => updateField("ticketsLeft", e.target.value)}
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                  Date & time
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Date label (display)</label>
                    <input
                      className={inputClass}
                      placeholder="13th June (Saturday)"
                      value={form.dateLabel}
                      onChange={(e) => updateField("dateLabel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ISO date & time</label>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      value={form.isoDateLocal}
                      onChange={(e) =>
                        updateField("isoDateLocal", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Time label</label>
                    <input
                      className={inputClass}
                      placeholder="6:30 PM onwards"
                      value={form.timeLabel}
                      onChange={(e) => updateField("timeLabel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Gates open</label>
                    <input
                      className={inputClass}
                      placeholder="6:15 PM"
                      value={form.gatesOpenLabel}
                      onChange={(e) =>
                        updateField("gatesOpenLabel", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Available till label</label>
                    <input
                      className={inputClass}
                      value={form.availableTillLabel}
                      onChange={(e) =>
                        updateField("availableTillLabel", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">Venue</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Venue</label>
                    <input
                      className={inputClass}
                      value={form.venue}
                      onChange={(e) => updateField("venue", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      className={inputClass}
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <input
                      className={inputClass}
                      value={form.venueAddress}
                      onChange={(e) =>
                        updateField("venueAddress", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Google Maps link</label>
                    <input
                      className={inputClass}
                      value={form.mapLink}
                      onChange={(e) => updateField("mapLink", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Ticket tiers
                  </h3>
                  <button
                    type="button"
                    onClick={addTier}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    + Add tier
                  </button>
                </div>
                <div className="space-y-2">
                  {form.ticketTiers.map((tier, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder="₹269"
                        value={tier.price}
                        onChange={(e) =>
                          updateTier(index, "price", e.target.value)
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="JAM PASS"
                        value={tier.label}
                        onChange={(e) =>
                          updateTier(index, "label", e.target.value)
                        }
                      />
                      {form.ticketTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="shrink-0 rounded-md border border-red-500/30 px-3 text-red-400 hover:bg-red-500/10"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Primary tier name</label>
                    <input
                      className={inputClass}
                      value={form.ticketTierName}
                      onChange={(e) =>
                        updateField("ticketTierName", e.target.value)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Tier description</label>
                    <textarea
                      className={`${inputClass} min-h-[72px]`}
                      value={form.ticketTierDescription}
                      onChange={(e) =>
                        updateField("ticketTierDescription", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                  Booking links
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Konfhub URL</label>
                    <input
                      className={inputClass}
                      value={form.registrationLink}
                      onChange={(e) =>
                        updateField("registrationLink", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>District URL</label>
                    <input
                      className={inputClass}
                      value={form.districtLink}
                      onChange={(e) =>
                        updateField("districtLink", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                  Event poster (popup)
                </h3>
                <EventPosterManager
                  eventId={selectedId}
                  isNew={isNew}
                  poster={form.poster}
                  adminKey={adminKey ?? ""}
                  onPosterChange={handlePosterChange}
                />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                  Media gallery
                </h3>
                <EventMediaManager
                  eventId={selectedId}
                  isNew={isNew}
                  media={form.media}
                  adminKey={adminKey ?? ""}
                  onMediaChange={handleMediaChange}
                />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">
                  Extras
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Dress code</label>
                    <input
                      className={inputClass}
                      value={form.dressCode}
                      onChange={(e) => updateField("dressCode", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Features (one per line)
                    </label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={form.featuresText}
                      onChange={(e) =>
                        updateField("featuresText", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  {loading ? "Saving…" : isNew ? "Create event" : "Save changes"}
                </button>
                {!isNew && selectedId && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={deleteEvent}
                    className="rounded-md border border-red-500/40 px-6 py-2.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventAdminPanel;
