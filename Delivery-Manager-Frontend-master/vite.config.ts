// import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

const manifest = {
  name: 'Rappidex Express',
  short_name: 'Rappidex Express',
  theme_color: '#202024',
  background_color: "#202024",
  icons: [
      {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
      },
      {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
      },
      {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
      },
      {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
      }
  ],
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: manifest,
      // manifestFilename: 'manifest.webmanifest',
      // injectRegister: false,
      // srcDir: path.resolve(__dirname, './dist'),
      // filename: 'service-worker.js',
      // strategies: 'injectManifest',

      // workbox: {
      //   globDirectory: path.resolve(__dirname, 'public'),
      //   globPatterns: [
      //     '{build,images,sounds,icons}/**/*.{js,css,html,ico,png,jpg,mp4,svg}'
      //   ],
      // },
    }),
  ],
})