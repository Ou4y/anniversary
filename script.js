// script.js - Romantic Journey One-Page Website

// Fade-in on scroll for month sections and heartfelt box
function revealOnScroll() {
  const reveals = document.querySelectorAll('.month-section, .heartfelt-box');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Smooth scroll for anchor links (if any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Scroll to Top button logic
const scrollBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', function() {
  const month7 = document.getElementById('month-7');
  if (month7) {
    const trigger = month7.getBoundingClientRect().top < window.innerHeight * 0.5;
    if (trigger) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }
});
scrollBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Flower animation (canvas)
const canvas = document.getElementById('flowers-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // More accurate lily petal: long, narrow, slightly curved, with a pointed tip
  function drawLilyPetal(x, y, r, angle, color, t, petalIndex) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // Curve left edge
    ctx.bezierCurveTo(
      -r * 0.18, -r * 0.45,
      -r * 0.18, -r * 0.85,
      0, -r
    );
    // Curve right edge
    ctx.bezierCurveTo(
      r * 0.18, -r * 0.85,
      r * 0.18, -r * 0.45,
      0, 0
    );
    ctx.closePath();
    // Subtle gradient for realism
    const grad = ctx.createLinearGradient(0, 0, 0, -r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#fff');
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawLily(x, y, size, petalCount, t) {
    // Draw petals
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount + Math.sin(t + i) * 0.05;
      const petalLen = size * (1.05 + 0.07 * Math.sin(t + i));
      drawLilyPetal(
        x,
        y,
        petalLen,
        angle,
        getComputedStyle(document.documentElement).getPropertyValue('--flower-petal').trim(),
        t,
        i
      );
    }
    // Draw center (pistil)
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--flower-center').trim();
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    // Draw stamens (long, thin, with orange tips)
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount + Math.PI / petalCount;
      ctx.save();
      ctx.strokeStyle = '#b68973';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * size * 0.38,
        y + Math.sin(angle) * size * 0.38
      );
      ctx.stroke();
      // Stamen tip
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * size * 0.38,
        y + Math.sin(angle) * size * 0.38,
        size * 0.045,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#ff914d'; // Orange tip
      ctx.shadowColor = '#ff914d';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }
  }

  // Animate multiple lilies
  const flowers = Array.from({length: 7}, (_, i) => ({
    x: 60 + i * 55 + Math.random() * 10,
    y: 120 + Math.random() * 30,
    size: 28 + Math.random() * 12,
    petalCount: 6,
    delay: Math.random() * 1.5,
    appeared: false
  }));

  let startTime = null;
  function animateFlowers(ts) {
    if (!startTime) startTime = ts;
    const t = (ts - startTime) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flowers.forEach((f, i) => {
      if (t > f.delay) {
        f.appeared = true;
        drawLily(f.x, f.y, f.size, f.petalCount, t - f.delay);
      } else if (f.appeared) {
        drawLily(f.x, f.y, f.size, f.petalCount, t - f.delay);
      }
    });
    requestAnimationFrame(animateFlowers);
  }
  requestAnimationFrame(animateFlowers);
}
