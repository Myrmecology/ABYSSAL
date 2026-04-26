/* ============================================
   ABYSSAL — symbols.js
   Floating holographic symbols layer
   ============================================ */

(function () {

  // --- Symbol sets (non-demonic, abstract, arcane) ---
  const symbols = [
    // Alchemical
    '⊕', '⊗', '⊘', '⊙', '⊛', '⊜', '⊝',
    // Geometric
    '△', '▽', '◈', '◎', '❖', '⬡', '⬢',
    // Astronomical
    '☽', '☿', '♄', '♅', '♆', '⊹', '✦',
    // Runic-style
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ',
    // Mathematical arcane
    '∰', '∲', '∳', '⨁', '⨂', '⨀', '⨋',
    // Misc arcane
    '⌬', '⍙', '⍜', '⎔', '⏣', '⌘', '⌖'
  ];

  const layer = document.getElementById('symbols-layer');
  if (!layer) return;

  const activeSymbols = [];
  const COUNT = 28;

  // --- Create a symbol element ---
  function createSymbol() {
    const el = document.createElement('div');
    el.classList.add('holo-symbol');

    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    el.textContent = sym;

    // Random position
    const x = Math.random() * 92 + 2;
    const y = Math.random() * 92 + 2;
    el.style.left = x + '%';
    el.style.top  = y + '%';

    // Random size
    const size = 1.4 + Math.random() * 2.8;
    el.style.fontSize = size + 'rem';

    // Random animation duration & delay
    const duration = 8 + Math.random() * 18;
    const delay    = Math.random() * 12;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay   = '-' + delay + 's';

    // Random color tint
    const tints = [
      'rgba(68,136,170,0.35)',
      'rgba(139,0,0,0.35)',
      'rgba(192,192,192,0.25)',
      'rgba(220,20,60,0.25)',
      'rgba(100,140,160,0.3)'
    ];
    const tint = tints[Math.floor(Math.random() * tints.length)];
    el.style.webkitTextStroke = `1px ${tint}`;
    el.style.textShadow = `0 0 14px ${tint}, 0 0 35px ${tint}`;

    // Chromatic aberration on some
    if (Math.random() < 0.3) {
      el.style.filter = 'blur(0.6px)';
    }

    layer.appendChild(el);
    return el;
  }

  // --- Populate symbols ---
  function populateSymbols() {
    for (let i = 0; i < COUNT; i++) {
      const el = createSymbol();
      activeSymbols.push(el);
    }
  }

  // --- Slowly cycle symbols (replace random one every few seconds) ---
  function cycleSymbol() {
    if (activeSymbols.length === 0) return;

    const index = Math.floor(Math.random() * activeSymbols.length);
    const old   = activeSymbols[index];

    // Fade out
    old.style.transition = 'opacity 1.5s';
    old.style.opacity    = '0';

    setTimeout(() => {
      if (old.parentNode) old.parentNode.removeChild(old);
      const fresh = createSymbol();
      fresh.style.opacity    = '0';
      fresh.style.transition = 'opacity 2s';
      activeSymbols[index]   = fresh;

      requestAnimationFrame(() => {
        setTimeout(() => { fresh.style.opacity = '1'; }, 50);
      });
    }, 1500);
  }

  // --- Holographic scan line effect per symbol on mouse proximity ---
  function initProximityEffect() {
    document.addEventListener('mousemove', (e) => {
      const mx = e.clientX;
      const my = e.clientY;

      activeSymbols.forEach(sym => {
        if (!sym || !sym.getBoundingClientRect) return;
        const rect = sym.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);

        if (dist < 140) {
          const intensity = 1 - dist / 140;
          sym.style.opacity  = 0.18 + intensity * 0.65;
          sym.style.filter   = `blur(0px) brightness(${1 + intensity * 1.8})`;
          sym.style.transform = `scale(${1 + intensity * 0.35})`;
        } else {
          sym.style.opacity   = '';
          sym.style.filter    = '';
          sym.style.transform = '';
        }
      });
    });
  }

  // --- Click a symbol: explode it ---
  function initClickEffect() {
    layer.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.classList.contains('holo-symbol')) return;

      // Sound
      if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();

      // Explode animation
      target.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      target.style.transform  = 'scale(4)';
      target.style.opacity    = '0';

      // Spawn ring
      spawnRing(e.clientX, e.clientY);

      // Replace after explosion
      setTimeout(() => {
        const idx = activeSymbols.indexOf(target);
        if (idx !== -1) {
          if (target.parentNode) target.parentNode.removeChild(target);
          const fresh = createSymbol();
          activeSymbols[idx] = fresh;
        }
      }, 600);
    });
  }

  // --- Spawn expanding ring at position ---
  function spawnRing(x, y) {
    const ring = document.createElement('div');
    ring.classList.add('ring');
    ring.style.position = 'fixed';
    ring.style.left     = (x - 30) + 'px';
    ring.style.top      = (y - 30) + 'px';
    ring.style.width    = '60px';
    ring.style.height   = '60px';
    ring.style.zIndex   = '9990';
    document.body.appendChild(ring);
    setTimeout(() => { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 2100);
  }

  // --- Random symbol glitch burst ---
  function randomGlitchBurst() {
    if (activeSymbols.length === 0) return;

    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * activeSymbols.length);
      const sym = activeSymbols[idx];
      if (!sym) continue;

      const orig = sym.textContent;
      let flickers = 0;
      const max = 5 + Math.floor(Math.random() * 6);

      const flicker = setInterval(() => {
        sym.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        flickers++;
        if (flickers >= max) {
          clearInterval(flicker);
          sym.textContent = orig;
        }
      }, 80);
    }
  }

  // --- Boot ---
  function init() {
    populateSymbols();
    initProximityEffect();
    initClickEffect();

    // Cycle a symbol every 6-12 seconds
    setInterval(cycleSymbol, 7000 + Math.random() * 5000);

    // Random glitch burst every 8-20 seconds
    setInterval(randomGlitchBurst, 9000 + Math.random() * 11000);
  }

  window.addEventListener('DOMContentLoaded', init);

})();