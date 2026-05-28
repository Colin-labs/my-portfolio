import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  // /my-portfolio/ = GitHub Pages 子路径
  // 本地双击预览用 build:local 脚本（base=./）
  base: '/my-portfolio/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
