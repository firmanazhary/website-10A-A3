/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#0A0A0C",
        ink: {
          950: "#08080A",
          900: "#101014",
          800: "#18181E",
          700: "#22222B",
          600: "#32323E",
        },
        comic: {
          yellow: "#FFE600",
          gold: "#FACC15",
          red: "#FF334B",
          blue: "#00E5FF",
          purple: "#A855F7",
          green: "#22C55E",
          paper: "#FAFAF5",
        },
      },
      fontFamily: {
        comic: ['Bangers', 'cursive', 'impact'],
        marker: ['"Permanent Marker"', 'cursive'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        dialogue: ['"Comic Neue"', 'cursive', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px #000000',
        'comic-sm': '2.5px 2.5px 0px 0px #000000',
        'comic-lg': '7px 7px 0px 0px #000000',
        'comic-yellow': '5px 5px 0px 0px #FFE600',
        'comic-red': '5px 5px 0px 0px #FF334B',
        'comic-cyan': '5px 5px 0px 0px #00E5FF',
        'comic-white': '4px 4px 0px 0px #FFFFFF',
        'comic-glow': '0 0 25px rgba(255, 230, 0, 0.4)',
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, rgba(255, 230, 0, 0.12) 1.5px, transparent 1.5px)',
        'halftone-dark': 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
        'halftone-ink': 'radial-gradient(circle, rgba(0, 0, 0, 0.25) 1.5px, transparent 1.5px)',
        'action-lines': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 230, 0, 0.03) 10px, rgba(255, 230, 0, 0.03) 20px)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
