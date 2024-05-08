import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
} satisfies Config
