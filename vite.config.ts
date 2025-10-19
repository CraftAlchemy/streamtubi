// Fix: Added a triple-slash directive to include Node.js types, resolving the TypeScript error "Property 'cwd' does not exist on type 'Process'".
/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: `__dirname` is not available in an ES module context like Vite's config.
      // `process.cwd()` provides the current working directory, which is the project root.
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
})