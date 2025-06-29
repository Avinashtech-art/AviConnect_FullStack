/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Discord-style colors
        discord: {
          dark: '#2c2f33',
          darker: '#23272a',
          light: '#36393f',
          lighter: '#40444b',
          blurple: '#7289da',
          green: '#43b581',
          yellow: '#faa61a',
          red: '#f04747',
          text: '#dcddde',
          muted: '#b9bbbe',
          'muted-dark': '#72767d',
        },
        // Dynamic theme colors
        primary: 'var(--color-primary, #7289da)',
        secondary: 'var(--color-secondary, #99aab5)',
        background: 'var(--color-background, #2c2f33)',
        surface: 'var(--color-surface, #36393f)',
        text: 'var(--color-text, #ffffff)',
        accent: 'var(--color-accent, #7289da)',
        success: 'var(--color-success, #43b581)',
        warning: 'var(--color-warning, #faa61a)',
        error: 'var(--color-error, #f04747)',
        border: 'var(--color-border, #40444b)',
        muted: 'var(--color-muted, #b9bbbe)',
        chat: {
          bg: 'var(--color-background, #36393f)',
          sidebar: 'var(--color-surface, #2f3136)',
          header: 'var(--color-surface, #36393f)',
          sent: '#7289da',
          received: 'var(--color-surface, #40444b)',
          input: 'var(--color-surface, #40444b)',
        }
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary, linear-gradient(135deg, #7289da 0%, #5b6eae 100%))',
        'gradient-secondary': 'var(--gradient-secondary, linear-gradient(135deg, #99aab5 0%, #7a8b99 100%))',
        'gradient-accent': 'var(--gradient-accent, linear-gradient(135deg, #7289da 0%, #677bc4 100%))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.3))',
        'md': 'var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3))',
        'lg': 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3))',
        'xl': 'var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3))',
        'glow': '0 0 20px rgba(114, 137, 218, 0.3)',
        'glow-lg': '0 0 40px rgba(114, 137, 218, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(114, 137, 218, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(114, 137, 218, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};