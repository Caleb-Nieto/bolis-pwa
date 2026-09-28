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
          registerType: 'autoUpdate',
          devOptions:{
              enabled: true
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
    resolve : {
      alias: {
          '@components': path.resolve(import.meta.dirname, './src/components'),
          '@assets': path.resolve(import.meta.dirname, './src/assets'),
      }
    }
})
