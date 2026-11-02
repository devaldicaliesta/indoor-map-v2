import { createRequire } from 'node:module';
import { thirdPartyNotices, UI_FONT_NOTICES } from '@indoor/third-party-notices';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Warna manifest sama dengan token --canvas dan --ink (manifest tidak bisa membaca CSS).
const CANVAS = '#f2f3ef';
const INK = '#111418';

export default defineConfig({
  envDir: '../..',
  // MapLibre 6 memuat web worker dari file terpisah; pre-bundle Vite merusak URL-nya.
  optimizeDeps: { exclude: ['maplibre-gl'] },
  plugins: [
    react(),
    tailwindcss(),
    thirdPartyNotices({
      product: 'PanduArah Visitor',
      include: ['tailwindcss'],
      extra: [
        ...UI_FONT_NOTICES,
        // Runtime service worker (workbox-core, -precaching, -routing, -strategies, -expiration)
        // dibangun terpisah oleh vite-plugin-pwa; lisensinya sama dengan workbox-window.
        {
          name: 'Workbox (service worker)',
          license: 'MIT',
          file: createRequire(import.meta.url).resolve('workbox-window/LICENSE'),
        },
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon.svg'],
      manifest: {
        name: 'PanduArah',
        short_name: 'PanduArah',
        // Tagline Inggris untuk pasar luar negeri (docs/20-F2-fase-2.md §2.3).
        description: 'PanduArah — Indoor Navigation',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: CANVAS,
        theme_color: INK,
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Aset app (termasuk font) di-precache: cache-first.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        // Chunk tur (driver.js) baru diunduh saat tur dimulai, lalu di-cache lewat runtimeCaching.
        globIgnores: ['**/run-tour-*.js'],
        // Bundel utama (MapLibre + app) ±2,1 MB melewati batas bawaan workbox 2 MiB; tanpa
        // precache Visitor tidak terbuka saat offline, jadi batasnya dinaikkan.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/run-tour-[^/]+\.js$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'tour', expiration: { maxEntries: 4 } },
          },
        ],
      },
    }),
  ],
  server: { port: 5174, strictPort: true },
  preview: { port: 5174, strictPort: true },
});
