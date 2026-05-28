import { useEffect, useRef } from 'react'

// Loader：页面首次加载时的全屏遮罩
// 1.5秒后淡出，让用户看到内容
export default function Loader() {
  const loaderRef = useRef(null)

  // useEffect：组件挂载后执行
  // 1.5秒后给 loader 加 hidden class，触发 CSS 淡出动画
  useEffect(() => {
    const timer = setTimeout(() => {
      loaderRef.current?.classList.add('hidden')
    }, 1500)
    return () => clearTimeout(timer) // 组件卸载时取消定时器
  }, [])

  return (
    <div className="page-loader" ref={loaderRef}>
      <div className="loader-content">
        <div className="loader-logo">Colin<span>.</span></div>
        <div className="loader-bar">
          <div className="loader-fill" />
        </div>
        <div className="loader-text">Loading...</div>
      </div>
    </div>
  )
}
