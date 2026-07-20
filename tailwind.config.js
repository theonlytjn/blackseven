/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      colors: {
        // Brand ink — the near-black violet background used site-wide
        ink: 'rgb(11, 5, 22)',
        // The purple that anchors the hero radial glow
        glow: '#C001FC',
        // Frosted panel base (use with an opacity modifier, e.g. bg-frost/10)
        frost: '#F8F8F3',
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        // The recurring 9.6px card/panel radius
        card: '9.6px',
      },
      maxWidth: {
        // Shared content container width
        content: '1296px',
      },
      screens: {
        // Keep the original 900px two-column collapse point
        cols: '900px',
      },
    },
  },
  plugins: [],
}
