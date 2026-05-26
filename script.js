// ================================================
// 工具
// ================================================
const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

// ================================================
// 页面加载遮罩
// ================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});

// ================================================
// 自定义光标 + 鼠标轨迹粒子
// dot精准跟随；ring用lerp(0.12)缓动，产生"惯性感"
// spawnSpark：每40ms一颗彩色粒子，随机方向飞散
// ================================================
if (!isMobile()) {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    spawnSpark(mx, my);
  });

  function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.querySelectorAll('a, button, .tilt-card, .contact-item, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  let lastSpark = 0;
  const sparkColors = ['#a78bfa', '#e879f9', '#38bdf8', '#34d399'];

  function spawnSpark(x, y) {
    const now = Date.now();
    if (now - lastSpark < 40) return;
    lastSpark = now;

    const el    = document.createElement('div');
    el.className = 'spark';
    const size  = Math.random() * 4 + 2;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const dx    = (Math.random() - .5) * 28;
    const dy    = -(Math.random() * 22 + 8);

    el.style.cssText = `
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      background:${color};
      --dx:${dx}px; --dy:${dy}px;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

// ================================================
// 导航栏：滚动效果 + 进度条 + 活跃高亮
// ================================================
const navbar   = document.getElementById('navbar');
const progress = document.getElementById('navProgress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  const total = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / total * 100) + '%';

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });

  heroParallax();
});

// ================================================
// Hero 视差
// 向下滚动时内容缓慢上移(0.22)并渐隐，营造纵深感
// ================================================
const heroContent = document.querySelector('.hero-content');

function heroParallax() {
  if (!heroContent || isMobile()) return;
  const y     = window.scrollY;
  const limit = window.innerHeight * 0.75;
  if (y < limit) {
    heroContent.style.transform = `translateY(${y * 0.22}px)`;
    heroContent.style.opacity   = String(1 - y / limit);
  }
}

// ================================================
// 汉堡菜单
// ================================================
const toggle      = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ================================================
// 打字机效果
// ================================================
const phrases = ['数字媒体艺术在读生', 'AI Agent 探索者', '创意 × 技术的连接者', '正在构建属于自己的 AI 工具'];
let pi = 0, ci = 0, del = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const cur = phrases[pi];
  if (!del) {
    typeEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2200); return; }
  } else {
    typeEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, del ? 45 : 90);
}
setTimeout(type, 1800);

// ================================================
// 粒子背景（升级：鼠标排斥力）
// 120px范围内粒子被轻微排斥，离开后阻尼回归
// ================================================
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let pts = [];
let mouseX = -9999, mouseY = -9999;

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); pts = []; init(); });

function init() {
  pts = [];
  const count = isMobile() ? 50 : 100;
  for (let i = 0; i < count; i++) {
    const vx = (Math.random() - .5) * .35;
    const vy = (Math.random() - .5) * .35;
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx, vy, baseVx: vx, baseVy: vy,
      s: Math.random() * 1.4 + .3,
      o: Math.random() * .28 + .05,
    });
  }
}
init();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];

    if (!isMobile()) {
      const dx   = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120 * .7;
        p.vx += (dx / dist) * force * .04;
        p.vy += (dy / dist) * force * .04;
      }
    }

    p.vx += (p.baseVx - p.vx) * 0.02;
    p.vy += (p.baseVy - p.vy) * 0.02;
    p.x  += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167,139,250,${p.o})`;
    ctx.fill();

    for (let j = i + 1; j < pts.length; j++) {
      const dx = p.x - pts[j].x, dy = p.y - pts[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(167,139,250,${.065 * (1 - d / 110)})`;
        ctx.lineWidth   = .5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();

// ================================================
// 磁吸按钮
// ================================================
if (!isMobile()) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform .1s ease';
    });
  });
}

// ================================================
// 卡片 3D 倾斜
// ================================================
if (!isMobile()) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -9;
      const ry = ((x - r.width  / 2) / r.width)  *  9;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      card.style.transition = 'transform .08s ease';
      card.style.setProperty('--mx', `${(x / r.width)  * 100}%`);
      card.style.setProperty('--my', `${(y / r.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
    });
  });
}

// ================================================
// 滚动进入动画（自实现 AOS）
// ================================================
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.aosDelay || 0);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      aosObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ================================================
// 技能条 + 数字计数器
// easeOutQuart：先快后慢，比线性更自然真实
// ================================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
      const target = parseInt(bar.dataset.width);
      const pct    = bar.closest('.skill-item').querySelector('.skill-pct');

      setTimeout(() => {
        bar.style.width = target + '%';
        let start = null;
        function countAnim(ts) {
          if (!start) start = ts;
          const p    = Math.min((ts - start) / 1400, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          if (pct) pct.textContent = Math.round(ease * target) + '%';
          if (p < 1) requestAnimationFrame(countAnim);
        }
        requestAnimationFrame(countAnim);
      }, i * 120);
    });

    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// ================================================
// 平滑滚动
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
