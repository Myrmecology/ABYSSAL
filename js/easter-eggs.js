/* ============================================
   ABYSSAL — easter-eggs.js
   UPDATED: single unified RAF loop for
   cursor trail + crosshair — no lag, no delay
   ============================================ */

(function () {

  // --- Konami Code sequence ---
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let konamiIndex = 0;

  // --- Easter egg messages ---
  const eggMessages = [
    'YOU FOUND US.\n\nWe were not hiding.',
    'THIS PAGE DOES NOT EXIST.\n\nYou are not here.\nWe are not here.\nContinue.',
    'SESSION DURATION: TOO LONG.\n\nYou should leave.\nYou will not leave.',
    'WE HAVE BEEN WATCHING.\n\nNot through your camera.\n\nThrough the other one.',
    'CONGRATULATIONS.\n\nYour curiosity has been logged.\nYour curiosity has been sold.',
    'YOU ARE THE 1.\n\nThere is no number after that.',
    'THE VOID RECOGNIZES YOU.\n\nIt says you have been here before.\nYou have no memory of this.\nThat is by design.',
  ];

  let eggIndex = 0;

  // --- Show egg overlay ---
  function showEgg(message) {
    const overlay = document.getElementById('egg-overlay');
    const msgEl   = document.getElementById('egg-message');
    if (!overlay || !msgEl) return;

    msgEl.textContent = message;
    overlay.classList.add('active');
    if (window.AbyssalAudio) window.AbyssalAudio.playEasterEgg();

    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
    }, { once: true });

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 8000);
  }

  // --- Konami code ---
  function initKonami() {
    document.addEventListener('keydown', (e) => {
      if (e.key === KONAMI[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0;
          triggerKonamiEgg();
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function triggerKonamiEgg() {
    if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
    document.body.classList.add('static-burst');
    setTimeout(() => document.body.classList.remove('static-burst'), 600);
    setTimeout(() => {
      showEgg('KONAMI SEQUENCE ACCEPTED.\n\nThis changes nothing.\n\nOr everything.\n\nWe have not decided yet.');
    }, 700);
    scramblePageText();
  }

  // --- Hidden dot trigger ---
  function initDotTrigger() {
    const dot = document.getElementById('egg-trigger');
    if (!dot) return;

    let clickCount = 0;
    dot.addEventListener('click', () => {
      clickCount++;
      if (window.AbyssalAudio) window.AbyssalAudio.playHover();
      if (clickCount === 3) {
        clickCount = 0;
        const msg = eggMessages[eggIndex % eggMessages.length];
        eggIndex++;
        showEgg(msg);
      }
    });
  }

  // --- Logo click sequence ---
  function initLogoSequence() {
    const logo = document.querySelector('.header-glitch');
    if (!logo) return;

    let clicks = 0;
    let timer  = null;

    logo.addEventListener('click', () => {
      clicks++;
      if (window.AbyssalAudio) window.AbyssalAudio.playHover();
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 3000);
      if (clicks >= 5) {
        clicks = 0;
        clearTimeout(timer);
        triggerLogoEgg();
      }
    });
  }

  function triggerLogoEgg() {
    if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
      document.body.style.filter = '';
      showEgg('YOU KEEP CLICKING.\n\nWe keep watching.\n\nOne of us will stop first.\n\nIt will not be us.');
    }, 500);
  }

  // --- Warning block hold ---
  function initWarningHold() {
    const warning = document.querySelector('.warning-block');
    if (!warning) return;

    let holdTimer = null;
    let holding   = false;

    warning.addEventListener('mousedown', () => {
      holding   = true;
      holdTimer = setTimeout(() => {
        if (holding) triggerWarningEgg();
      }, 3000);
    });
    warning.addEventListener('mouseup',    () => { holding = false; clearTimeout(holdTimer); });
    warning.addEventListener('mouseleave', () => { holding = false; clearTimeout(holdTimer); });
  }

  function triggerWarningEgg() {
    if (window.AbyssalAudio) window.AbyssalAudio.playCheckout();
    showEgg('YOU HELD ON.\n\nMost people let go.\n\nWe have noted your persistence.\n\nIt has been added to your file.');
  }

  // --- Idle watcher ---
  function initIdleWatcher() {
    let idleTimer = null;
    let triggered = false;

    function resetIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!triggered) {
          triggered = true;
          triggerIdleEgg();
          setTimeout(() => { triggered = false; }, 60000);
        }
      }, 30000);
    }

    ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt => {
      document.addEventListener(evt, resetIdle);
    });
    resetIdle();
  }

  function triggerIdleEgg() {
    const overlay = document.getElementById('egg-overlay');
    const msgEl   = document.getElementById('egg-message');
    if (!overlay || !msgEl) return;

    const msg = 'YOU STOPPED MOVING.\n\nWe noticed immediately.\n\nAre you still there?\n\n...Good.';
    msgEl.textContent = '';
    overlay.classList.add('active');
    if (window.AbyssalAudio) window.AbyssalAudio.playEasterEgg();

    let i = 0;
    const interval = setInterval(() => {
      msgEl.textContent = msg.slice(0, i);
      i++;
      if (i > msg.length) {
        clearInterval(interval);
        setTimeout(() => overlay.classList.remove('active'), 5000);
      }
    }, 55);

    overlay.addEventListener('click', () => {
      clearInterval(interval);
      overlay.classList.remove('active');
    }, { once: true });
  }

  // --- Whisper link ---
  function initWhisperLink() {
    const link = document.getElementById('nav-whisper');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.AbyssalAudio) window.AbyssalAudio.playEasterEgg();
      showEgg('THE WHISPER CHANNEL IS OFFLINE.\n\nOr it is listening.\n\nWe cannot tell the difference anymore.');
    });
  }

  // --- About link ---
  function initAboutLink() {
    const link = document.getElementById('nav-about');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
      showEgg('ABYSSAL WAS FOUNDED IN A YEAR WE DO NOT ACKNOWLEDGE.\n\nWe sell what cannot be explained.\n\nWe do not explain it.\n\nThat is the service.');
    });
  }

  // --- Text scramble utility ---
  function scramblePageText() {
    const chars = '!@#$%^&*∅⊗⊘⌬⍙ᚠᚢ△▽◈';
    const els   = document.querySelectorAll('p, h1, h2, .nav-link, .card-name, .card-title');

    els.forEach(el => {
      const original = el.textContent;
      let ticks      = 0;
      const max      = 10;

      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map(c => c === ' ' ? ' ' : (Math.random() < 0.4
            ? chars[Math.floor(Math.random() * chars.length)]
            : c))
          .join('');
        ticks++;
        if (ticks >= max) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 60);
    });
  }

  // --- Symbol sequence easter egg ---
  function initSymbolSequence() {
    const TARGET_SEQUENCE = ['⊕', '△', 'ᚠ'];
    let sequence = [];
    let seqTimer = null;

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.classList.contains('holo-symbol')) return;

      const sym = target.textContent.trim();
      if (TARGET_SEQUENCE.includes(sym)) {
        sequence.push(sym);
        clearTimeout(seqTimer);
        seqTimer = setTimeout(() => { sequence = []; }, 8000);

        if (sequence.length === TARGET_SEQUENCE.length) {
          const match = sequence.every((s, i) => s === TARGET_SEQUENCE[i]);
          sequence = [];
          if (match) triggerSymbolEgg();
        }
      }
    });
  }

  function triggerSymbolEgg() {
    if (window.AbyssalAudio) window.AbyssalAudio.playCheckout();
    scramblePageText();
    setTimeout(() => {
      showEgg('SEQUENCE ACCEPTED.\n\nThe symbols chose you before you chose them.\n\nYou may proceed.\n\nWe do not know where.');
    }, 800);
  }

  // =============================================
  // UNIFIED CURSOR SYSTEM
  // One single RAF loop handles both the
  // crosshair and the trail — zero contention
  // =============================================

  // Shared mouse state
  let mouseX = -200;
  let mouseY = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // --- Build crosshair ---
  function buildCrosshair() {
    // Hide system cursor everywhere
    const style       = document.createElement('style');
    style.textContent = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const el  = document.createElement('div');
    el.id     = 'abyssal-cursor';
    el.style.cssText = `
      position: fixed;
      width: 28px;
      height: 28px;
      pointer-events: none;
      z-index: 9999999;
      transform: translate(-50%, -50%);
      will-change: left, top;
      left: -200px;
      top: -200px;
    `;

    el.innerHTML = `
      <svg id="cursor-svg" width="28" height="28"
           viewBox="0 0 28 28"
           xmlns="http://www.w3.org/2000/svg"
           style="overflow:visible; display:block;">
        <circle id="cursor-ring-outer" cx="14" cy="14" r="12"
          fill="none"
          stroke="rgba(220,20,60,0.6)"
          stroke-width="1"
          stroke-dasharray="6 4"
        />
        <circle id="cursor-ring-inner" cx="14" cy="14" r="6"
          fill="none"
          stroke="rgba(255,60,60,0.9)"
          stroke-width="1"
        />
        <line x1="14" y1="0"  x2="14" y2="7"
          stroke="rgba(255,40,40,0.85)" stroke-width="1"/>
        <line x1="14" y1="21" x2="14" y2="28"
          stroke="rgba(255,40,40,0.85)" stroke-width="1"/>
        <line x1="0"  y1="14" x2="7"  y2="14"
          stroke="rgba(255,40,40,0.85)" stroke-width="1"/>
        <line x1="21" y1="14" x2="28" y2="14"
          stroke="rgba(255,40,40,0.85)" stroke-width="1"/>
        <circle cx="14" cy="14" r="1.5"
          fill="rgba(255,60,60,1)"
        />
      </svg>
    `;

    document.body.appendChild(el);

    // Click pulse
    document.addEventListener('mousedown', () => {
      const svg = document.getElementById('cursor-svg');
      if (svg) {
        svg.style.transition = 'transform 0.08s ease';
        svg.style.transform  = 'scale(0.65)';
        setTimeout(() => {
          svg.style.transform = 'scale(1)';
        }, 120);
      }
    }, { passive: true });

    return el;
  }

  // --- Build trail dots ---
  function buildTrail() {
    const trail  = [];
    const COUNT  = 10;
    const colors = [
      '255, 30,  30',
      '220, 20,  60',
      '180, 0,   0',
      '139, 0,   0',
      '100, 0,   0',
    ];

    for (let i = 0; i < COUNT; i++) {
      const colorIdx = Math.floor((i / COUNT) * colors.length);
      const baseSize = Math.max(2, 9 - i * 0.65);
      const opacity  = Math.max(0.06, 0.9 - i * 0.08);

      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        width: ${baseSize}px;
        height: ${baseSize}px;
        background: rgba(${colors[colorIdx]}, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999990;
        box-shadow:
          0 0 ${baseSize * 2}px rgba(255,30,30,${opacity * 0.9}),
          0 0 ${baseSize * 4}px rgba(220,20,60,${opacity * 0.55}),
          0 0 ${baseSize * 6}px rgba(139,0,0,${opacity * 0.25});
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
        will-change: left, top;
        left: -200px;
        top: -200px;
      `;
      document.body.appendChild(dot);
      trail.push({ el: dot, x: -200, y: -200 });
    }

    return trail;
  }

  // --- Unified cursor RAF loop ---
  function initUnifiedCursorLoop(crosshair, trail) {
    let angle  = 0;
    let breathT = 0;

    function loop() {
      // ---- Crosshair: snap directly to mouse ----
      crosshair.style.left = mouseX + 'px';
      crosshair.style.top  = mouseY + 'px';

      // Rotate rings
      angle   += 0.55;
      breathT += 0.022;

      const outerRing = document.getElementById('cursor-ring-outer');
      const innerRing = document.getElementById('cursor-ring-inner');
      const svg       = document.getElementById('cursor-svg');

      if (outerRing) outerRing.setAttribute('transform', `rotate(${angle}, 14, 14)`);
      if (innerRing) innerRing.setAttribute('transform', `rotate(${-angle * 0.5}, 14, 14)`);

      // Breathe scale on SVG
      if (svg && !svg.style.transition) {
        const s = 1.0 + Math.sin(breathT) * 0.10;
        svg.style.transform = `scale(${s})`;
      }

      // ---- Trail: each dot chases the one before ----
      // Dot 0 chases real mouse very tightly
      trail[0].x += (mouseX - trail[0].x) * 0.72;
      trail[0].y += (mouseY - trail[0].y) * 0.72;
      trail[0].el.style.left = trail[0].x + 'px';
      trail[0].el.style.top  = trail[0].y + 'px';

      for (let i = 1; i < trail.length; i++) {
        const lag  = Math.max(0.38 - i * 0.025, 0.10);
        trail[i].x += (trail[i - 1].x - trail[i].x) * lag;
        trail[i].y += (trail[i - 1].y - trail[i].y) * lag;
        trail[i].el.style.left = trail[i].x + 'px';
        trail[i].el.style.top  = trail[i].y + 'px';
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  // --- Wire it all together ---
  function initCursorSystem() {
    const crosshair = buildCrosshair();
    const trail     = buildTrail();
    initUnifiedCursorLoop(crosshair, trail);
  }

  // --- Boot ---
  function init() {
    initKonami();
    initDotTrigger();
    initLogoSequence();
    initWarningHold();
    initIdleWatcher();
    initWhisperLink();
    initAboutLink();
    initCursorSystem();
    initSymbolSequence();
  }

  window.addEventListener('DOMContentLoaded', init);

})();