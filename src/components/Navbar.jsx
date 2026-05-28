import { useState, useEffect, useRef } from 'react'

// Navbar 的导航项数据（数组 → 可以用 .map() 循环渲染，不用重复写 HTML）
const LINKS = [
  { href: '#about',   label: '关于我' },
  { href: '#skills',  label: '技能'   },
  { href: '#aigc',    label: 'AI/AIGC'},
  { href: '#contact', label: '联系'   },
]

export default function Navbar() {
  // React 状态（useState）：数据变化时自动重新渲染
  const [scrolled,    setScrolled]   = useState(false)  // 是否已滚动（控制导航栏样式）
  const [menuOpen,    setMenuOpen]   = useState(false)  // 手机菜单是否打开
  const [activeLink,  setActiveLink] = useState('')     // 当前高亮的导航项

  const progressRef = useRef(null)  // 进度条 DOM 引用（不需要触发重渲染，用 ref）

  // 监听页面滚动
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    let scrollRaf  = false

    const onScroll = () => {
      // requestAnimationFrame 节流：每帧最多更新一次，避免 scroll 事件打满 CPU
      if (scrollRaf) return
      scrollRaf = true
      requestAnimationFrame(() => {
        scrollRaf = false
        const sy    = window.scrollY
        const total = document.body.scrollHeight - window.innerHeight

        // 进度条用 scaleX 而不是 width，GPU 合成层渲染，更流畅
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${total > 0 ? sy / total : 0})`
        }

        setScrolled(sy > 50)

        // 找出当前在哪个 section
        let current = ''
        sections.forEach(sec => {
          if (sy >= sec.offsetTop - 140) current = sec.id
        })
        setActiveLink(current)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 手机菜单打开时锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* 导航栏：scrolled 为 true 时加 .scrolled class，改变背景透明度 */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">
          Colin<span className="dot">.</span>
        </div>

        {/* 桌面端链接列表 */}
        <ul className="nav-links">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link${activeLink === href.slice(1) ? ' active' : ''}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* 汉堡按钮（手机端显示） */}
        <button
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="菜单"
        >
          <span /><span /><span />
        </button>

        {/* 阅读进度条 */}
        <div className="nav-progress" ref={progressRef} />
      </nav>

      {/* 手机端全屏菜单 */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {LINKS.map(({ href, label }) => (
          <a key={href} href={href} className="mobile-link" onClick={closeMenu}>
            {label}
          </a>
        ))}
      </div>
    </>
  )
}
