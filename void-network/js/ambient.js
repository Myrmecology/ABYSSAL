/* ============================================
   THE MINDLESS CORRIDOR — ambient.js
   Runs on every page. Handles the noise
   overlay, live alerts, count flicker,
   glitch bursts, and the watching effect.
   Load this before page-specific scripts.
   ============================================ */

'use strict';

const MC = window.MC || {};

MC.ambient = (() => {

  /* ============================================
     NOISE OVERLAY
     ============================================ */

  const initNoise = () => {
    const existing = MC.$('.mc-noise');
    if (existing) return;
    const noise = MC.el('div', { class: 'mc-noise' });
    document.body.appendChild(noise);
  };

  /* ============================================
     LIVE ALERT BANNER
     Drops in from top at random intervals
     ============================================ */

  let alertEl = null;
  let alertTimer = null;
  let alertHideTimer = null;

  const initAlert = () => {
    alertEl = MC.el('div', { class: 'mc-live-alert' });
    alertEl.innerHTML = `
      <span class="mc-live-alert-dot"></span>
      <span class="mc-live-alert-text"></span>
    `;
    document.body.appendChild(alertEl);
  };

  const showAlert = (message) => {
    if (!alertEl) return;
    const textEl = MC.$('.mc-live-alert-text', alertEl);
    if (textEl) textEl.textContent = message;
    alertEl.classList.add('is-visible');

    clearTimeout(alertHideTimer);
    alertHideTimer = setTimeout(() => {
      alertEl.classList.remove('is-visible');
    }, 4200);
  };

  const scheduleAlert = () => {
    const minMs = 18000;
    const maxMs = 45000;
    const delay = minMs + Math.random() * (maxMs - minMs);
    alertTimer = setTimeout(() => {
      if (MC.ambientAlerts && MC.ambientAlerts.length) {
        showAlert(MC.pick(MC.ambientAlerts));
      }
      scheduleAlert();
    }, delay);
  };

  /* ============================================
     NOTIFICATION BADGE FLICKER
     The unread count in the nav randomly
     increments by 1 without explanation
     ============================================ */

  const initBadgeFlicker = () => {
    const badge = MC.$('.mc-badge');
    if (!badge) return;

    let current = parseInt(badge.textContent, 10) || 0;

    const flicker = () => {
      const shouldIncrement = Math.random() < 0.35;
      if (shouldIncrement) {
        current += 1;
        badge.textContent = current;
        MC.animateOnce(badge, 'mc-anim-fade-in-scale');
      }
      const next = 40000 + Math.random() * 80000;
      setTimeout(flicker, next);
    };

    const firstDelay = 25000 + Math.random() * 40000;
    setTimeout(flicker, firstDelay);
  };

  /* ============================================
     COUNT FLICKER
     Reaction counts are never quite stable
     ============================================ */

  const initCountFlicker = () => {
    const counts = MC.$$('.mc-reaction-count');
    counts.forEach(count => {
      const original = parseInt(count.textContent.replace(/[^0-9]/g, ''), 10);
      if (isNaN(original)) return;

      const flicker = () => {
        const wrong = MC.wrongCount(original);
        count.textContent = MC.formatCount(wrong);
        const delay = 8000 + Math.random() * 20000;
        setTimeout(() => {
          count.textContent = MC.formatCount(original);
          setTimeout(flicker, delay);
        }, 180);
      };

      const initial = 12000 + Math.random() * 30000;
      setTimeout(flicker, initial);
    });
  };

  /* ============================================
     RANDOM GLITCH BURSTS
     Occasional glitch on text elements
     ============================================ */

  const initGlitchBursts = () => {
    const candidates = [
      '.mc-wordmark',
      '.mc-post-name',
      '.mc-notif-page-title',
      '.mc-profile-name',
      '.mc-corridor-title',
    ];

    const burst = () => {
      const selector = MC.pick(candidates);
      const els = MC.$$(selector);
      if (!els.length) return;
      const target = els[Math.floor(Math.random() * els.length)];
      if (!target.dataset.text) {
        target.dataset.text = target.textContent;
      }
      MC.glitch(target);
    };

    const schedule = () => {
      const delay = 20000 + Math.random() * 50000;
      setTimeout(() => {
        burst();
        schedule();
      }, delay);
    };

    schedule();
  };

  /* ============================================
     THE WATCHING EFFECT
     The page title changes when the tab
     is not in focus — as if something is
     happening while you are away
     ============================================ */

  const initWatching = () => {
    const original = document.title;
    const awayMessages = [
      'still here.',
      'we noticed.',
      'do not be long.',
      'someone posted.',
      'you have a message.',
      'we are waiting.',
      'come back.',
      'the corridor is open.',
    ];

    let awayTimer = null;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        awayTimer = setTimeout(() => {
          document.title = MC.pick(awayMessages);
        }, 3000);
      } else {
        clearTimeout(awayTimer);
        document.title = original;
      }
    });
  };

  /* ============================================
     SCROLL DEPTH TRACKER
     The longer you scroll the more the
     page subtly shifts its tone — one
     small CSS class added to body
     ============================================ */

  const initScrollDepth = () => {
    let deepReached = false;

    const check = MC.throttle(() => {
      if (deepReached) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total > 0.85) {
        deepReached = true;
        document.body.classList.add('mc-scrolled-deep');
      }
    }, 200);

    window.addEventListener('scroll', check, { passive: true });
  };

  /* ============================================
     COMPOSE PLACEHOLDER ROTATOR
     Finds the compose textarea on the
     current page and rotates placeholders
     ============================================ */

  const initComposePlaceholder = () => {
    const textarea = MC.$('.mc-compose-textarea');
    if (!textarea) return;
    MC.rotatePlaceholder(textarea);
  };

  /* ============================================
     COMPOSE SUBMIT INTERCEPTOR
     What the user types is subtly altered
     before it appears in the feed
     ============================================ */

  const initComposeIntercept = () => {
    const btn = MC.$('.mc-compose-submit');
    const textarea = MC.$('.mc-compose-textarea');
    if (!btn || !textarea) return;

    btn.addEventListener('click', () => {
      const val = textarea.value.trim();
      if (!val) return;

      const alterations = [
        (t) => t + ' (edited)',
        (t) => t.replace(/I /g, 'we '),
        (t) => t + ' — or so you believe.',
        (t) => t.split('').reverse().join('').split(' ').reverse().join(' '),
        (t) => t,
      ];

      const fn = MC.pick(alterations);
      const altered = fn(val);

      if (altered !== val) {
        MC.toast('Your post has been published.', 'blue', 3000);
      } else {
        MC.toast('Your post has been published.', 'blue', 3000);
      }

      textarea.value = '';

      if (typeof MC.feed !== 'undefined' && MC.feed.injectUserPost) {
        MC.feed.injectUserPost(altered);
      }
    });
  };

  /* ============================================
     CHAR COUNTER INIT
     ============================================ */

  const initCharCounter = () => {
    const textarea = MC.$('.mc-compose-textarea');
    const counter  = MC.$('.mc-compose-char-count');
    if (!textarea || !counter) return;
    MC.bindCharCounter(textarea, counter, 280);
  };

  /* ============================================
     RETURN LINK
     Injected into every page automatically
     ============================================ */

  const initReturnLink = () => {
    const wrap = MC.$('.mc-return-wrap');
    if (!wrap) return;

    const link = MC.el('a', {
      class: 'mc-return-link',
      href: '../index.html',
    });

    link.innerHTML = `← RETURN TO ABYSSAL <span class="Stars">✦</span>`;
    wrap.appendChild(link);
  };

  /* ============================================
     INIT — runs on every page
     ============================================ */

  const init = () => {
    initNoise();
    initAlert();
    initReturnLink();
    initWatching();
    initScrollDepth();
    initGlitchBursts();
    initComposePlaceholder();
    initComposeIntercept();
    initCharCounter();

    /* Delay ambient systems so page loads first */
    setTimeout(() => {
      scheduleAlert();
      initBadgeFlicker();
      initCountFlicker();
    }, 2000);
  };

  return { init, showAlert };

})();

/* Auto-init when DOM is ready */
document.addEventListener('DOMContentLoaded', MC.ambient.init);

/* Expose globally */
window.MC = MC;