/**
 * @file Structure.jsx
 * @description Comic Book Superhero Guild & Leadership Council for Class 10A.
 * Featuring Wali Kelas Firman Azhary as the S-Rank Supreme Sensei,
 * along with student commanders, special moves, power meters, and comic badges.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Crown, Star, Award } from 'lucide-react';
import { schoolStructure, BATCH_METADATA } from '../data/invictusData';

export default function Structure() {
  const [activeTier, setActiveTier] = useState('all');

  const mentorNode = schoolStructure.find((n) => n.level === 'mentor');
  const executiveNodes = schoolStructure.filter((n) => n.level === 'executive');
  const officerNodes = schoolStructure.filter((n) => n.level === 'officer');
  const divisionNodes = schoolStructure.filter((n) => n.level === 'division_head');

  const tiers = [
    { id: 'all', label: 'FULL COUNCIL' },
    { id: 'mentor', label: 'WALI KELAS SENSEI' },
    { id: 'executive', label: 'EXECUTIVE COMMAND' },
    { id: 'officer', label: 'SECRETARIAT & TREASURY' },
    { id: 'division', label: 'DIVISION CAPTAINS' },
  ];

  /**
   * Comic Superhero Card for Leadership Nodes
   */
  const ComicLeaderCard = ({ node, isSupreme = false }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4, rotate: isSupreme ? 0 : 1 }}
        className={`relative rounded-2xl p-5 border-3 border-black transition-all duration-200 ${
          isSupreme
            ? 'bg-gradient-to-br from-comic-yellow via-yellow-400 to-amber-500 text-black shadow-comic-lg'
            : 'bg-ink-900 text-white shadow-comic hover:shadow-comic-yellow hover:border-comic-yellow'
        }`}
      >
        {/* Comic Corner Badge / Tier */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`font-comic text-xs px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000] ${
              isSupreme
                ? 'bg-black text-comic-yellow'
                : 'bg-comic-yellow text-black'
            }`}
          >
            {node.comicTier}
          </span>

          <div className="flex items-center gap-1 font-mono text-xs font-bold">
            <Flame className={`w-4 h-4 ${isSupreme ? 'text-black' : 'text-comic-red'}`} />
            <span>PWR: {node.powerLevel}</span>
          </div>
        </div>

        {/* Profile Image & Name Block */}
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-3 border-black flex-shrink-0 shadow-comic bg-black">
            <img
              src={node.photoUrl}
              alt={node.name}
              className="w-full h-full object-cover filter contrast-110"
            />
          </div>

          <div className="min-w-0">
            <span className={`text-[11px] font-mono uppercase tracking-wider block ${isSupreme ? 'text-black/80 font-bold' : 'text-comic-yellow'}`}>
              {node.alias}
            </span>
            <h4 className={`font-comic text-xl sm:text-2xl leading-tight truncate ${isSupreme ? 'text-black' : 'text-white'}`}>
              {node.name}
            </h4>
            <p className={`font-bebas text-xs tracking-wider ${isSupreme ? 'text-black/90' : 'text-neutral-300'}`}>
              {node.role}
            </p>
          </div>
        </div>

        {/* Special Move Callout */}
        <div className={`mt-3 p-2.5 rounded-lg border-2 border-black ${isSupreme ? 'bg-black/10' : 'bg-black/60'}`}>
          <div className="flex items-center gap-1.5 text-[10px] font-comic uppercase tracking-wider mb-0.5 text-comic-red">
            <Zap className="w-3 h-3 fill-comic-red" />
            <span>SPECIAL JUTSU / TECHNIQUE:</span>
          </div>
          <p className={`font-dialogue font-bold text-xs ${isSupreme ? 'text-black' : 'text-comic-yellow'}`}>
            &ldquo;{node.specialMove}&rdquo;
          </p>
        </div>

        {/* Duty description */}
        <p className={`mt-3 text-xs leading-relaxed font-sans ${isSupreme ? 'text-black font-medium' : 'text-neutral-300'}`}>
          {node.duty}
        </p>

        {/* Motto Speech Snippet */}
        <div className="mt-3 pt-2.5 border-t-2 border-black/40 flex items-start gap-1 text-[11px] font-dialogue italic">
          <span className="font-bold text-sm">💬</span>
          <span>&ldquo;{node.motto}&rdquo;</span>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="structure" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-ink-950 border-t-4 border-b-4 border-black bg-halftone-subtle">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-comic-yellow text-black border-2 border-black shadow-comic font-comic text-sm uppercase -rotate-1 mb-4">
            <Crown className="w-4 h-4 text-comic-red fill-comic-red" />
            <span>CHAPTER 01 • THE 10A VANGUARD COUNCIL</span>
          </div>

          <h2 className="font-comic text-4xl sm:text-6xl text-white comic-stroke uppercase tracking-wide">
            STRUKTUR KEPEMIMPINAN <span className="text-comic-yellow">KOMIK 10A</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-dialogue font-bold">
            Struktur kepengurusan resmi dipimpin oleh Wali Kelas Firman Azhary dan komandan pahlawan angkatan.
          </p>

          {/* Tier Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`px-4 py-1.5 rounded-lg font-comic text-xs tracking-wider transition-all border-2 border-black ${
                  activeTier === t.id
                    ? 'bg-comic-yellow text-black shadow-comic -rotate-1 scale-105'
                    : 'bg-ink-900 text-neutral-300 hover:text-comic-yellow hover:bg-black'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tree Render */}
        <div className="space-y-12">
          {/* TIER 1: SUPREME MENTOR (WALI KELAS FIRMAN AZHARY) */}
          {(activeTier === 'all' || activeTier === 'mentor') && mentorNode && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-xl">
                <ComicLeaderCard node={mentorNode} isSupreme={true} />
              </div>

              {activeTier === 'all' && (
                <div className="my-4 flex flex-col items-center">
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                  <div className="w-4 h-4 bg-comic-red rounded-full border-2 border-black shadow-[2px_2px_0px_#000]" />
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                </div>
              )}
            </div>
          )}

          {/* TIER 2: PRESIDIUM (KETUA & WAKIL KETUA) */}
          {(activeTier === 'all' || activeTier === 'executive') && (
            <div>
              <div className="text-center mb-5">
                <span className="bg-black text-comic-yellow font-comic text-sm px-4 py-1 rounded border-2 border-comic-yellow shadow-comic">
                  TIER II • THE COMMANDERS (KETUA & WAKIL)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {executiveNodes.map((n) => (
                  <ComicLeaderCard key={n.id} node={n} />
                ))}
              </div>

              {activeTier === 'all' && (
                <div className="my-6 flex flex-col items-center">
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                  <div className="w-4 h-4 bg-comic-red rounded-full border-2 border-black shadow-[2px_2px_0px_#000]" />
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                </div>
              )}
            </div>
          )}

          {/* TIER 3: SECRETARIAT & TREASURY */}
          {(activeTier === 'all' || activeTier === 'officer') && (
            <div>
              <div className="text-center mb-5">
                <span className="bg-black text-comic-yellow font-comic text-sm px-4 py-1 rounded border-2 border-comic-yellow shadow-comic">
                  TIER III • KESEKRETARIATAN & KEBENDAHARAAN
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {officerNodes.map((n) => (
                  <ComicLeaderCard key={n.id} node={n} />
                ))}
              </div>

              {activeTier === 'all' && (
                <div className="my-6 flex flex-col items-center">
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                  <div className="w-4 h-4 bg-comic-red rounded-full border-2 border-black shadow-[2px_2px_0px_#000]" />
                  <div className="w-1 h-8 bg-comic-yellow border-x-2 border-black" />
                </div>
              )}
            </div>
          )}

          {/* TIER 4: DIVISION HEADS */}
          {(activeTier === 'all' || activeTier === 'division') && (
            <div>
              <div className="text-center mb-5">
                <span className="bg-black text-comic-yellow font-comic text-sm px-4 py-1 rounded border-2 border-comic-yellow shadow-comic">
                  TIER IV • KEPALA DIVISI SPESIALIS (IT, MEDIA, STRATEGI, LOGISTIK)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {divisionNodes.map((n) => (
                  <ComicLeaderCard key={n.id} node={n} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
