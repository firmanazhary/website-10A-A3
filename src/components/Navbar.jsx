/**
 * @file Navbar.jsx
 * @description Comic-styled top navigation bar featuring the uploaded custom INVICTUS logo,
 * comic sound effect badges, vintage "ISSUE #01" comic banner, and responsive comic menu.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Shield, Users, MessageSquareQuote, Sparkles } from 'lucide-react';
import { BATCH_METADATA } from '../data/invictusData';

/**
 * Comic Book Navbar Component.
 * @component
 * @returns {JSX.Element}
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const sections = ['hero', 'structure', 'directory', 'quotes'];
      const scrollPos = window.scrollY + 180;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const h = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + h) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COVER', href: '#hero', icon: Zap, id: 'hero' },
    { name: 'COUNCIL', href: '#structure', icon: Shield, id: 'structure' },
    { name: 'HEROES', href: '#directory', icon: Users, id: 'directory' },
    { name: 'SOUNDS', href: '#quotes', icon: MessageSquareQuote, id: 'quotes' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-ink-900/95 backdrop-blur-md border-b-4 border-black py-2.5 shadow-[0px_4px_0px_0px_#FFE600]'
          : 'bg-ink-950/80 backdrop-blur-sm py-4 border-b-2 border-black/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Comic Title */}
          <a
            href="#hero"
            onClick={(e) => handleSmoothScroll(e, '#hero')}
            className="flex items-center gap-3 group cursor-pointer select-none"
          >
            {/* Custom Logo Image Uploaded by User */}
            <div className="relative p-1 bg-black border-2 border-comic-yellow rounded-lg shadow-comic group-hover:rotate-[-3deg] transition-transform">
              <img
                src={BATCH_METADATA.logoUrl}
                alt="INVICTUS Logo"
                className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(255,230,0,0.5)]"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-comic text-2xl sm:text-3xl tracking-wider text-comic-yellow comic-stroke group-hover:text-white transition-colors">
                  {BATCH_METADATA.batchName}
                </span>
                <span className="bg-comic-red text-white text-[10px] font-comic px-1.5 py-0.5 rounded border border-black shadow-[2px_2px_0px_#000] rotate-3">
                  VOL. 10A
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase -mt-1">
                WALI KELAS: FIRMAN AZHARY
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2 bg-black/80 p-1.5 rounded-xl border-2 border-black shadow-comic">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-comic text-sm tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-comic-yellow text-black border-2 border-black shadow-[2px_2px_0px_#000] -rotate-1 scale-105'
                      : 'text-neutral-300 hover:text-comic-yellow hover:bg-neutral-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action: Comic Code Stamp & Action CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-white text-black font-comic text-xs border-2 border-black shadow-comic rounded -rotate-2">
              <Sparkles className="w-3.5 h-3.5 text-comic-red" />
              <span>10A COMICS CODE</span>
            </div>

            <a
              href="#directory"
              onClick={(e) => handleSmoothScroll(e, '#directory')}
              className="px-4 py-2 bg-comic-yellow hover:bg-yellow-400 text-black font-comic text-sm tracking-wider uppercase rounded-lg border-2 border-black shadow-comic hover:shadow-comic-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-1.5"
            >
              <span>MEET HEROES!</span>
              <span className="text-comic-red font-extrabold text-base">★</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-black border-2 border-comic-yellow text-comic-yellow hover:bg-comic-yellow hover:text-black transition-colors"
              aria-label="Toggle comic menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink-900 border-b-4 border-black px-6 py-6 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-comic text-lg uppercase tracking-wider border-2 ${
                      isActive
                        ? 'bg-comic-yellow text-black border-black shadow-comic rotate-1'
                        : 'bg-black text-neutral-200 border-neutral-800 hover:border-comic-yellow'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-comic-red" />
                      <span>{link.name}</span>
                    </div>
                    <span className="font-bebas text-sm text-neutral-400">CHAPTER</span>
                  </a>
                );
              })}

              <div className="mt-3 pt-3 border-t-2 border-dashed border-neutral-700 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>WALI KELAS: FIRMAN AZHARY</span>
                <span className="text-comic-yellow font-comic text-sm">CLASS OF 2027</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
