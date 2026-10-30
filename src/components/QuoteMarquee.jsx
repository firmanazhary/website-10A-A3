/**
 * @file QuoteMarquee.jsx
 * @description Comic Book Dialogue Strip Marquee.
 * Renders continuous horizontal speech bubbles with action sound effects,
 * quotes from Wali Kelas Firman Azhary, Ketua Baim, and squad members.
 */

import React, { useState } from 'react';
import { Zap, MessageSquare, Star } from 'lucide-react';
import { batchQuotes, BATCH_METADATA } from '../data/invictusData';

export default function QuoteMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const marqueeItems = [...batchQuotes, ...batchQuotes, ...batchQuotes];

  const comicSounds = [
    'POW!', 'BOOOOM!', 'KABLAM!', 'SWOOOSH!', 'ZAP!', 'WHAM!', 'SLASH!', 'CRUNCH!'
  ];
  const soundStrip = [...comicSounds, ...comicSounds, ...comicSounds, ...comicSounds];

  return (
    <section
      id="quotes"
      className="relative py-16 bg-black border-t-4 border-b-4 border-black overflow-hidden select-none"
    >
      {/* Background Halftone */}
      <div className="absolute inset-0 bg-halftone-yellow opacity-30 pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto px-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-comic-yellow text-black border-2 border-black font-comic text-xs uppercase -rotate-1 mb-2">
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span>CHAPTER 03 • PANELS OF WISDOM & DIALOGUE</span>
        </div>
        <h2 className="font-comic text-3xl sm:text-5xl text-white comic-stroke tracking-wide uppercase">
          KATA MUTIARA <span className="text-comic-yellow">& SUARA KOMIK 10A</span>
        </h2>
      </div>

      {/* Track 1: Speech Bubbles */}
      <div
        className="relative w-full overflow-hidden flex cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 items-stretch py-3 animate-marquee ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
        >
          {marqueeItems.map((q, idx) => (
            <div
              key={`dialogue-${idx}`}
              className="flex-shrink-0 w-[320px] sm:w-[400px] rounded-2xl bg-white text-black border-3 border-black shadow-comic p-4 flex flex-col justify-between relative hover:rotate-1 transition-transform"
            >
              {/* Sound Sticker */}
              <div className="absolute -top-3 -right-2 bg-comic-red text-white font-comic text-xs px-2 py-0.5 rounded border-2 border-black rotate-12 shadow-[2px_2px_0px_#000]">
                {q.sound || "POW!"}
              </div>

              <div>
                <p className="font-dialogue font-bold text-sm text-neutral-900 leading-snug">
                  &ldquo;{q.text}&rdquo;
                </p>
              </div>

              <div className="mt-3 pt-2 border-t-2 border-black flex items-center justify-between">
                <div>
                  <h4 className="font-comic text-base text-black leading-tight">
                    {q.author}
                  </h4>
                  <p className="font-bebas text-xs text-neutral-600">
                    {q.role}
                  </p>
                </div>
                <Zap className="w-4 h-4 text-comic-yellow fill-comic-yellow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Track 2: Reverse Sound Effects Strip */}
      <div className="relative w-full overflow-hidden flex mt-4">
        <div className="flex gap-4 items-center animate-marquee-reverse whitespace-nowrap">
          {soundStrip.map((snd, idx) => (
            <div
              key={`sound-${idx}`}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-comic-yellow text-black font-comic text-sm tracking-widest uppercase border-2 border-black shadow-comic-sm"
            >
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>{snd}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
