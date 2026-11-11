export default {
  content: ['./src/app/**/*.{js,jsx}', './src/components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: { 950: '#0d1033', 900: '#1b1f6b', 800: '#262b8f' }, brand: '#1e3a8a', mist: '#f3f5fb' },
      fontFamily: { sans: ['var(--font-vazir)', 'Tahoma', 'sans-serif'] }
    }
  },
  plugins: []
};
