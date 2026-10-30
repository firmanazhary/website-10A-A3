/**
 * @file Hero.jsx
 * @description Comic Book Cover Hero section for INVICTUS 10A.
 * Designed like a retro/manga superhero collector's edition comic book cover.
 * Displays the uploaded custom logo, explosive action sound stickers,
 * Wali Kelas Firman Azhary badge, and animated comic power counters.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowDown, Shield, Trophy, Users, BookOpen } from 'lucide-react';
import { BATCH_METADATA, members, BATCH_STATS } from '../data/invictusData';

/**
 * Animated numerical counter for comic statistics.
 */
function ComicCounter({ end, duration = 1200, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = null;
    let frame;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden bg-ink-950 bg-halftone-yellow"
    >
      {/* Comic Halftone Paper Tint Overlay */}
      <div className="absolute inset-0 bg-action-lines opacity-60 pointer-events-none" />

      {/* Comic Action Starbursts in background */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-comic-yellow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-comic-red/10 rounded-full blur-3xl pointer-events-none" />

      {/* Comic Book Frame Border Outer Wrapper */}
      <div className="relative z-10 max-w-5xl w-full mx-auto p-5 sm:p-8 rounded-3xl bg-ink-900/90 border-4 border-black shadow-comic-lg backdrop-blur-md">
        {/* Comic Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-4 border-black">
          <div className="flex items-center gap-2">
            <span className="bg-comic-red text-white font-comic text-xs sm:text-sm px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000] -rotate-2">
              SPECIAL ISSUE #10A
            </span>
            <span className="font-bebas text-neutral-300 text-xs sm:text-sm tracking-wider uppercase">
              {BATCH_METADATA.academicYear} EDITION
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-0.5 bg-comic-yellow text-black font-comic text-xs border-2 border-black rounded shadow-[2px_2px_0px_#000] rotate-1">
              APPROVED BY SENSEI FIRMAN AZHARY
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-neutral-400">
              PRICE: 100% SOLID
            </span>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="py-8 sm:py-12 flex flex-col items-center text-center relative">
          {/* Action Sound Sticker: "BOOOM!" */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="absolute top-2 left-2 sm:left-6 z-20 bg-comic-yellow text-black font-comic text-lg sm:text-2xl px-3 py-1 rounded-lg border-3 border-black shadow-comic cursor-default select-none hover:rotate-12 transition-transform"
          >
            BOOOOM!
          </motion.div>

          {/* Action Sound Sticker: "POW!" */}
          <motion.div
            initial={{ scale: 0, rotate: 25 }}
            animate={{ scale: 1, rotate: 14 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.35 }}
            className="absolute top-4 right-2 sm:right-6 z-20 bg-comic-red text-white font-comic text-lg sm:text-2xl px-3 py-1 rounded-lg border-3 border-black shadow-comic cursor-default select-none hover:-rotate-6 transition-transform"
          >
            POW!
          </motion.div>

          {/* PROMINENT USER-UPLOADED INVICTUS LOGO */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-4 group"
          >
            <div className="relative p-4 sm:p-6 bg-black/90 rounded-2xl border-4 border-black shadow-comic-yellow hover:scale-105 transition-transform duration-300">
              <img
                src={BATCH_METADATA.logoUrl}
                alt="INVICTUS Official Graffiti Calligraphy Logo"
                className="max-h-36 sm:max-h-48 md:max-h-56 w-auto object-contain mx-auto filter drop-shadow-[0_4px_10px_rgba(255,230,0,0.6)]"
              />
            </div>
            {/* Comic Logo Underline Tag */}
            <div className="mt-3 inline-block bg-white text-black font-comic text-xs sm:text-sm px-4 py-1 rounded-full border-2 border-black shadow-comic -rotate-1">
              THE UNCONQUERED BATCH OF CLASS 10A
            </div>
          </motion.div>

          {/* Comic Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-comic text-5xl sm:text-7xl md:text-8xl tracking-wider text-comic-yellow comic-stroke uppercase leading-none mt-2"
          >
            {BATCH_METADATA.batchName} CHRONICLES
          </motion.h1>

          {/* Latin Motto Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white text-black border-3 border-black shadow-comic relative speech-bubble-bottom"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-comic-red fill-comic-red" />
              <span className="font-comic text-xl sm:text-2xl tracking-wide uppercase text-black">
                &ldquo;NON DUCOR DUCO!&rdquo;
              </span>
              <Zap className="w-5 h-5 text-comic-red fill-comic-red" />
            </div>
            <p className="font-dialogue font-bold text-sm sm:text-base text-neutral-800 leading-snug">
              Kami bukan pengikut biasa; kamilah pahlawan yang mengukir takdir emas kami sendiri!
            </p>
          </motion.div>

          {/* Wali Kelas & Class Leadership Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-ink-800 rounded-xl border-2 border-comic-yellow text-neutral-200 shadow-comic">
              <Shield className="w-4 h-4 text-comic-yellow" />
              <span className="font-bebas text-sm sm:text-base tracking-wider text-neutral-300">
                WALI KELAS:
              </span>
              <span className="font-comic text-base sm:text-lg text-comic-yellow tracking-wide">
                FIRMAN AZHARY
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-ink-800 rounded-xl border-2 border-comic-red text-neutral-200 shadow-comic">
              <Trophy className="w-4 h-4 text-comic-red" />
              <span className="font-bebas text-sm sm:text-base tracking-wider text-neutral-300">
                TOTAL HERO SQUAD:
              </span>
              <span className="font-comic text-base sm:text-lg text-white tracking-wide">
                {members.length} SISWA
              </span>
            </div>
          </motion.div>

          {/* Action Call-to-Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#directory"
              className="px-7 py-3.5 bg-comic-yellow hover:bg-yellow-400 text-black font-comic text-lg tracking-wider uppercase rounded-xl border-3 border-black shadow-comic-lg hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_#000] transition-all flex items-center gap-2"
            >
              <span>BUKA PROFIL HEROES!</span>
              <span className="text-xl">➔</span>
            </a>

            <a
              href="#structure"
              className="px-7 py-3.5 bg-ink-800 hover:bg-neutral-800 text-comic-yellow font-comic text-lg tracking-wider uppercase rounded-xl border-3 border-black shadow-comic hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              <span>STRUKTUR GUILD 10A</span>
            </a>
          </motion.div>
        </div>

        {/* Comic Stats Grid (Power Levels) */}
        <div className="pt-6 border-t-4 border-black grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BATCH_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-ink-950 border-2 border-black shadow-comic text-center group hover:border-comic-yellow transition-colors"
            >
              <div className="text-[11px] font-comic tracking-widest text-neutral-400 uppercase mb-1">
                {stat.label}
              </div>
              <div className="font-comic text-2xl sm:text-4xl text-comic-yellow comic-stroke-sm">
                <ComicCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 font-bebas text-xs text-neutral-300 tracking-wider">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-8 text-center">
        <a
          href="#structure"
          className="inline-flex flex-col items-center text-comic-yellow hover:text-white transition-colors"
        >
          <span className="font-comic text-xs tracking-widest uppercase mb-1">
            SCROLL UNTUK CHAPTER BERIKUTNYA
          </span>
          <ArrowDown className="w-5 h-5 animate-bounce text-comic-yellow" />
        </a>
      </div>
    </section>
  );
}
