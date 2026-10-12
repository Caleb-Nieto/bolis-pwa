import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {VitePWA} from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite"
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
      svgr(),
      VitePWA({
          registerType: 'prompt',
          devOptions:{
              enabled: true
          },
          workbox: {
              // Ensure all generated chunks are precached for offline support
              globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
          },
          manifest: {
            name: 'Bolis App Manager',
              short_name: 'Bolis',
              description: 'Bolis App Manager',
              theme_color: '#ffffff',
              icons: [
                  {
                      "src": "pwa-64x64.png",
                      "sizes": "64x64",
                      "type": "image/png"
                  },
                  {
                      "src": "pwa-192x192.png",
                      "sizes": "192x192",
                      "type": "image/png"
                  },
                  {
                      "src": "pwa-512x512.png",
                      "sizes": "512x512",
                      "type": "image/png"
                  },
                  {
                      "src": "maskable-icon-512x512.png",
                      "sizes": "512x512",
                      "type": "image/png",
                      "purpose": "maskable"
                  }
              ]
          }
      }),
  ],
    server: {
      allowedHosts: true
    },
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@redux') || id.includes('react-redux')) {
                            return 'vendor-redux';
                        }
                        if (id.includes('framer-motion') || id.includes('vaul') || id.includes('lucide-react') || id.includes('react-hot-toast')) {
                            return 'vendor-ui';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    },
    resolve : {
      alias: {
          '@components': path.resolve(import.meta.dirname, './src/components'),
          '@assets': path.resolve(import.meta.dirname, './src/assets'),
      }
    }
})
