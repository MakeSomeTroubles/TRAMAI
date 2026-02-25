/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'canvas-bg': '#0f0f14',
        'node-bg': '#1a1a24',
        'node-header': '#22222e',
        'sidebar-bg': '#13131a',
        'input-bg': '#12121a',
        'node-border': '#2a2a3a',
        'active-border': '#4a9ead',
        'input-border': '#333346',
        'text-primary': '#e8e8ef',
        'text-secondary': '#8888a0',
        'text-muted': '#555568',
        accent: {
          DEFAULT: '#4a9ead',
          hover: '#5cb8c8',
          subtle: 'rgba(74, 158, 173, 0.12)',
        },
        'status-running': '#e8a848',
        'status-done': '#4ead6a',
        'status-error': '#d45454',
        'wire-default': '#4a9ead',
        'wire-data': '#8888a0',
      },
      fontFamily: {
        ui: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
