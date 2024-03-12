import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mini-blackjack/',
  define: {
    __BUILD_DATE__: Date.now(),
  },
})
