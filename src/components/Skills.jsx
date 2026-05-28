import { useEffect, useRef } from 'react'

const SKILLS = [
  { icon: '🎨', name: 'UI / 视觉设计',  pct: 85 },
  { icon: '🌐', name: '网页开发',       pct: 65 },
  { icon: '🤖', name: 'AI 工具应用',    pct: 80 },
  { icon: '🎬', name: 'AIGC 内容创作',  pct: 75 },
  { icon: '⚙️', name: '自动化工作流',   pct: 60 },
  { icon: '💡', name: '创意策划',       pct: 90 },
]

export default function Skills() {
  // gridRef 指向技能网格 DOM，用于 IntersectionObserver
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // 当技能区域进入视口（露出 25%）时，触发进度条动画
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return

          // 逐条技能延迟动画（错开时间，不同时出现）
          grid.querySelectorAll('.skill-fill').forEach((bar, i) => {
            const target = parseInt(bar.dataset.width)
            const pctEl  = bar.closest('.skill-item').querySelector('.skill-pct')

            setTimeout(() => {
              // 触发 CSS transition：width 从 0 → target%
              bar.style.width = target + '%'

              // 数字计数器：和进度条同步，用 easeOutQuart 让增速先快后慢
              let start = null
              const countAnim = (ts) => {
                if (!start) start = ts
                const progress = Math.min((ts - start) / 1400, 1)
                const ease     = 1 - Math.pow(1 - progress, 4) // easeOutQuart
                if (pctEl) pctEl.textContent = Math.round(ease * target) + '%'
                if (progress < 1) requestAnimationFrame(countAnim)
              }
              requestAnimationFrame(countAnim)
            }, i * 120) // 每条技能延迟 120ms
          })

          observer.unobserve(entry.target) // 只触发一次
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="skills">
      <div className="container">
        <h2 className="section-title" data-aos="fade-right">
          <span className="title-num">02.</span> 技能栈
          <span className="line" />
        </h2>

        <div className="skills-grid" ref={gridRef}>
          {SKILLS.map(({ icon, name, pct }, i) => (
            <div
              key={name}
              className="skill-item glass"
              data-aos="fade-up"
              data-aos-delay={String(i * 60)}
            >
              <span className="skill-icon">{icon}</span>
              <span className="skill-name">{name}</span>
              <div className="skill-bar-wrap">
                <div className="skill-bar">
                  {/* data-width 存目标百分比，JS 读取后设置 width */}
                  <div className="skill-fill" data-width={pct} />
                </div>
                <span className="skill-pct">0%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
