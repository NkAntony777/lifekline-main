/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Traditional Chinese Paper Colors (Xuan Paper / 宣纸)
        paper: {
          50: '#FEFDFB',   // Brightest paper
          100: '#F8F6F0',  // Standard Xuan Paper
          200: '#F0EBE0',  // Slightly aged
          300: '#E5DED0',  // Aged paper
          400: '#D4C9B5',  // Darker aged
          500: '#C4B89A',  // Tea-stained
          600: '#A89A7A',  // Deep aged
          700: '#8A7C5E',  // Very aged
          800: '#6B5F48',  // Dark wood tone
          900: '#4A4235',  // Darkest
        },
        // Ink Colors (墨水)
        ink: {
          50: '#F5F6F8',   // Lightest wash
          100: '#E8EAEE',  // Very light ink
          200: '#C9CDD5',  // Light ink wash
          300: '#A8AEB9',  // Medium light
          400: '#6B7280',  // Standard medium ink
          500: '#4B5563',  // Medium dark ink
          600: '#374151',  // Dark ink
          700: '#1F2937',  // Very dark
          800: '#111827',  // Almost pure black
          900: '#030712',  // Pure ink black
          DEFAULT: '#1F2937', // Default ink color
        },
        // Seal Red Colors (印章红)
        seal: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC2626',  // Standard seal red
          600: '#B91C1C',  // Deep seal
          700: '#991B1B',  // Dark seal
          800: '#7F1D1D',  // Very dark
          900: '#450A0A',  // Darkest
          DEFAULT: '#B91C1C', // Main seal red (darker, more traditional)
          light: '#DC2626',
          dark: '#7F1D1D',
        },
        // Wood / Brown tones (木色)
        wood: {
          50: '#FDFAF5',
          100: '#F5EBE0',
          200: '#E7D5C0',
          300: '#D4BA9A',
          400: '#BC9A70',
          500: '#A67C52',  // Standard wood
          600: '#8B5A2B',  // Saddle brown
          700: '#6F4628',  // Dark wood
          800: '#5C3825',  // Very dark wood
          900: '#422A1E',  // Darkest
          DEFAULT: '#8B5A2B',
          light: '#A67C52',
          dark: '#5C3825',
        },
      },
      fontFamily: {
        'serif-sc': ['"Noto Serif SC"', '"Songti SC"', '"SimSun"', '"STSong"', 'serif'],
        'sans-sc': ['"Inter"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
