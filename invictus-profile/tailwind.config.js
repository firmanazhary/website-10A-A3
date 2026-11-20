/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Anton"', '"Archivo Black"', "sans-serif"],
        body: ['"Poppins"', "sans-serif"],
      },
      colors: {
        space: {
          950: "#030408",
          900: "#070913",
          800: "#0D1124",
          700: "#151B38",
        },
        nebula: {
          cyan: "#00F0FF",
          purple: "#7000FF",
          indigo: "#3B82F6",
          amber: "#F59E0B",
          crimson: "#EF4444",
        },
      },
      backgroundImage: {
        "nebula-gradient":
          "radial-gradient(circle at 20% 20%, rgba(112, 0, 255, 0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(0, 240, 255, 0.14), transparent 45%)",
        "card-glass":
          "linear-gradient(145deg, rgba(21, 27, 56, 0.65) 0%, rgba(7, 9, 19, 0.85) 100%)",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
