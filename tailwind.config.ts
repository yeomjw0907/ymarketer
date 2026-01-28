import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black & White System (KREAM Style)
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Primary Colors
        black: {
          DEFAULT: '#000000',
          soft: '#1A1A1A',
          charcoal: '#2D2D2D',
        },
        white: {
          DEFAULT: '#FFFFFF',
          off: '#FAFAFA',
          light: '#F5F5F5',
        },
        
        // Gray Scale
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        
        // Accent Color (Red only for discounts)
        red: {
          DEFAULT: '#FF0000',
          deep: '#E60023',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'lg': '8px',
      },
      boxShadow: {
        'hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
