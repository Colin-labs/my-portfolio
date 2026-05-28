import { useEffect } from 'react'

const isMobile = () => window.matchMedia('(pointer: coarse)').matches

// 卡片数据抽成数组：添加/修改卡片只需改这里，不用改 JSX 结构
// 这是 React 的核心思路：数据驱动 UI
const CARDS = [
  {
    num:  '#01',
    icon: '🎓',
    title: '教育背景',
    body:  '本科在读 · 数字媒体艺术',
  },
  {
    num:  '#02',
    icon: '⚙️',
    title: '开发环境',
    body:  'Win11 · WSL2 · i9-14900HX · RTX 4060\nmacOS · MacBook M4',
  },
  {
    num:  '#03',
    icon: '🚀',
    title: '目标',
    body:  '独立开发 AI 工具与网站\n探索 AI × 创意艺术的边界',
  },
  {
    num:  '#04',
    icon: '⚡',
    title: '当前状态',
    body:  '正在学习 AI Agent\nOpenClaw · Claude Code',
  },
]

export default function About() {
  // 3D 卡片倾斜（桌面端）
  useEffect(() => {
    if (isMobile()) return
    const cards    = document.querySelectorAll('#about .tilt-card')
    const cleanups = []

    cards.forEach(card => {
      const onMove = (e) => {
        const r  = card.getBoundingClientRect()
        const x  = e.clientX - r.left
        const y  = e.clientY - r.top
        // 倾斜角度：鼠标偏离中心越多，倾斜越大
        const rx = ((y - r.height / 2) / r.height) * -9
        const ry = ((x - r.width  / 2) / r.width)  *  9
        card.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`
        card.style.transition = 'transform .08s ease'
        // 给 glass ::after 的鼠标光晕定位用
        card.style.setProperty('--mx', `${(x / r.width)  * 100}%`)
        card.style.setProperty('--my', `${(y / r.height) * 100}%`)
      }
      const onLeave = () => {
        card.style.transform  = ''
        card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)'
      }

      card.addEventListener('mousemove',  onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mousemove',  onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="section-title" data-aos="fade-right">
          <span className="title-num">01.</span> 关于我
          <span className="line" />
        </h2>

        {/* .map() 循环渲染卡片：CARDS 数组有多少项就渲染多少个卡片 */}
        <div className="about-grid">
          {CARDS.map(({ num, icon, title, body }, i) => (
            <div
              key={num}
              className="about-card glass tilt-card"
              data-aos="fade-up"
              data-aos-delay={String(i * 80)}
            >
              <span className="card-num">{num}</span>
              <div className="card-icon">{icon}</div>
              <h3>{title}</h3>
              {/* 把 \n 换行符转成 <br /> 标签 */}
              <p>
                {body.split('\n').map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
