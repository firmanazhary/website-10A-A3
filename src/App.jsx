/**
 * @file App.jsx
 * @description Main application shell for the INVICTUS High School Batch Yearbook (Class 10A).
 * Integrates luxury navigation, hero intro with animated statistics, leadership structure,
 * continuous quote marquee, and real-time member directory with expanded modal profiles.
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuoteMarquee from './components/QuoteMarquee';
import Structure from './components/Structure';
import MemberDirectory from './components/MemberDirectory';
import Footer from './components/Footer';

/**
 * Root Application Component.
 * Purely client-side standalone architecture with zero external database dependencies.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <div className="min-h-screen bg-pitch text-neutral-200 flex flex-col font-sans selection:bg-gold-500/25 selection:text-gold-200">
      {/* Top Glassmorphic Navigation Bar */}
      <Navbar />

      {/* Main Editorial Content Stream */}
      <main className="flex-grow">
        {/* Hero: High-impact typographical intro & animated batch statistics */}
        <Hero />

        {/* Quotes Ticker: Continuous infinite marquee for batch quotes */}
        <QuoteMarquee />

        {/* Organizational Structure: Hierarchical tree of batch leadership */}
        <Structure />

        {/* Member Directory: Collector cards, real-time search & category filters */}
        <MemberDirectory />
      </main>

      {/* Footer: Minimalist noir & gold signoff with smooth scroll-to-top */}
      <Footer />
    </div>
  );
}

