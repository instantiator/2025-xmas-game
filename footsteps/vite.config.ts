/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import gameRepository from './src/assets/game-repository.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = process.env.BASE_URL ?? '/'

  return {
    base,
    plugins: [react()],
    ssgOptions: {
      script: 'async',
      formatting: 'prettify',
      includedRoutes: async () => {
        const ids = Object.keys(gameRepository.games);
        const dynamicRoutes = ids.flatMap(id => [`/game/${id}`, `/game/${id}/json`]);
        return ['/', ...dynamicRoutes];
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
    },
  }
})
