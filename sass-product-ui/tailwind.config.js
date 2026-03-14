module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/** /*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Geist', 'sans-serif'],
        body:    ['Geist', 'sans-serif'],
        mono:    ['Geist Mono', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#2563EB',
          light:   '#60A5FA',
          lighter: '#DBEAFE',
          dark:    '#1D4ED8',
        },
        zinc: {
          50:'#FAFAFA', 100:'#F4F4F5', 200:'#E4E4E7',
          300:'#D4D4D8', 400:'#A1A1AA', 500:'#71717A',
          600:'#52525B', 700:'#3F3F46', 800:'#27272A',
          900:'#18181B', 950:'#0D0D0F',
        },
      },
      borderRadius: {
        sm:'4px', md:'6px', lg:'8px', xl:'12px', '2xl':'16px',
      },
      boxShadow: {
        accent:      '0 4px 14px rgba(37,99,235,0.25)',
        'accent-dark':'0 4px 14px rgba(147,197,253,0.15)',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight:   '-0.02em',
        wide:    '0.04em',
      },
    },
  },
  plugins: [],
};