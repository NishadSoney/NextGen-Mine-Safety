/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tactical: {
          dark: '#0a0d14',
          panel: '#101726',
          card: '#162036',
          border: '#1f2e4d',
          accent: '#00f0ff',
          neonGreen: '#00ff88',
          neonAmber: '#ffb703',
          neonRed: '#ff3366',
          grid: '#182642',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
        display: ['"Chakra Petch"', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'radar-sweep': 'sweep 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'danger-flash': 'dangerFlash 1s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        dangerFlash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
