/**
 * globe.js — Globo Holográfico 3D Cibernético em Canvas Puro
 * - Projeção 3D matemática com nós em esfera de Fibonacci
 * - Anéis orbitais de dados e conexões de rede
 * - Interatividade total: clique e arraste para girar em 3D com inércia
 * - Robusto e com garantia de renderização imediata
 * Dênio Mingote | 2026
 */

(function initGlobe() {
  function start() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const card = canvas.closest('.globe-card');

    // Resolução fixa de alta definição interna
    const CANVAS_SIZE = 460;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Constantes de Projeção 3D
    const radius = 155;
    const fov = 420;
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    // Estados de Rotação
    let rotX = 0.22;
    let rotY = 0;
    let velX = 0;
    let velY = 0.0035;
    const baseAutoSpin = 0.0035;

    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // 1. Gera 145 nós na superfície da esfera usando a Espiral de Fibonacci
    const nodeCount = 145;
    const nodes = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Proporção áurea

    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / phi;
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      nodes.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseRadius: Math.random() * 1.8 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        isSpecial: i % 13 === 0
      });
    }

    // 2. Anéis Orbitais de Dados
    const ringPoints = 60;
    const rings = [
      { radiusFactor: 1.0, tiltX: 0, tiltY: 0, alpha: 0.15 },
      { radiusFactor: 0.85, tiltX: 0.35, tiltY: 0.2, alpha: 0.12 },
      { radiusFactor: 1.25, tiltX: 0.7, tiltY: 0.4, alpha: 0.28, isOrbital: true }
    ];

    // 3. Matrizes de Rotação 3D
    function rotatePoint(p, rx, ry) {
      // Eixo Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.z * cosY + p.x * sinY;

      // Eixo X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.y * sinX;

      return { x: x1, y: y2, z: z2 };
    }

    // 4. Interação com Mouse & Touch
    function onPointerDown(clientX, clientY) {
      isDragging = true;
      lastMouseX = clientX;
      lastMouseY = clientY;
      velX = 0;
      velY = 0;
      if (card) card.classList.add('globe-card--grabbing');
    }

    function onPointerMove(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - lastMouseX;
      const dy = clientY - lastMouseY;

      velY = dx * 0.007;
      velX = -dy * 0.007;

      rotY += velY;
      rotX += velX;

      lastMouseX = clientX;
      lastMouseY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
      if (card) card.classList.remove('globe-card--grabbing');
    }

    // Mouse
    canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onPointerUp);

    // Touch
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

    // 5. Loop de Renderização Contínuo
    function render() {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Física de inércia suave
      if (!isDragging) {
        rotY += velY;
        rotX += velX;
        velX *= 0.94;
        velY = velY * 0.96 + baseAutoSpin * 0.04;
      }

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const primaryColor = isLight ? '0, 139, 163' : '0, 229, 255';
      const secondaryColor = isLight ? '0, 143, 88' : '0, 255, 156';

      // 5.1. Brilho atmosférico central
      const coreGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 1.15);
      coreGlow.addColorStop(0, `rgba(${primaryColor}, ${isLight ? 0.08 : 0.12})`);
      coreGlow.addColorStop(0.7, `rgba(${primaryColor}, ${isLight ? 0.03 : 0.04})`);
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 5.2. Anéis Orbitais
      rings.forEach((ring) => {
        ctx.beginPath();
        for (let j = 0; j <= ringPoints; j++) {
          const angle = (j / ringPoints) * Math.PI * 2;
          const currentR = radius * ring.radiusFactor;

          const p = {
            x: Math.cos(angle) * currentR,
            y: Math.sin(angle) * currentR * (ring.isOrbital ? 0.45 : 1),
            z: Math.sin(angle) * currentR * (ring.isOrbital ? 0.8 : 0)
          };

          const rotated = rotatePoint(p, rotX + ring.tiltX, rotY + ring.tiltY);
          const scale = fov / (fov - rotated.z);
          const px = rotated.x * scale + centerX;
          const py = rotated.y * scale + centerY;

          if (j === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.closePath();
        const ringAlpha = ring.alpha * (isLight ? 0.8 : 1.2);
        ctx.strokeStyle = ring.isOrbital
          ? `rgba(${secondaryColor}, ${ringAlpha})`
          : `rgba(${primaryColor}, ${ringAlpha})`;
        ctx.lineWidth = ring.isOrbital ? 1.5 : 0.8;
        ctx.stroke();
      });

      // 5.3. Projeção de Nós
      const projectedNodes = nodes.map((node) => {
        node.pulse += 0.04;
        const rotated = rotatePoint(node, rotX, rotY);
        const scale = fov / (fov - rotated.z);
        const px = rotated.x * scale + centerX;
        const py = rotated.y * scale + centerY;
        const depthAlpha = Math.max(0.12, (rotated.z + radius) / (radius * 2));

        return {
          x: px,
          y: py,
          z: rotated.z,
          scale,
          depthAlpha,
          baseRadius: node.baseRadius,
          pulse: node.pulse,
          isSpecial: node.isSpecial
        };
      });

      // 5.4. Conexões de Rede entre Nós Próximos
      const maxLinkDist = 58;
      for (let i = 0; i < projectedNodes.length; i++) {
        const p1 = projectedNodes[i];
        if (p1.z < -radius * 0.45) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p2 = projectedNodes[j];
          if (p2.z < -radius * 0.45) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLinkDist) {
            const alpha = (1 - dist / maxLinkDist) * 0.28 * ((p1.depthAlpha + p2.depthAlpha) / 2);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 5.5. Desenhar os Nós (ordenados do fundo para a frente)
      projectedNodes.sort((a, b) => a.z - b.z);

      projectedNodes.forEach((p) => {
        const nodeRadius = p.baseRadius * p.scale;
        const alpha = p.depthAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);

        if (p.isSpecial && p.z > 0) {
          ctx.fillStyle = `rgba(${secondaryColor}, ${alpha * 0.95})`;
          ctx.fill();

          const pulseR = nodeRadius + (Math.sin(p.pulse) + 1) * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${secondaryColor}, ${alpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${primaryColor}, ${alpha * 0.85})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(render);
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
