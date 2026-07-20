import { defineConfig } from 'vite'
import { resolve } from 'path'

// Multi-page static site. Each HTML file at the project root is an entry point.
// `npm run build` emits plain static files to dist/ — upload dist/ into cPanel's
// public_html. Everything in public/ (assets, contact.php) is copied verbatim.
export default defineConfig({
  // Site is served from the domain root on cPanel (public_html), so assets are
  // referenced with absolute "/assets/..." paths. If you ever deploy into a
  // subfolder instead, switch this to './' and use relative asset paths.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        consultancy: resolve(__dirname, 'consultancy.html'),
        casa: resolve(__dirname, 'casa.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
