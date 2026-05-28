import { useEffect } from 'react'

const isMobile = () => window.matchMedia('(pointer: coarse)').matches

const CARDS = [
  {
    aos:   'fade-right',
    delay: '0',
    badge: 'Agent',
    title: 'AI Agent 开发',
    body:  '使用 OpenClaw 和 Claude Code 构建智能 Agent 工作流，探索 AI 自动化的边界。',
    tags:  ['OpenClaw', 'Claude', 'Automation'],
  },
  {
    aos:   'zoom-in',
    delay: '100',
    badge: 'Create',
    title: 'AIGC 内容创作',
    body:  '结合 AI 工具进行图像、视频、文案创作，将数字媒体艺术背景与 AI 能力融合。',
    tags:  ['Midjourney', 'Stable Diffusion', 'CapCut'],
  },
  {
    aos:   'fade-left',
    delay: '200',
    badge: 'Build',
    title: 'AI 工具开发',
    body:  '学习开发实用的 AI 工具和网站，目标是成为能独立交付 AI 项目的开发者。',
    tags:  ['Web Dev', 'API', 'Workflow'],
  },
]

export default function AIGC() {
  // 3D 倾斜（同 About 组件，代码逻辑一样）
  useEffect(() => {
    if (isMobile()) return
    const cards    = document.querySelectorAll('#aigc .tilt-card')
    const cleanups = []

    cards.forEach(card => {
      const onMove = (e) => {
        const r  = card.getBoundingClientRect()
        const x  = e.clientX - r.left
        const y  = e.clientY - r.top
        const rx = ((y - r.height / 2) / r.height) * -9
        const ry = ((x - r.width  / 2) / r.width)  *  9
        card.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`
        card.style.transition = 'transform .08s ease'
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
    <section className="section" id="aigc">
      <div className="container">
        <h2 className="section-title" data-aos="fade-right">
          <span className="title-num">03.</span> AI / AIGC
          <span className="line" />
        </h2>

        <div className="aigc-grid">
          {CARDS.map(({ aos, delay, badge, title, body, tags }) => (
            <div
              key={title}
              className="aigc-card glass tilt-card"
              data-aos={aos}
              data-aos-delay={delay}
            >
              <div className="aigc-badge">{badge}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="tags">
                {tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
