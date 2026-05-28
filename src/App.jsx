import { useEffect } from 'react'
import NoiseOverlay  from './components/NoiseOverlay'
import CustomCursor  from './components/CustomCursor'
import Loader        from './components/Loader'
import Background    from './components/Background'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import About         from './components/About'
import Skills        from './components/Skills'
import AIGC          from './components/AIGC'
import Contact       from './components/Contact'
import Footer        from './components/Footer'

// App 是整个网站的"根组件"
// 它把所有子组件拼在一起，就像 index.html 里的 body
export default function App() {

  // ── 全局滚动进入动画（替代原来 script.js 里的 IntersectionObserver）──
  // useEffect 在页面首次渲染完成后执行一次
  // 它扫描所有带 data-aos 的元素，当它们进入视口时加 aos-animate class
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el    = entry.target
          const delay = parseInt(el.dataset.aosDelay || 0)
          setTimeout(() => el.classList.add('aos-animate'), delay)
          observer.unobserve(el) // 动画只触发一次，触发后不再监听
        })
      },
      { threshold: 0.1 } // 元素露出 10% 就触发
    )

    document.querySelectorAll('[data-aos]').forEach((el) => observer.observe(el))
    return () => observer.disconnect() // 组件卸载时清理，防止内存泄漏
  }, []) // [] 表示只在首次渲染后运行一次

  return (
    <>
      {/* 视觉层：噪点 + 光标 + 加载遮罩 + 背景粒子 */}
      <NoiseOverlay />
      <CustomCursor />
      <Loader />
      <Background />

      {/* 导航（固定在顶部） */}
      <Navbar />

      {/* 页面内容：用 <main> 包裹，语义更清晰 */}
      <main>
        <Hero />
        <About />
        <Skills />
        <AIGC />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
