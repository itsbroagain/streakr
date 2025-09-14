export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        // Enhanced color system with more variations and semantic names
        colors: {
          // Primary brand colors
          'cosmic-deep': '#0F0F23',
          'elevated-surface': '#1A1A2E',
          'brand-purple': '#6C5CE7',
          'brand-purple-light': '#A855F7',
          'success-green': '#00D4AA',
          
          // Extended palette for more premium options
          purple: {
            50: '#F3F0FF',
            100: '#E9E2FF',
            200: '#D4CCFF',
            300: '#B8A8FF',
            400: '#9B82FF',
            500: '#6C5CE7',  // brand-purple
            600: '#5B4BD1',
            700: '#4A3ABA',
            800: '#3B2E94',
            900: '#2F2477',
          },
          
          green: {
            50: '#E6FFF9',
            100: '#CCFFF2',
            200: '#99FFE5',
            300: '#66FFD8',
            400: '#33FFCB',
            500: '#00D4AA',  // success-green
            600: '#00AA88',
            700: '#008066',
            800: '#005544',
            900: '#002B22',
          },
          
          // Surface colors for layering
          surface: {
            primary: '#0F0F23',    // cosmic-deep
            secondary: '#1A1A2E',  // elevated-surface
            tertiary: '#2D2D44',
            elevated: '#3A3A5C',
          },
          
          // Text colors with opacity variations
          text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.8)',
            tertiary: 'rgba(255, 255, 255, 0.6)',
            muted: 'rgba(255, 255, 255, 0.4)',
            inverse: '#0F0F23',
          },
          
          // Border colors
          border: {
            primary: 'rgba(255, 255, 255, 0.1)',
            secondary: 'rgba(255, 255, 255, 0.05)',
            accent: '#6C5CE7',
          },
          
          // Status colors
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
  
        // Enhanced typography with better scaling
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '3rem' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
  
        // Font families with fallbacks
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
        },
  
        // Enhanced spacing scale
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
          '144': '36rem',
        },
  
        // Enhanced border radius
        borderRadius: {
          'none': '0',
          'sm': '0.125rem',
          DEFAULT: '0.25rem',
          'md': '0.375rem',
          'lg': '0.5rem',
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          '4xl': '2rem',
          'full': '9999px',
        },
  
        // Enhanced animations with premium timing
        animation: {
          // Existing animations (improved)
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'float': 'float 3s ease-in-out infinite',
          'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
          
          // New premium animations
          'fade-in': 'fadeIn 0.6s ease-out',
          'fade-in-up': 'fadeInUp 0.6s ease-out',
          'fade-in-down': 'fadeInDown 0.6s ease-out',
          'slide-in-right': 'slideInRight 0.5s ease-out',
          'slide-in-left': 'slideInLeft 0.5s ease-out',
          'scale-in': 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          'spin-slow': 'spin 3s linear infinite',
          'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
          'shimmer': 'shimmer 2s linear infinite',
          'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        },
  
        // Enhanced keyframes
        keyframes: {
          // Existing keyframes (kept)
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          'gradient-shift': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          },
          
          // New premium keyframes
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInDown: {
            '0%': { opacity: '0', transform: 'translateY(-30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideInRight: {
            '0%': { opacity: '0', transform: 'translateX(30px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          slideInLeft: {
            '0%': { opacity: '0', transform: 'translateX(-30px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          scaleIn: {
            '0%': { opacity: '0', transform: 'scale(0.8)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
          bounceIn: {
            '0%': { opacity: '0', transform: 'scale(0.3)' },
            '50%': { opacity: '1', transform: 'scale(1.05)' },
            '70%': { transform: 'scale(0.9)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
          pulseGlow: {
            '0%, 100%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)' },
            '50%': { boxShadow: '0 0 40px rgba(108, 92, 231, 0.6)' },
          },
          shimmer: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
          typing: {
            '0%': { width: '0' },
            '100%': { width: '100%' },
          },
          'blink-caret': {
            '0%, 50%': { borderColor: 'transparent' },
            '100%': { borderColor: 'white' },
          },
        },
  
        // Enhanced shadows with more options
        boxShadow: {
          'xs': '0 0 0 1px rgba(0, 0, 0, 0.05)',
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          'none': 'none',
          
          // Brand-specific shadows
          'brand-glow': '0 0 20px rgba(108, 92, 231, 0.3)',
          'brand-glow-lg': '0 0 40px rgba(108, 92, 231, 0.4)',
          'success-glow': '0 0 20px rgba(0, 212, 170, 0.3)',
          'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
          'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
  
        // Backdrop blur options
        backdropBlur: {
          'xs': '2px',
          'sm': '4px',
          'DEFAULT': '8px',
          'md': '12px',
          'lg': '16px',
          'xl': '24px',
          '2xl': '40px',
          '3xl': '64px',
        },
  
        // Enhanced z-index scale
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
  
        // Transition timing functions
        transitionTimingFunction: {
          'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
  
        // Enhanced transition durations
        transitionDuration: {
          '75': '75ms',
          '100': '100ms',
          '200': '200ms',
          '250': '250ms',
          '400': '400ms',
          '600': '600ms',
          '800': '800ms',
          '1200': '1200ms',
        },
  
        // Gradient color stops for complex gradients
        gradientColorStops: {
          'brand-start': '#6C5CE7',
          'brand-middle': '#A855F7',
          'brand-end': '#00D4AA',
        },
  
        // Container max widths
        maxWidth: {
          '8xl': '90rem',
          '9xl': '100rem',
          '10xl': '110rem',
        },
  
        // Enhanced screens for responsive design
        screens: {
          'xs': '475px',
          '3xl': '1600px',
        },
      },
    },
    plugins: [],
  }