/**
 * particles.js — Rede de Nós e Partículas Cibernéticas (Canvas 2D Puro)
 * - Fundo tecnológico suave e de alta legibilidade
 * - Conexões dinâmicas que reagem ao mouse
 * - Pausa automática fora da tela ou aba inativa
 * - Respeito a prefers-reduced-motion
 * Dênio Mingote | 2026
 */

/**
 * particles.js — Rede de Nós e Partículas Cibernéticas Global (Canvas 2D Puro)
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let animationFrameId = null;
  let isVisible = true;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.25;
    }

    update() {
      if (isReducedMotion) return;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 1.5;
          this.y -= directionY * force * 1.5;
        }
      }
    }

    draw(colorRgb) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRgb}, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const primaryRgb = isLight ? '0, 139, 163' : '0, 229, 255';
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(primaryRgb);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (isLight ? 0.18 : 0.22);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    if (!isReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  // Pausa apenas se o usuário trocar de aba para economizar bateria/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      isVisible = true;
      if (!isReducedMotion) draw();
    }
  });

  // Inicia o loop imediatamente
  draw();
});