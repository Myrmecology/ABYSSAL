/* ============================================
   ABYSSAL — main.js
   Core init, orchestration, global behaviors
   ============================================ */

(function () {

  // --- Global state ---
  window.ABYSSAL = {
    version:   '1.0.0',
    sessionId: generateSessionId(),
    startTime: Date.now(),
  };

  // --- Generate fake session ID ---
  function generateSessionId() {
    const chars = 'ABCDEF0123456789';
    return Array.from({ length: 16 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  // --- Console greeting ---
  function initConsoleGreeting() {
    const styles = [
      'color: #8b0000; font-size: 1.2rem; font-weight: bold;',
      'color: #aaaaaa; font-size: 0.85rem;',
      'color: #4a0000; font-size: 0.75rem;',
    ];
    console.log('%cABYSSAL', styles[0]);
    console.log('%cyou were not supposed to look here.', styles[1]);
    console.log(`%csession: ${window.ABYSSAL.sessionId}`, styles[2]);
    console.log('%cwe see you.', styles[2]);
  }

  // --- Prevent right click (with theatrical message) ---
  function initRightClickBlock() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();

      const msg = document.createElement('div');
      msg.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        background: #050505;
        border: 1px solid #8b0000;
        color: #8b0000;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        padding: 0.5rem 1rem;
        z-index: 999999;
        pointer-events: none;
        white-space: nowrap;
      `;
      msg.textContent = 'THIS AREA IS NOT FOR YOU';
      document.body.appendChild(msg);
      setTimeout(() => {
        if (msg.parentNode) msg.parentNode.removeChild(msg);
      }, 1800);
    });
  }

  // --- Page visibility: react when user tabs away ---
  function initVisibilityWatch() {
    let tabAwayTime = null;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        tabAwayTime = Date.now();
        document.title = 'do not leave.';
      } else {
        document.title = 'ABYSSAL';
        if (!tabAwayTime) return;

        const away = Math.floor((Date.now() - tabAwayTime) / 1000);
        tabAwayTime = null;

        if (away > 5) {
          setTimeout(() => {
            const overlay  = document.getElementById('egg-overlay');
            const msgEl    = document.getElementById('egg-message');
            if (!overlay || !msgEl) return;

            const msgs = [
              `YOU WERE GONE FOR ${away} SECONDS.\n\nWe counted.\n\nWe always count.`,
              `WE NOTICED YOU LEFT.\n\nThings happened while you were away.\n\nWe will not say what things.`,
              `WELCOME BACK.\n\nYour session was not paused.\n\nOnly you were.`,
            ];
            msgEl.textContent = msgs[Math.floor(Math.random() * msgs.length)];
            overlay.classList.add('active');
            if (window.AbyssalAudio) window.AbyssalAudio.playEasterEgg();

            setTimeout(() => overlay.classList.remove('active'), 6000);
            overlay.addEventListener('click', () => {
              overlay.classList.remove('active');
            }, { once: true });
          }, 800);
        }
      }
    });
  }

  // --- Scroll-based reveal ---
  function initScrollReveal() {
    const els = document.querySelectorAll(
      '.warning-block, .featured-preview, .section-title, .preview-card'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(el => observer.observe(el));
  }

  // --- Noise layer animation refresh ---
  function initNoiseRefresh() {
    const noise = document.querySelector('.noise');
    if (!noise) return;
    setInterval(() => {
      const x = (Math.random() * 10 - 5).toFixed(1);
      const y = (Math.random() * 10 - 5).toFixed(1);
      noise.style.transform = `translate(${x}%, ${y}%)`;
    }, 120);
  }

  // --- Random page-wide glitch moment ---
  function initRandomGlitch() {
    function scheduleGlitch() {
      const delay = 15000 + Math.random() * 25000;
      setTimeout(() => {
        triggerPageGlitch();
        scheduleGlitch();
      }, delay);
    }
    scheduleGlitch();
  }

  function triggerPageGlitch() {
    if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();

    const wrapper = document.querySelector('.site-wrapper');
    if (!wrapper) return;

    let ticks = 0;
    const max = 6;
    const interval = setInterval(() => {
      const x = (Math.random() * 10 - 5).toFixed(0);
      const y = (Math.random() * 4  - 2).toFixed(0);
      wrapper.style.transform = `translate(${x}px, ${y}px)`;
      wrapper.style.filter    =
        ticks % 2 === 0
          ? 'hue-rotate(15deg) brightness(1.1)'
          : 'hue-rotate(-15deg) brightness(0.95)';
      ticks++;
      if (ticks >= max) {
        clearInterval(interval);
        wrapper.style.transform = '';
        wrapper.style.filter    = '';
      }
    }, 60);
  }

  // --- Fake session timer in footer ---
  function initSessionTimer() {
    const el = document.querySelector('.footer-text');
    if (!el) return;

    const base = el.textContent;
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - window.ABYSSAL.startTime) / 1000);
      const mins    = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs    = String(elapsed % 60).padStart(2, '0');
      const year    = new Date().getFullYear();
      el.textContent =
        `© ABYSSAL — ${year} — SESSION: ${mins}:${secs} — ALL SALES ARE FINAL. ALL SALES ARE PERMANENT.`;
    }, 1000);
  }

  // --- Keyboard shortcut: press [ to toggle mute ---
  function initMuteToggle() {
    let muted = false;
    document.addEventListener('keydown', (e) => {
      if (e.key === '[') {
        muted = !muted;
        const gain = window.AbyssalAudio && window.AbyssalAudio.masterGain;
        if (gain) gain.gain.value = muted ? 0 : 0.45;

        const indicator = document.createElement('div');
        indicator.style.cssText = `
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: #050505;
          border: 1px solid #8b0000;
          color: #8b0000;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          padding: 0.4rem 1.2rem;
          z-index: 999999;
          pointer-events: none;
        `;
        indicator.textContent = muted ? '[ SILENCE ]' : '[ SOUND RESTORED ]';
        document.body.appendChild(indicator);
        setTimeout(() => {
          if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
        }, 1500);
      }
    });
  }

  // --- Expose triggerPageGlitch globally ---
  window.AbyssalMain = {
    triggerPageGlitch
  };

  // --- Boot sequence ---
  function init() {
    initConsoleGreeting();
    initRightClickBlock();
    initVisibilityWatch();
    initScrollReveal();
    initNoiseRefresh();
    initRandomGlitch();
    initSessionTimer();
    initMuteToggle();
  }

  window.addEventListener('DOMContentLoaded', init);

})();