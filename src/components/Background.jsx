import { useEffect, useRef } from 'react'

const isMobile = () => window.matchMedia('(pointer: coarse)').matches

// Background：页面三层背景系统
// 层1：CSS 网格线（.bg-grid）
// 层2：两个漂移光晕球（.bg-gradient 的 ::before / ::after）
// 层3：Canvas 粒子网络（本组件核心）
export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const mobile = isMobile()
    // DPR：设备像素比，Retina屏=2，普通屏=1
    // Canvas 内部尺寸 × DPR，让高分屏粒子不模糊
    const DPR    = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

    let pts = [], mouseX = -9999, mouseY = -9999
    let animPaused = false, rafId

    const resize = () => {
      const w = innerWidth, h = innerHeight
      canvas.width  = w * DPR
      canvas.height = h * DPR
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(DPR, DPR)
    }

    const init = () => {
      pts = []
      // 手机30颗粒子，桌面100颗，平衡效果和性能
      const count = mobile ? 30 : 100
      for (let i = 0; i < count; i++) {
        const spd = mobile ? .25 : .35
        const vx  = (Math.random() - .5) * spd
        const vy  = (Math.random() - .5) * spd
        pts.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          vx, vy,
          baseVx: vx, baseVy: vy,
          s: Math.random() * 1.4 + .3,   // 粒子大小
          o: Math.random() * .28 + .05,   // 透明度
        })
      }
    }

    const draw = () => {
      // 页面切到后台时暂停，节省电量
      if (animPaused) { rafId = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, innerWidth, innerHeight)

      const linkDist   = mobile ? 70 : 110  // 连线最大距离
      const linkDistSq = linkDist * linkDist // 用平方避免 sqrt 运算

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        // 桌面端：鼠标靠近时排斥粒子
        if (!mobile) {
          const dx   = p.x - mouseX
          const dy   = p.y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * .7
            p.vx += (dx / dist) * force * .04
            p.vy += (dy / dist) * force * .04
          }
        }

        // 阻尼：速度缓慢回归原始值
        p.vx += (p.baseVx - p.vx) * 0.02
        p.vy += (p.baseVy - p.vy) * 0.02
        p.x  += p.vx
        p.y  += p.vy
        // 碰到边界反弹
        if (p.x < 0 || p.x > innerWidth)  p.vx *= -1
        if (p.y < 0 || p.y > innerHeight) p.vy *= -1

        // 画粒子点
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167,139,250,${p.o})`
        ctx.fill()

        // 画连线（用平方比较，大多数情况跳过 sqrt，更快）
        for (let j = i + 1; j < pts.length; j++) {
          const dx  = p.x - pts[j].x
          const dy  = p.y - pts[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < linkDistSq) {
            const d = Math.sqrt(dSq)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(167,139,250,${.065 * (1 - d / linkDist)})`
            ctx.lineWidth   = .5
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    const onMouseMove   = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    const onVisibility  = ()  => { animPaused = document.hidden }
    const onResize      = ()  => { resize(); pts = []; init() }

    resize()
    init()
    draw()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <div className="bg-grid"     aria-hidden="true" />
      <div className="bg-gradient" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
    </>
  )
}
