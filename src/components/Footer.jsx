/**
 * @file Footer.jsx
 * @description Comic Book Back-Cover Footer for INVICTUS 10A.
 * Featuring the custom logo, Wali Kelas Firman Azhary tribute,
 * comic stamps, and smooth return-to-cover button.
 */

import React from 'react';
import { ArrowUp, Sparkles, Heart, Zap } from 'lucide-react';
import { BATCH_METADATA } from '../data/invictusData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative bg-ink-950 border-t-4 border-black pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-halftone-yellow">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b-4 border-black">
          {/* Logo & Comic Title */}
          <div className="md:col-span-7 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-black border-3 border-comic-yellow rounded-xl shadow-comic">
                <img
                  src={BATCH_METADATA.logoUrl}
                  alt="INVICTUS Logo"
                  className="h-14 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(255,230,0,0.6)]"
                />
              </div>

              <div>
                <span className="font-comic text-3xl tracking-wider text-comic-yellow comic-stroke">
                  {BATCH_METADATA.batchName} 10A
                </span>
                <span className="block font-bebas text-sm text-neutral-300 tracking-wider">
                  {BATCH_METADATA.schoolName} • {BATCH_METADATA.academicYear}
                </span>
              </div>
            </div>

            {/* Comic Motto Speech Box */}
            <div className="p-3 bg-white text-black rounded-xl border-2 border-black shadow-comic max-w-lg">
              <div className="font-comic text-xs text-comic-red uppercase tracking-wider mb-0.5">
                CLASS MOTTO:
              </div>
              <p className="font-dialogue font-bold text-sm leading-snug">
                &ldquo;{BATCH_METADATA.motto}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-comic-yellow font-bold">WALI KELAS:</span>
              <span className="text-white font-bold">FIRMAN AZHARY</span>
              <span>•</span>
              <span className="text-neutral-400">CLASS OF {BATCH_METADATA.graduationYear}</span>
            </div>
          </div>

          {/* Right Action: Return to Cover & Comic Seal */}
          <div className="md:col-span-5 flex flex-col md:items-end justify-between gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-comic-yellow text-black font-comic text-base tracking-wider uppercase border-3 border-black shadow-comic hover:shadow-comic-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              aria-label="Kembali ke sampul atas"
            >
              <span>KEMBALI KE SAMPUL</span>
              <ArrowUp className="w-5 h-5" />
            </button>

            {/* Comic Seal */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-comic-red text-white font-comic text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000] -rotate-2">
                ISSUE #10A ARCHIVE
              </span>
              <span className="px-3 py-1 bg-black text-comic-yellow font-comic text-xs rounded border-2 border-comic-yellow shadow-comic rotate-1">
                TO BE CONTINUED!
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-1.5 font-comic text-sm text-neutral-300">
            <span>DIBUAT DENGAN</span>
            <Zap className="w-4 h-4 text-comic-yellow fill-comic-yellow" />
            <span>UNTUK KELAS 10A INVICTUS & WALI KELAS FIRMAN AZHARY</span>
          </div>

          <div className="font-bebas tracking-wider text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} INVICTUS CHRONICLES • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
