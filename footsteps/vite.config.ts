import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import gameRepository from './src/assets/game-repository.json'

// https://vite.dev/config/
export default defineConfig({
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
})
