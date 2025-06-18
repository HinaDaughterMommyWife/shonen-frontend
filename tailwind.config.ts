import type { Config } from 'tailwindcss';
import { effectClassArray } from './common/emotesEffects';

const touchPlugin = ({ addVariant }: { addVariant: (name: string, selector: string) => void }) => {
  addVariant('coarse', '@media (pointer: coarse)');
};

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xss: '320px',
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      spacing: {
        small: '8px',
        medium: '16px',
        large: '24px',
        xlarge: '32px',
        '2xlarge': '40px',
        '3xlarge': '48px',
        '4xlarge': '64px',
        '5xlarge': '80px',
        '6xlarge': '96px',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        button: 'hsl(var(--button))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'spin-wave': {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-wave': 'spin-wave 4s linear infinite',
        'spin-orbit': 'spin-orbit 10s linear infinite',
      },
    },
  },
  safelist: effectClassArray,
  plugins: [require('tailwindcss-animate'), touchPlugin],
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
