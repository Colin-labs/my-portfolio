const LINKS = [
  {
    href:   'mailto:a1270362744@outlook.com',
    icon:   '📧',
    label:  'a1270362744@outlook.com',
  },
  {
    href:   '#',
    icon:   '💬',
    label:  '微信：15713352396',
  },
  {
    href:   'https://github.com/Colin-labs',
    icon:   '🐙',
    label:  'GitHub：Colin-labs',
    target: '_blank',
  },
]

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <h2 className="section-title" data-aos="fade-right">
          <span className="title-num">04.</span> 联系我
          <span className="line" />
        </h2>

        <div className="contact-box glass" data-aos="fade-up">
          <p className="contact-desc">欢迎交流 AI、设计、开发相关话题 👋</p>
          <div className="contact-links">
            {LINKS.map(({ href, icon, label, target }) => (
              <a
                key={label}
                href={href}
                className="contact-item"
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                <span className="c-icon">{icon}</span>
                <span>{label}</span>
                <span className="c-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
