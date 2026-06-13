import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces — pilotées par variables CSS (thème clair/sombre)
        bg: {
          DEFAULT: 'var(--mxs-bg)',
          deep: 'var(--mxs-bg)',
          surface: 'var(--mxs-bg-surface)',
          elevated: 'var(--mxs-bg-elevated)',
          overlay: 'var(--mxs-bg-overlay)',
        },
        // Borders
        border: {
          DEFAULT: 'var(--mxs-border)',
          subtle: 'var(--mxs-border-subtle)',
          strong: 'var(--mxs-border-strong)',
          accent: '#7c3aed',
        },
        // Text
        fg: {
          DEFAULT: 'var(--mxs-fg)',
          muted: 'var(--mxs-fg-muted)',
          subtle: 'var(--mxs-fg-subtle)',
          faint: 'var(--mxs-fg-faint)',
        },
        // Violet accent system
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          glow: '#c084fc',
          DEFAULT: '#a855f7',
        },
        // Semantic
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(168, 85, 247, 0.15)',
        'glow': '0 0 24px rgba(168, 85, 247, 0.2)',
        'glow-lg': '0 0 48px rgba(168, 85, 247, 0.3)',
        'glow-intense': '0 0 64px rgba(168, 85, 247, 0.45)',
        'inner-glow': 'inset 0 0 24px rgba(168, 85, 247, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-violet': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        'gradient-violet-subtle': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
