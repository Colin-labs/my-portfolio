// NoiseOverlay：页面最顶层的噪点质感层
// 极低透明度（0.03），消除数字屏幕的"塑料感"
export default function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />
}
