/* ============================================
   ABYSSAL — effects.js
   Drip, particles, scan sweep, breathing page,
   lightning, falling embers, alone counter,
   card scramble on scroll
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
      const drip     = document.createElement('div');
      drip.classList.add('drip');

      const x        = Math.random() * 100;
      const duration = 1.8 + Math.random() * 2.5;
      const width    = 1.5 + Math.random() * 3;
      const delay    = Math.random() * 2;

      drip.style.left              = x + '%';
      drip.style.width             = width + 'px';
      drip.style.animationDuration = duration + 's';
      drip.style.animationDelay   = delay + 's';

      const reds = [
        'linear-gradient(to bottom, #8b0000, transparent)',
        'linear-gradient(to bottom, #dc143c, transparent)',
        'linear-gradient(to bottom, #4a0000, transparent)',
        'linear-gradient(to bottom, #a00000, transparent)'
      ];
      drip.style.background = reds[Math.floor(Math.random() * reds.length)];
      container.appendChild(drip);

      setTimeout(() => {
        if (drip.parentNode) drip.parentNode.removeChild(drip);
      }, (duration + delay + 0.5) * 1000);
    }

    setInterval(spawnDrip, 600 + Math.random() * 800);
    for (let i = 0; i < 6; i++) setTimeout(spawnDrip, i * 300);
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

      drip.style.left              = x + '%';
      drip.style.width             = width + 'px';
      drip.style.animationDuration = duration + 's';
      drip.style.background        = 'linear-gradient(to bottom, #8b0000, transparent)';
      drip.style.opacity           = (0.3 + Math.random() * 0.5).toString();
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

      const angle    = Math.random() * Math.PI * 2;
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
        const ease   = 1 - progress;
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

    let lineIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function type() {
      const current = lines[lineIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 2800);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting  = false;
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(type, 600);
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
      const lat = (Math.random() * 180 - 90).toFixed(4);
      const lng = (Math.random() * 360 - 180).toFixed(4);
      const acc = (Math.random() * 80 + 10).toFixed(1);
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

  // --- Preview grid population ---
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

  // --- Lightning strike effect ---
  function initLightning() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 9993;
      opacity: 0;
    `;
    document.body.appendChild(canvas);

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    function drawBolt(x1, y1, x2, y2, spread, depth) {
      if (depth <= 0) return;

      const mx     = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
      const my     = (y1 + y2) / 2 + (Math.random() - 0.5) * spread;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(mx, my);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(220, 20, 60, ${0.15 + depth * 0.12})`;
      ctx.lineWidth   = depth * 0.8;
      ctx.shadowColor = '#8b0000';
      ctx.shadowBlur  = 18;
      ctx.stroke();

      // Branch
      if (Math.random() < 0.45 && depth > 1) {
        const bx = mx + (Math.random() - 0.5) * spread * 2;
        const by = my + Math.random() * spread * 2;
        drawBolt(mx, my, bx, by, spread * 0.5, depth - 1);
      }

      drawBolt(x1, y1, mx, my, spread * 0.5, depth - 1);
      drawBolt(mx, my, x2, y2, spread * 0.5, depth - 1);
    }

    function triggerLightning() {
      const startX = Math.random() * canvas.width;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBolt(
        startX, 0,
        startX + (Math.random() - 0.5) * 300,
        canvas.height * (0.4 + Math.random() * 0.5),
        120, 5
      );

      canvas.style.opacity = '1';
      if (window.AbyssalAudio) window.AbyssalAudio.playLightning();

      // Flash sequence
      let flashes = 0;
      const maxFlashes = 2 + Math.floor(Math.random() * 3);
      const flashInterval = setInterval(() => {
        canvas.style.opacity = flashes % 2 === 0 ? '0' : '0.85';
        flashes++;
        if (flashes >= maxFlashes * 2) {
          clearInterval(flashInterval);
          canvas.style.opacity = '0';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 60);
    }

    // Random lightning every 18-45 seconds
    function scheduleLightning() {
      const delay = 18000 + Math.random() * 27000;
      setTimeout(() => {
        triggerLightning();
        scheduleLightning();
      }, delay);
    }

    scheduleLightning();

    // Expose for other modules
    window.AbyssalEffects = window.AbyssalEffects || {};
    window.AbyssalEffects.triggerLightning = triggerLightning;
  }

  // --- Falling embers / ash ---
  function initFallingEmbers() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 85;
    `;
    document.body.appendChild(canvas);

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ctx    = canvas.getContext('2d');
    const embers = [];
    const COUNT  = 55;

    const emberColors = [
      'rgba(139,  0,   0,',
      'rgba(180,  20,  20,',
      'rgba(80,   80,  80,',
      'rgba(60,   60,  60,',
      'rgba(220,  20,  60,',
      'rgba(100,  100, 100,',
    ];

    for (let i = 0; i < COUNT; i++) {
      embers.push(createEmber(canvas));
    }

    function createEmber(canvas, fromTop = false) {
      return {
        x:       Math.random() * canvas.width,
        y:       fromTop ? -10 : Math.random() * canvas.height,
        size:    0.8 + Math.random() * 2.5,
        speedY:  0.3 + Math.random() * 0.8,
        speedX:  (Math.random() - 0.5) * 0.4,
        opacity: 0.1 + Math.random() * 0.55,
        flicker: Math.random() * Math.PI * 2,
        color:   emberColors[Math.floor(Math.random() * emberColors.length)],
        wobble:  Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
      };
    }

    function drawEmbers() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embers.forEach((e, idx) => {
        e.flicker  += 0.04;
        e.wobble   += e.wobbleSpeed;
        e.y        += e.speedY;
        e.x        += e.speedX + Math.sin(e.wobble) * 0.3;

        const flicker = e.opacity * (0.7 + Math.sin(e.flicker) * 0.3);

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `${e.color}${flicker})`;
        ctx.shadowColor = e.color + '0.8)';
        ctx.shadowBlur  = e.size * 3;
        ctx.fill();

        // Reset when off screen
        if (e.y > canvas.height + 10) {
          embers[idx] = createEmber(canvas, true);
          embers[idx].x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(drawEmbers);
    }

    drawEmbers();
  }

  // --- "You are not alone" counter ---
  function initAloneCounter() {
    const counter = document.createElement('div');
    counter.id    = 'alone-counter';
    counter.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.65rem;
      color: #3a0000;
      letter-spacing: 0.15em;
      z-index: 9000;
      pointer-events: none;
      line-height: 1.8;
      transition: color 0.5s;
    `;
    counter.innerHTML = `
      <div id="alone-status">CHECKING OCCUPANCY...</div>
      <div id="alone-count" style="color:#5a0000;">— OBSERVERS PRESENT</div>
    `;
    document.body.appendChild(counter);

    let count    = 0;
    let maxCount = 8 + Math.floor(Math.random() * 24);

    // Slowly increment the observer count
    function incrementCount() {
      if (count < maxCount) {
        count++;
        const countEl  = document.getElementById('alone-count');
        const statusEl = document.getElementById('alone-status');
        if (!countEl || !statusEl) return;

        countEl.textContent  = `${count} OBSERVER${count !== 1 ? 'S' : ''} PRESENT`;
        counter.style.color  = count > 10
          ? 'rgba(139,0,0,0.7)'
          : 'rgba(80,0,0,0.6)';
        countEl.style.color  = count > 15
          ? '#dc143c'
          : count > 8
            ? '#8b0000'
            : '#5a0000';

        statusEl.textContent = count > 15
          ? 'YOU ARE NOT ALONE'
          : count > 5
            ? 'OTHERS ARE WATCHING'
            : 'CHECKING OCCUPANCY...';
      }

      // Occasionally decrement to feel organic
      if (Math.random() < 0.12 && count > 1) {
        count--;
        const countEl = document.getElementById('alone-count');
        if (countEl) {
          countEl.textContent = `${count} OBSERVER${count !== 1 ? 'S' : ''} PRESENT`;
        }
      }

      const nextTick = 4000 + Math.random() * 8000;
      setTimeout(incrementCount, nextTick);
    }

    setTimeout(incrementCount, 3000);
  }

  // --- Card text scramble on scroll into view ---
  function initCardScrollScramble() {
    const chars = '∅⊗⊘⌬⍙ᚠᚢ△▽◈!@#$%^&*';

    function scrambleEl(el) {
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = 'true';

      const original = el.textContent;
      let   ticks    = 0;
      const max      = 8;

      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map(c => c === ' ' ? ' '
            : Math.random() < 0.5
              ? chars[Math.floor(Math.random() * chars.length)]
              : c)
          .join('');
        ticks++;
        if (ticks >= max) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 55);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const name = card.querySelector('.card-name, .card-title');
        const desc = card.querySelector('.card-desc');
        if (name) setTimeout(() => scrambleEl(name), 80);
        if (desc) setTimeout(() => scrambleEl(desc), 200);
        observer.unobserve(card);
      });
    }, { threshold: 0.2 });

    // Observe all shop cards and preview cards
    function observeCards() {
      document.querySelectorAll('.shop-card, .preview-card').forEach(card => {
        observer.observe(card);
      });
    }

    // Cards may not exist yet on DOMContentLoaded — retry briefly
    observeCards();
    setTimeout(observeCards, 800);
    setTimeout(observeCards, 2000);
  }

  // --- Expose globally ---
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
    initLightning();
    initFallingEmbers();
    initAloneCounter();
    initCardScrollScramble();
    setTimeout(initPreviewGrid, 100);
  }

  window.addEventListener('DOMContentLoaded', init);

})();