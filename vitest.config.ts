import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{spec,test}.ts',
      '__tests__/**/*.{spec,test}.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'cobertura'],
    },
    passWithNoTests: true,
  },
})
