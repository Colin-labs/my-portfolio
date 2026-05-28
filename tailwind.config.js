/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 会扫描这些文件，找到用到的 class，只打包用到的样式
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // 把设计系统的字体注册为 Tailwind 工具类
      // 这样 JSX 里可以写 className="font-heading" 代替 font-family CSS
      fontFamily: {
        heading: ["'Space Grotesk'", "'PingFang SC'", "'Microsoft YaHei'", 'sans-serif'],
        body:    ["'Noto Sans SC'", "'PingFang SC'", "'Microsoft YaHei'", 'sans-serif'],
        mono:    ["'JetBrains Mono'", "'SF Mono'", 'Consolas', 'monospace'],
      },
      // 把设计色板注册为 Tailwind 颜色
      // 这样可以写 text-primary、bg-primary-dark 等
      colors: {
        'space-bg':     '#020209',
        'space-bg2':    '#07041a',
        primary:        '#a78bfa',
        'primary-dark': '#7c3aed',
        secondary:      '#e879f9',
        accent:         '#34d399',
        'sky-blue':     '#38bdf8',
        cyan:           '#22d3ee',
      },
    },
  },
  plugins: [],
}
