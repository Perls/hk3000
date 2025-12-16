import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // We check for GOOGLE_GENERATIVE_AI_API_KEY (from your Vercel screenshot)
      // and map it to process.env.API_KEY so the app can use it.
      'process.env.API_KEY': JSON.stringify(env.GOOGLE_GENERATIVE_AI_API_KEY || env.API_KEY || '')
    }
  }
})
