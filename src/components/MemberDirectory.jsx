/**
 * @file MemberDirectory.jsx
 * @description Comic Book Hero Directory for Class 10A INVICTUS.
 * Features real-time client-side search across names, nicknames, roles, quotes,
 * comic guild category filters, sort options, and modal state management.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Users, Zap, XCircle, ArrowUpDown } from 'lucide-react';
import MemberCard from './MemberCard';
import MemberModal from './MemberModal';
import { members, DIRECTORY_CATEGORIES } from '../data/invictusData';

export default function MemberDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Heroes');
  const [sortBy, setSortBy] = useState('default');
  const [activeModalMember, setActiveModalMember] = useState(null);

  // Memoized client-side filtering pipeline
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Category Filter
    if (selectedCategory !== 'All Heroes') {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((m) => {
        const matchName = m.name?.toLowerCase().includes(q);
        const matchNick = m.nickname?.toLowerCase().includes(q);
        const matchRole = m.role?.toLowerCase().includes(q);
        const matchQuote = m.quote?.toLowerCase().includes(q);
        const matchAlias = m.alias?.toLowerCase().includes(q);
        const matchMove = m.specialMove?.toLowerCase().includes(q);
        return matchName || matchNick || matchRole || matchQuote || matchAlias || matchMove;
      });
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'aura') {
      result.sort((a, b) => (b.stats?.aura || 0) - (a.stats?.aura || 0));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All Heroes');
    setSortBy('default');
  };

  return (
    <section id="directory" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-ink-950 bg-halftone-yellow">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-comic-red text-white border-2 border-black shadow-comic font-comic text-sm uppercase rotate-1 mb-4">
            <Zap className="w-4 h-4 fill-white" />
            <span>CHAPTER 02 • THE COMPLETE 10A HERO ROSTER</span>
          </div>

          <h2 className="font-comic text-4xl sm:text-6xl text-white comic-stroke uppercase tracking-wide">
            DAFTAR HEROES <span className="text-comic-yellow">KELAS 10A</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-dialogue font-bold">
            Seluruh 15 siswa resmi Class 10A INVICTUS dalam format kartu pahlawan komik legendaris. Klik kartu untuk membuka profil lengkap!
          </p>
        </div>

        {/* Search, Filter & Controls */}
        <div className="mb-10 space-y-6 bg-ink-900/90 p-5 sm:p-6 rounded-3xl border-3 border-black shadow-comic backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-comic-yellow" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, jurus, nickname, atau kata mutiara..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-black border-2 border-black text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-comic-yellow font-sans shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  aria-label="Hapus pencarian"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Telemetry & Sort Dropdown */}
            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
              <div className="flex items-center gap-1.5 font-comic text-sm text-black bg-comic-yellow px-3 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
                <span>SHOWING:</span>
                <span className="text-comic-red font-extrabold text-base">{filteredMembers.length}</span>
                <span>/</span>
                <span>{members.length} HEROES</span>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-3 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-8 pr-4 py-2.5 rounded-xl bg-black border-2 border-black text-xs font-comic text-comic-yellow focus:outline-none focus:border-comic-yellow appearance-none cursor-pointer uppercase shadow-comic-sm"
                  aria-label="Urutkan Anggota"
                >
                  <option value="default">SORT: DEFAULT ROSTER</option>
                  <option value="name-asc">NAME: A TO Z</option>
                  <option value="name-desc">NAME: Z TO A</option>
                  <option value="aura">MAX AURA POWER</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-black">
            <span className="font-comic text-xs text-neutral-300 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-comic-yellow" />
              <span>SQUAD GUILD:</span>
            </span>

            {DIRECTORY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'All Heroes'
                  ? members.length
                  : members.filter((m) => m.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg font-comic text-xs tracking-wider transition-all border-2 border-black ${
                    isSelected
                      ? 'bg-comic-yellow text-black shadow-comic -rotate-1 scale-105'
                      : 'bg-black text-neutral-300 hover:text-comic-yellow hover:border-comic-yellow'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-black text-comic-yellow' : 'bg-neutral-800 text-neutral-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Member Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                index={idx}
                onSelect={(selected) => setActiveModalMember(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-ink-900 border-3 border-black max-w-md mx-auto shadow-comic">
            <div className="w-12 h-12 rounded-full bg-comic-red border-2 border-black flex items-center justify-center mx-auto mb-3 text-white font-comic text-xl">
              ?
            </div>
            <h3 className="font-comic text-2xl text-white">HERO TIDAK DITEMUKAN!</h3>
            <p className="mt-1 text-xs text-neutral-400 font-dialogue">
              Tidak ada pahlawan dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-comic-yellow text-black font-comic text-xs rounded-lg border-2 border-black shadow-comic"
            >
              RESET FILTER
            </button>
          </div>
        )}
      </div>

      {/* Expanded Modal */}
      <MemberModal
        member={activeModalMember}
        onClose={() => setActiveModalMember(null)}
      />
    </section>
  );
}
