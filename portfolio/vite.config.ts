import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use the repository name for the base path on GitHub Pages
  // If GITHUB_REPOSITORY is 'user/repo', the base will be '/repo/'
  base: process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
