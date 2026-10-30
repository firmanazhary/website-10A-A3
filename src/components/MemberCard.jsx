/**
 * @file MemberCard.jsx
 * @description Comic Book Hero Trading Card for Class 10A students.
 * Features manga-style action sound stickers, speech bubble yearbook quotes,
 * power meters, special moves, and comic panel borders.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Instagram, Github, Linkedin, Flame } from 'lucide-react';

export default function MemberCard({ member, index, onSelect }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // High-contrast SVG avatar fallback
  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    member.nickname || member.name
  )}&backgroundColor=FFE600`;

  const handleSocialClick = (e) => {
    e.stopPropagation();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
      onClick={() => onSelect(member)}
      className="group relative flex flex-col justify-between rounded-2xl bg-ink-900 border-3 border-black p-4 transition-all duration-200 shadow-comic hover:shadow-comic-yellow hover:border-comic-yellow cursor-pointer select-none overflow-hidden"
    >
      {/* Background Comic Halftone */}
      <div className="absolute inset-0 bg-halftone-dark opacity-40 pointer-events-none" />

      {/* TOP SECTION: Photo & Badges */}
      <div className="relative z-10">
        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black border-2 border-black group-hover:border-comic-yellow transition-colors">
          {/* Hero ID & Guild Badges */}
          <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
            <span className="font-comic text-[11px] text-black bg-comic-yellow px-2 py-0.5 rounded border border-black shadow-[2px_2px_0px_#000]">
              {member.id}
            </span>
            <span className="font-bebas text-[10px] text-white bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-700 tracking-wider">
              {member.category}
            </span>
          </div>

          {/* Action Sound Sticker (Appears on Hover) */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <span className="font-comic text-xs text-white bg-comic-red px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_#000] rotate-6 group-hover:scale-110 group-hover:rotate-12 transition-transform inline-block">
              {member.comicSound || "BAM!"}
            </span>
          </div>

          {/* Character Photo */}
          <img
            src={imageError ? fallbackAvatar : member.photoUrl}
            alt={member.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Bottom Photo Ribbon: Alias */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 pt-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-comic-yellow font-bold tracking-wider block">
                {member.alias}
              </span>
              <span className="text-xs font-comic text-white tracking-wide">
                &ldquo;{member.nickname}&rdquo;
              </span>
            </div>

            {member.stats && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-comic-yellow font-bold bg-black/90 px-1.5 py-0.5 rounded border border-neutral-700">
                <Flame className="w-3 h-3 text-comic-red fill-comic-red" />
                <span>{member.stats.aura}</span>
              </div>
            )}
          </div>
        </div>

        {/* Name & Role Header */}
        <div className="mt-3">
          <h3 className="font-comic text-xl text-white group-hover:text-comic-yellow transition-colors leading-tight line-clamp-1">
            {member.name}
          </h3>

          <p className="font-bebas text-xs text-neutral-300 tracking-wider mt-0.5 line-clamp-1">
            {member.role}
          </p>

          {/* Comic Speech Bubble Quote */}
          <div className="mt-2.5 p-3 rounded-xl bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] relative speech-bubble-bottom">
            <p className="font-dialogue font-bold text-xs leading-snug line-clamp-2">
              &ldquo;{member.quote}&rdquo;
            </p>
          </div>

          {/* Special Move Pill */}
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-neutral-300 bg-black/70 px-2 py-1 rounded border border-neutral-800">
            <Zap className="w-3 h-3 text-comic-yellow flex-shrink-0" />
            <span className="truncate text-comic-yellow font-bold">{member.specialMove}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION & SOCIALS */}
      <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between relative z-10">
        <span className="font-comic text-[11px] text-comic-red bg-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
          HERO CARD
        </span>

        {/* Social Links */}
        <div className="flex items-center gap-1" onClick={handleSocialClick}>
          {member.socialLinks?.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-black hover:bg-comic-yellow hover:text-black text-neutral-300 border border-neutral-700 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          )}
          {member.socialLinks?.github && (
            <a
              href={member.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-black hover:bg-comic-yellow hover:text-black text-neutral-300 border border-neutral-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {member.socialLinks?.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-black hover:bg-comic-yellow hover:text-black text-neutral-300 border border-neutral-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
