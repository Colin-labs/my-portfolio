import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// React 的入口文件
// ReactDOM.createRoot 找到 index.html 里的 <div id="root">
// 然后把整个 App 组件树渲染进去
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
