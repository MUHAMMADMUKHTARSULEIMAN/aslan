import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from "fs"
import path from "path"

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// Avoid Node built-in imports in the Vite ESM config so TS doesn't require
// Node type declarations. Use Vite's root-relative alias instead.

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		https: {
			key: fs.readFileSync(path.resolve(__dirname, "../certs/localhost+1-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../certs/localhost+1.pem")),
		},
		port: 3000
	},
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      // Vite resolves "/src" relative to project root when used as an alias.
      '@': '/src',
    },
  },
} as any)
