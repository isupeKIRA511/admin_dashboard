/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#ffffff', // User's white
        foreground: '#1D1B1C', // Match User's secondary dark
        surface: '#ffffff',
        primary: '#FAC445', // User's yellow
        secondary: '#1D1B1C', // User's dark
        danger: '#ef4444',
        success: '#22c55e',
        muted: '#f5f5f5', // slate-100
        'muted-foreground': '#737373', // slate-500
        border: '#e5e5e5', // slate-200
        input: '#e5e5e5', // slate-200
        ring: '#1D1B1C', // dark
        // Override standard colors to apply theme globally
        slate: {
          50: '#fcfcfc',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#1D1B1C', // Important: User's secondary dark color becomes slate-800 to match typical text styles
          900: '#111011',
          950: '#000000',
        },
        indigo: {
          50: '#fffbf0',
          100: '#fff4d6',
          200: '#fce3a4',
          300: '#fcd06a',
          400: '#fbc54b',
          500: '#FAC445', // Replace standard indigo 500 with user's yellow
          600: '#e0af38',
          700: '#b88d25',
          800: '#946f15',
          900: '#75560b',
        }
      }
    },
  },
  plugins: [],
}
