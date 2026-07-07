"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CHANNEL, LESSONS, TRACKS, type Lesson, type TrackKey, thumb, embedUrl, watchUrl } from "../data/learn";
import { LightHeader, LightFooter, BRAND_ORANGE as ORANGE } from "../components/LightChrome";

const STORAGE = "briddhi.learn.watched";
const START_LESSON = LESSONS.find((l) => l.track === "mf101" && l.ep === 1) ?? LESSONS[0];

// Friendly, plain-language section titles (no "Ep 1 / Ep 2" jargon).
const SECTIONS: { key: TrackKey; emoji: string; title: string; subtitle: string }[] = [
  { key: "start", emoji: "🌱", title: "Start here", subtitle: "Money basics — no experience needed." },
  { key: "mf101", emoji: "📘", title: "Mutual funds, made simple", subtitle: "Watch left to right, it builds up." },
  { key: "realestate", emoji: "🏠", title: "Property & land", subtitle: "Building wealth that lasts." },
  { key: "money", emoji: "🧾", title: "Smart money & tax", subtitle: "Keep more of what you earn." },
];

export default function LearnPage() {
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<{ id: string; autoplay: boolean }>({ id: START_LESSON.id, autoplay: false });
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setWatched(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  const play = (id: string) => {
    setSelected({ id, autoplay: true });
    setWatched((prev) => {
      const s = new Set(prev).add(id);
      localStorage.setItem(STORAGE, JSON.stringify([...s]));
      return s;
    });
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const current = useMemo(() => LESSONS.find((l) => l.id === selected.id) ?? START_LESSON, [selected.id]);
  const track = TRACKS.find((t) => t.key === current.track);

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />

      {/* HERO — one clear message */}
      <section className="bg-gradient-to-b from-white to-[#F7F8FB]">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold" style={{ color: ORANGE }}>
              ▶ Free lessons · {CHANNEL.name}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Investing, <span style={{ color: ORANGE }}>explained simply.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
              Short videos in plain language. Just press play — no forms, no jargon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PLAYER */}
      <section ref={playerRef} className="mx-auto max-w-4xl scroll-mt-20 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              key={selected.id + String(selected.autoplay)}
              src={embedUrl(selected.id, selected.autoplay)}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="min-w-0">
              <div className="text-xs font-bold" style={{ color: ORANGE }}>
                {track?.emoji} {track?.label}
              </div>
              <h2 className="mt-0.5 truncate text-lg font-bold text-slate-900">{current.title}</h2>
            </div>
            <a
              href={watchUrl(current.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </section>

      {/* TOPIC ROWS — scroll through, tap to play */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {SECTIONS.map((section) => {
          const lessons = LESSONS.filter((l) => l.track === section.key).sort((a, b) => (a.ep ?? 99) - (b.ep ?? 99));
          if (lessons.length === 0) return null;
          return (
            <section key={section.key} className="mb-10">
              <div className="mb-3 flex items-end gap-3">
                <span className="text-2xl">{section.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-500">{section.subtitle}</p>
                </div>
              </div>
              <div className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
                {lessons.map((l) => (
                  <LessonCard key={l.id} lesson={l} watched={watched.has(l.id)} active={current.id === l.id} onPlay={() => play(l.id)} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* SIMPLE NEXT STEP */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5 sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Feel ready? Take the first step.</h3>
            <p className="mt-1 text-sm text-slate-500">A quick quiz shows what kind of investor you are — in 5 questions.</p>
          </div>
          <Link href="/risk-quiz" className="shrink-0 rounded-xl px-6 py-3 font-semibold text-white shadow-lg" style={{ background: ORANGE }}>
            Find my profile →
          </Link>
        </div>
      </section>

      <LightFooter />
    </div>
  );
}

function LessonCard({
  lesson,
  watched,
  active,
  onPlay,
}: {
  lesson: Lesson;
  watched: boolean;
  active: boolean;
  onPlay: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onPlay}
      className="group w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 transition-shadow hover:shadow-lg"
      style={{ boxShadow: active ? `0 0 0 2px ${ORANGE}` : undefined }}
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(lesson.id)} alt={lesson.title} className="aspect-video w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 grid place-items-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100">
          <span className="grid h-12 w-12 place-items-center rounded-full text-lg text-white shadow-lg" style={{ background: ORANGE }}>
            ▶
          </span>
        </div>
        {watched && (
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "#059669" }}>
            ✓
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="line-clamp-2 font-semibold leading-snug text-slate-900">{lesson.title}</div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{lesson.blurb}</p>
      </div>
    </motion.button>
  );
}
