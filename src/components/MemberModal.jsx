/**
 * @file MemberModal.jsx
 * @description Comic Book Hero Dossier Modal.
 * Displays character stats, power meters (Aura, Intellect, Chaos, Stamina),
 * comic speech bubble quote, secret origin/trivia, and special move breakdown.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Flame, Shield, Briefcase, Smile, Instagram, Github, Linkedin, Award } from 'lucide-react';

export default function MemberModal({ member, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (member) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-ink-900 border-4 border-black rounded-3xl shadow-comic-lg overflow-hidden z-10 my-6"
        >
          {/* Top Comic Banner */}
          <div className="bg-comic-yellow text-black px-4 py-2 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-comic-red text-white font-comic text-xs px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                HERO FILE: {member.id}
              </span>
              <span className="font-comic text-sm tracking-wider uppercase">
                CLASS 10A INVICTUS DOSSIER
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-black text-comic-yellow hover:bg-comic-red hover:text-white border-2 border-black transition-colors"
              aria-label="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
            {/* Left Photo & Badges */}
            <div className="md:col-span-5 relative bg-black min-h-[260px] md:min-h-full p-4 flex flex-col justify-between">
              <div className="relative rounded-2xl overflow-hidden border-3 border-black shadow-comic h-full min-h-[220px]">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover filter contrast-110"
                />

                {/* Sound effect sticker */}
                <div className="absolute top-2 right-2 bg-comic-red text-white font-comic text-sm px-2 py-0.5 rounded border-2 border-black rotate-12 shadow-[2px_2px_0px_#000]">
                  {member.comicSound || "WHAM!"}
                </div>

                <div className="absolute bottom-2 left-2 bg-comic-yellow text-black font-comic text-xs px-2 py-1 rounded border-2 border-black">
                  {member.badge}
                </div>
              </div>

              {/* Character Stats Bars */}
              {member.stats && (
                <div className="mt-4 p-3 bg-ink-950 rounded-xl border-2 border-black space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-comic text-comic-yellow">
                    <span>HERO STATS</span>
                    <span>LEVEL MAX</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-300">
                      <span>AURA</span>
                      <span className="text-comic-yellow font-bold">{member.stats.aura}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full border border-black overflow-hidden mt-0.5">
                      <div className="bg-comic-yellow h-full" style={{ width: `${member.stats.aura}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-300">
                      <span>INTELLECT</span>
                      <span className="text-comic-blue font-bold">{member.stats.intellect}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full border border-black overflow-hidden mt-0.5">
                      <div className="bg-comic-blue h-full" style={{ width: `${member.stats.intellect}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-300">
                      <span>CHAOS FACTOR</span>
                      <span className="text-comic-red font-bold">{member.stats.chaos}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full border border-black overflow-hidden mt-0.5">
                      <div className="bg-comic-red h-full" style={{ width: `${member.stats.chaos}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Profile Details */}
            <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-comic-yellow font-bold tracking-wider">
                  {member.alias}
                </span>

                <h3 className="font-comic text-3xl sm:text-4xl text-white comic-stroke-sm leading-none mt-1">
                  {member.name}
                </h3>

                <p className="font-bebas text-sm text-neutral-300 tracking-wider mt-1">
                  KNOWN AS: &ldquo;{member.nickname}&rdquo; • {member.role}
                </p>

                {/* Senior Quote Speech Bubble */}
                <div className="my-4 p-4 rounded-2xl bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] relative speech-bubble-bottom">
                  <div className="text-[10px] font-comic uppercase text-comic-red tracking-wider mb-1">
                    YEARBOOK QUOTE / MOTTO:
                  </div>
                  <p className="font-dialogue font-bold text-sm sm:text-base leading-snug">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </div>

                {/* Special Move Container */}
                <div className="mb-4 p-3 rounded-xl bg-ink-950 border-2 border-comic-yellow">
                  <div className="flex items-center gap-1.5 text-xs font-comic text-comic-yellow mb-1">
                    <Zap className="w-4 h-4 fill-comic-yellow" />
                    <span>JURUS ANDALAN / SIGNATURE MOVE:</span>
                  </div>
                  <p className="font-comic text-base text-white tracking-wide">
                    {member.specialMove}
                  </p>
                </div>

                {/* Fun Fact / Trivia */}
                {member.funFact && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-comic text-comic-red mb-1">
                      <Smile className="w-3.5 h-3.5" />
                      <span>SECRET ORIGIN & FUN FACT:</span>
                    </div>
                    <p className="font-dialogue text-xs text-neutral-300 leading-relaxed pl-4 border-l-2 border-comic-red">
                      {member.funFact}
                    </p>
                  </div>
                )}

                {/* Dream Job */}
                {member.dreamJob && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-comic text-comic-yellow mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>FUTURE DESTINY / AMBITION:</span>
                    </div>
                    <p className="font-dialogue text-xs text-neutral-300 pl-4 border-l-2 border-comic-yellow">
                      {member.dreamJob}
                    </p>
                  </div>
                )}
              </div>

              {/* Social Links Footer */}
              <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-2">
                <span className="font-comic text-xs text-neutral-400 uppercase">
                  SOCIAL LINKS:
                </span>

                <div className="flex items-center gap-2">
                  {member.socialLinks?.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-black border-2 border-black text-xs font-comic text-white hover:bg-comic-yellow hover:text-black transition-colors flex items-center gap-1"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>INSTAGRAM</span>
                    </a>
                  )}

                  {member.socialLinks?.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-black border-2 border-black text-xs font-comic text-white hover:bg-comic-yellow hover:text-black transition-colors flex items-center gap-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GITHUB</span>
                    </a>
                  )}

                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-black border-2 border-black text-xs font-comic text-white hover:bg-comic-yellow hover:text-black transition-colors flex items-center gap-1"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LINKEDIN</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
