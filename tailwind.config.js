/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'canvas-bg': '#F8F9FB',
        'node-bg': 'rgba(255, 255, 255, 0.8)',
        'node-header': 'rgba(0, 0, 0, 0.02)',
        'sidebar-bg': 'rgba(255, 255, 255, 0.7)',
        'input-bg': 'rgba(0, 0, 0, 0.03)',
        'node-border': 'rgba(0, 0, 0, 0.08)',
        'active-border': '#4FD1C5',
        'input-border': 'rgba(0, 0, 0, 0.08)',
        'text-primary': '#1a1a2e',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
        accent: {
          DEFAULT: '#4FD1C5',
          hover: '#38b2ac',
          subtle: 'rgba(79, 209, 197, 0.1)',
        },
        'status-running': '#e8a848',
        'status-done': '#4ead6a',
        'status-error': '#d45454',
        'wire-text': '#4FD1C5',
        'wire-image': '#E879A8',
        'wire-settings': '#F6B93B',
        'wire-default': '#4FD1C5',
        'wire-data': '#F6B93B',
      },
      fontFamily: {
        ui: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
