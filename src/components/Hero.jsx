import { useState, useEffect, useRef } from 'react'

// 打字机循环展示的身份标签
const PHRASES = [
  '数字媒体艺术在读生',
  'AI Agent 探索者',
  '创意 × 技术的连接者',
  '正在构建属于自己的 AI 工具',
]

const isMobile = () => window.matchMedia('(pointer: coarse)').matches

export default function Hero() {
  // typed：打字机当前显示的文字（每次 tick 更新，触发重渲染）
  const [typed, setTyped] = useState('')
  const contentRef = useRef(null)

  // ── 打字机效果 ──────────────────────────────────
  // 逻辑：先逐字出现 → 停顿 2.2s → 逐字删除 → 切换下一句 → 循环
  useEffect(() => {
    let pi = 0, ci = 0, del = false, timerId

    const tick = () => {
      const cur = PHRASES[pi]
      if (!del) {
        ci++
        setTyped(cur.slice(0, ci))
        if (ci === cur.length) {
          del = true
          timerId = setTimeout(tick, 2200) // 打完停顿 2.2秒
          return
        }
      } else {
        ci--
        setTyped(cur.slice(0, ci))
        if (ci === 0) {
          del = false
          pi = (pi + 1) % PHRASES.length // 切换到下一句
        }
      }
      timerId = setTimeout(tick, del ? 45 : 90) // 删除快，打字慢
    }

    timerId = setTimeout(tick, 1800) // 页面加载 1.8秒后开始
    return () => clearTimeout(timerId)
  }, [])

  // ── 滚动视差效果（桌面端）──────────────────────
  // 向下滚动时，Hero 内容缓慢上移并淡出，产生纵深感
  useEffect(() => {
    if (isMobile()) return
    const el = contentRef.current
    if (!el) return

    let rafId, scrollRaf = false

    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = true
      rafId = requestAnimationFrame(() => {
        scrollRaf = false
        const y     = window.scrollY
        const limit = window.innerHeight * 0.75
        if (y < limit) {
          el.style.transform = `translateY(${y * 0.22}px)`
          el.style.opacity   = String(1 - y / limit)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // ── 磁吸按钮（桌面端）──────────────────────────
  // 鼠标靠近时按钮被"吸引"偏移，离开后弹回
  useEffect(() => {
    if (isMobile()) return
    const btns = document.querySelectorAll('.magnetic')
    const cleanups = []

    btns.forEach(btn => {
      const onMove  = (e) => {
        const r  = btn.getBoundingClientRect()
        const dx = (e.clientX - r.left - r.width  / 2) * 0.3
        const dy = (e.clientY - r.top  - r.height / 2) * 0.3
        btn.style.transform = `translate(${dx}px, ${dy}px)`
      }
      const onEnter = () => { btn.style.transition = 'transform .1s ease' }
      const onLeave = () => {
        btn.style.transform  = ''
        btn.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)'
      }

      btn.addEventListener('mousemove',  onMove)
      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        btn.removeEventListener('mousemove',  onMove)
        btn.removeEventListener('mouseenter', onEnter)
        btn.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-content" ref={contentRef}>

        {/* 状态标签行：绿点 + 身份标签 */}
        <div className="hero-meta" data-aos="fade-up" data-aos-delay="0">
          <div className="hero-status">
            <span className="status-dot" />
            <span>AVAILABLE</span>
          </div>
          <span className="hero-meta-divider">·</span>
          <p className="hero-tag">
            <span className="tag-bracket">[</span>
            数字媒体 × AI 创作者
            <span className="tag-bracket">]</span>
          </p>
        </div>

        {/* 主标题：两行，CSS 动画逐行出现 */}
        <h1 className="hero-title">
          <span className="title-line" data-aos="fade-up" data-aos-delay="100">
            Hi, I'm
          </span>
          <span className="title-line highlight-wrap" data-aos="fade-up" data-aos-delay="200">
            <span className="highlight">Colin</span>
          </span>
        </h1>

        {/* 打字机区域：typed 是 React state，每次更新自动重渲染 */}
        <div className="hero-sub-wrap" data-aos="fade-up" data-aos-delay="300">
          <span className="type-cursor">_</span>
          <span>{typed}</span>
        </div>

        {/* 按钮：magnetic class 被上面的 useEffect 绑定磁吸效果 */}
        <div className="hero-btns" data-aos="fade-up" data-aos-delay="400">
          <a href="#about"   className="btn btn-primary magnetic">了解我</a>
          <a href="#contact" className="btn btn-ghost   magnetic">联系我</a>
        </div>
      </div>

      {/* 背景发光球 */}
      <div className="hero-glow"              aria-hidden="true" />
      <div className="hero-glow hero-glow-2"  aria-hidden="true" />

      {/* 向下滚动提示（桌面端显示） */}
      <div className="scroll-hint" data-aos="fade-up" data-aos-delay="600">
        <div className="scroll-line" />
        <span>向下滚动</span>
      </div>
    </section>
  )
}
