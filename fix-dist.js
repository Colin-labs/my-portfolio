// 构建后自动修复：去掉 type="module" 和 crossorigin
// 这两个属性会导致 Chrome/Edge 在 file:// 协议下拒绝加载脚本
import { readFileSync, writeFileSync } from 'fs'

const path = 'dist/index.html'
let html = readFileSync(path, 'utf-8')

html = html
  .replace(/ type="module"/g, '')
  .replace(/ crossorigin/g, '')

writeFileSync(path, html, 'utf-8')
console.log('✓ dist/index.html 已修复，双击即可在浏览器打开')
