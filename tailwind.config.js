
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: '#182421',
        forest: '#24443B',
        sage: '#789083',
        mist: '#E8EEE8',
        cream: '#F6F5EF',
        paper: '#8A9A5B',
        gold: '#C69A55',
        muted: '#68736D'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 55px rgba(24, 36, 33, .08)',
        card: '0 8px 30px rgba(24, 36, 33, .06)'
      },
      letterSpacing: {
        widest: '.22em'
      }
    }
  },
  plugins: []
};
