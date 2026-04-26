/* ============================================
   ABYSSAL — effects.js
   Drip, particles, scan sweep, breathing page
   ============================================ */

(function () {

  // --- Scan sweep line ---
  function initScanSweep() {
    const sweep = document.createElement('div');
    sweep.classList.add('scan-sweep');
    document.body.appendChild(sweep);
  }

  // --- Drip effect ---
  function initDrips() {
    const container = document.getElementById('drip-container');
    if (!container) return;

    function spawnDrip() {
      const drip = document.createElement('div');
      drip.classList.add('drip');

      const x        = Math.random() * 100;
      const duration = 1.8 + Math.random() * 2.5;
      const width    = 1.5 + Math.random() * 3;
      const delay    = Math.random() * 2;

      drip.style.left             = x + '%';
      drip.style.width            = width + 'px';
      drip.style.animationDuration = duration + 's';
      drip.style.animationDelay   = delay + 's';

      // Vary the red shade
      const reds = [
        'linear-gradient(to bottom, #8b0000, transparent)',
        'linear-gradient(to bottom, #dc143c, transparent)',
        'linear-gradient(to bottom, #4a0000, transparent)',
        'linear-gradient(to bottom, #a00000, transparent)'
      ];
      drip.style.background = reds[Math.floor(Math.random() * reds.length)];

      container.appendChild(drip);

      // Remove after animation
      setTimeout(() => {
        if (drip.parentNode) drip.parentNode.removeChild(drip);
      }, (duration + delay + 0.5) * 1000);
    }

    // Spawn drips on interval
    setInterval(spawnDrip, 600 + Math.random() * 800);

    // Initial burst
    for (let i = 0; i < 6; i++) {
      setTimeout(spawnDrip, i * 300);
    }
  }

  // --- Blood drip from top of viewport ---
  function initTopDrips() {
    function spawnTopDrip() {
      const drip      = document.createElement('div');
      drip.classList.add('drip');
      drip.style.position = 'fixed';
      drip.style.top      = '0';
      drip.style.zIndex   = '9994';

      const x        = Math.random() * 100;
      const duration = 2.5 + Math.random() * 3;
      const width    = 1 + Math.random() * 2.5;

      drip.style.left             = x + '%';
      drip.style.width            = width + 'px';
      drip.style.animationDuration = duration + 's';
      drip.style.background       = 'linear-gradient(to bottom, #8b0000, transparent)';
      drip.style.opacity          = (0.3 + Math.random() * 0.5).toString();

      document.body.appendChild(drip);

      setTimeout(() => {
        if (drip.parentNode) drip.parentNode.removeChild(drip);
      }, (duration + 0.5) * 1000);
    }

    setInterval(spawnTopDrip, 2200 + Math.random() * 2000);
  }

  // --- Particle burst on click ---
  function initClickParticles() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, a, .bulb-canvas')) return;
      spawnParticleBurst(e.clientX, e.clientY);
    });
  }

  function spawnParticleBurst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        background: ${Math.random() > 0.5 ? '#8b0000' : '#dc143c'};
        border-radius: 50%;
        pointer-events: none;
        z-index: 99990;
        transform: translate(-50%, -50%);
      `;

      document.body.appendChild(p);

      const angle    = (Math.random() * Math.PI * 2);
      const speed    = 40 + Math.random() * 80;
      const dx       = Math.cos(angle) * speed;
      const dy       = Math.sin(angle) * speed;
      const duration = 400 + Math.random() * 400;

      let startTime = null;
      function animateParticle(ts) {
        if (!startTime) startTime = ts;
        const progress = (ts - startTime) / duration;
        if (progress >= 1) {
          if (p.parentNode) p.parentNode.removeChild(p);
          return;
        }
        const ease = 1 - progress;
        p.style.left    = (x + dx * progress) + 'px';
        p.style.top     = (y + dy * progress + 60 * progress * progress) + 'px';
        p.style.opacity = ease.toString();
        requestAnimationFrame(animateParticle);
      }
      requestAnimationFrame(animateParticle);
    }
  }

  // --- Breathing body effect ---
  function initBodyBreathing() {
    let t = 0;
    function breathe() {
      t += 0.004;
      const scale = 1 + Math.sin(t) * 0.004;
      document.body.style.transform = `scale(${scale})`;
      requestAnimationFrame(breathe);
    }
    breathe();
  }

  // --- Flicker lights animation ---
  function initFlickerLights() {
    const lights = document.querySelectorAll('.flicker-light');
    lights.forEach(light => {
      setInterval(() => {
        const opacity = 0.4 + Math.random() * 0.6;
        const x       = (Math.random() - 0.5) * 30;
        const y       = (Math.random() - 0.5) * 30;
        light.style.transform = `translate(${x}px, ${y}px)`;
        light.style.opacity   = opacity.toString();
      }, 800 + Math.random() * 1200);
    });
  }

  // --- Typewriter hero line ---
  function initTypewriter() {
    const el = document.getElementById('hero-line');
    if (!el) return;

    const lines = [
      'We sell what others pretend doesn\'t exist.',
      'Every transaction is permanent.',
      'You have been here before. You don\'t remember.',
      'Something is watching your cursor.',
      'The void has a storefront now.',
      'All items ship from an undisclosed location.',
      'No refunds. No returns. No escape.',
    ];

    let lineIndex  = 0;
    let charIndex  = 0;
    let deleting   = false;
    let pauseTimer = null;

    // Add cursor
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function type() {
      const current = lines[lineIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting   = true;
          pauseTimer = setTimeout(type, 2800);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting   = false;
          lineIndex  = (lineIndex + 1) % lines.length;
          pauseTimer = setTimeout(type, 600);
          return;
        }
      }

      const speed = deleting
        ? 28 + Math.random() * 20
        : 55 + Math.random() * 40;

      setTimeout(type, speed);
    }

    setTimeout(type, 1200);
  }

  // --- Footer: fake coordinates ---
  function initFakeCoords() {
    const el = document.getElementById('footer-coords');
    if (!el) return;

    function randomCoord() {
      const lat  = (Math.random() * 180 - 90).toFixed(4);
      const lng  = (Math.random() * 360 - 180).toFixed(4);
      const acc  = (Math.random() * 80 + 10).toFixed(1);
      el.textContent = `[ ${lat}°N  ${lng}°E  ±${acc}m ]`;
    }

    randomCoord();
    setInterval(randomCoord, 3500);
  }

  // --- Footer year ---
  function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // --- Preview grid population (featured items) ---
  function initPreviewGrid() {
    const grid = document.getElementById('preview-grid');
    if (!grid || typeof window.AbyssalShopData === 'undefined') return;

    const featured = window.AbyssalShopData
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    featured.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('preview-card');
      card.innerHTML = `
        <span class="card-symbol">${item.icon}</span>
        <div class="card-name">${item.name}</div>
        <div class="card-price">${item.price}</div>
      `;
      card.addEventListener('mouseenter', () => {
        if (window.AbyssalAudio) window.AbyssalAudio.playHover();
      });
      card.addEventListener('click', () => {
        window.location.href = 'pages/shop.html';
      });
      grid.appendChild(card);
    });
  }

  // --- Expose particle burst globally ---
  window.AbyssalEffects = {
    spawnParticleBurst
  };

  // --- Boot ---
  function init() {
    initScanSweep();
    initDrips();
    initTopDrips();
    initClickParticles();
    initBodyBreathing();
    initFlickerLights();
    initTypewriter();
    initFakeCoords();
    initFooterYear();
    setTimeout(initPreviewGrid, 100);
  }

  window.addEventListener('DOMContentLoaded', init);

})();