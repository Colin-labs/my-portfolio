import { useEffect, useRef } from 'react'

const SPARK_COLORS = ['#a78bfa', '#e879f9', '#38bdf8', '#34d399']

// CustomCursor：自定义双圆圈光标 + 鼠标轨迹粒子
// 只在桌面端（非触摸屏）显示
export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // 触摸设备不需要自定义光标
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let rx = 0, ry = 0, mx = 0, my = 0
    let rafId
    let lastSpark = 0

    // 用事件委托代替逐个元素绑定
    // 鼠标移到可交互元素上 → 光标环变大
    const onMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, .tilt-card, .contact-item, .btn')
      ring.classList.toggle('hover', !!isInteractive)
    }

    // 每 40ms 生成一个彩色粒子，随机方向飞散消失
    const spawnSpark = (x, y) => {
      const now = Date.now()
      if (now - lastSpark < 40) return
      lastSpark = now

      const el    = document.createElement('div')
      el.className = 'spark'
      const size  = Math.random() * 4 + 2
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
      const dx    = (Math.random() - .5) * 28
      const dy    = -(Math.random() * 22 + 8)

      el.style.cssText = `
        left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        background:${color};
        --dx:${dx}px; --dy:${dy}px;
        box-shadow:0 0 ${size * 2}px ${color};
      `
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 800)
    }

    const onMouseMove = (e) => {
      mx = e.clientX
      my = e.clientY
      // 小圆点精准跟随
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
      spawnSpark(mx, my)
    }

    // lerp（线性插值）：大环缓慢追赶鼠标，产生"惯性"感
    // 每帧：当前位置 += (目标位置 - 当前位置) × 0.12
    const lerp = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      rafId = requestAnimationFrame(lerp)
    }
    lerp()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover',  onMouseOver)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover',  onMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
