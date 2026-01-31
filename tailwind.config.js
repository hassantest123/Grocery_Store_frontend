/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Modern professional green palette
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main primary color - modern, professional
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
          light: '#dcfce7',
          dark: '#15803d',
        },
        // Accent colors for labels and highlights
        accent: {
          orange: '#ff6b35',
          'orange-light': '#fff5f2',
          yellow: '#fbbf24',
          'yellow-light': '#fef3c7',
          red: '#ef4444',
          'red-light': '#fee2e2',
        },
        // Secondary neutral colors
        secondary: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
          dark: '#475569',
        },
        // Semantic colors
        heading: '#0f172a',
        body: '#475569',
        // Keep legacy colors for backward compatibility
        default: '#e9edec',
        'default-medium': '#c1c7c6',
        'neutral-primary-soft': '#f0f3f2',
        'neutral-secondary-medium': '#ecf0ef',
        'neutral-tertiary-medium': '#e9edec',
      },
      // Professional shadow system
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)',
        'inner-sm': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      // Modern border radius scale
      borderRadius: {
        'base': '0.375rem',
        'card': '1rem',      // 16px for cards
        'button': '9999px',  // Full rounded for buttons
      },
      // Typography - Professional fonts
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Font sizes with line heights
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],      // 56px
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],     // 48px
        'heading-1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
        'heading-2': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }], // 30px
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],  // 24px
      },
      // Backdrop blur utilities
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      // Custom transitions
      transitionDuration: {
        '400': '400ms',
      },
      // Spacing for consistent layout
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Max width for container
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
      },
    },
  },
  plugins: [],
}
