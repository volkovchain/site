/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',     // Blockchain Purple
        secondary: '#0099FF',   // Crypto Blue  
        accent: '#D73502',      // Rust Orange
        success: '#00C9A7',     // DeFi Green
        warning: '#FFA130',     // Warning Orange
        error: '#FF2D92',       // Security Red
        dark: '#1E2650',        // Dark Blue
        neutral: '#67737A',     // Silver
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px  
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px    
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem'    // 36px
      },
      // Enhanced responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Icon sizing constraints
      spacing: {
        'icon-xs': '0.75rem', // 12px
        'icon-sm': '1rem',    // 16px
        'icon-md': '1.25rem', // 20px
        'icon-lg': '1.5rem',  // 24px
        'icon-xl': '2rem',    // 32px
      }
    },
  },
  plugins: [],
}