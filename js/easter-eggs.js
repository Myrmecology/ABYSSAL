/* ============================================
   ABYSSAL — easter-eggs.js
   Hidden interactions, secrets, Konami code
   UPDATED: brighter cursor trail
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

  // --- Konami code listener ---
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
      let ticks = 0;
      const max = 10;

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

  // --- Cursor trail (UPDATED — much brighter) ---
  function initCursorTrail() {
    const trail = [];
    const COUNT = 12;

    const colors = [
      '255, 30,  30',
      '220, 20,  60',
      '180, 0,   0',
      '139, 0,   0',
      '100, 0,   0',
    ];

    for (let i = 0; i < COUNT; i++) {
      const dot       = document.createElement('div');
      const colorIdx  = Math.floor((i / COUNT) * colors.length);
      const baseSize  = Math.max(2, 11 - i * 0.7);
      const opacity   = Math.max(0.08, 1.0 - i * 0.075);

      dot.style.cssText = `
        position: fixed;
        width: ${baseSize}px;
        height: ${baseSize}px;
        background: rgba(${colors[colorIdx]}, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999;
        box-shadow:
          0 0 ${baseSize * 2}px rgba(255, 30, 30, ${opacity * 0.9}),
          0 0 ${baseSize * 4}px rgba(220, 20, 60, ${opacity * 0.6}),
          0 0 ${baseSize * 7}px rgba(139, 0, 0,   ${opacity * 0.3});
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
        will-change: left, top;
      `;
      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateTrail() {
      let lx = mouseX;
      let ly = mouseY;

      trail.forEach((dot, i) => {
        const lag  = 0.32 - i * 0.018;
        dot.x     += (lx - dot.x) * Math.max(lag, 0.05);
        dot.y     += (ly - dot.y) * Math.max(lag, 0.05);
        dot.el.style.left = dot.x + 'px';
        dot.el.style.top  = dot.y + 'px';
        lx = dot.x;
        ly = dot.y;
      });

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
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

  // --- Boot ---
  function init() {
    initKonami();
    initDotTrigger();
    initLogoSequence();
    initWarningHold();
    initIdleWatcher();
    initWhisperLink();
    initAboutLink();
    initCursorTrail();
    initSymbolSequence();
  }

  window.addEventListener('DOMContentLoaded', init);

})();