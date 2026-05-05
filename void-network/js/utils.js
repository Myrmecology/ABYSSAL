/* ============================================
   THE MINDLESS CORRIDOR — utils.js
   Shared helpers. Every other JS file
   imports from here. Nothing is repeated.
   ============================================ */

'use strict';

var MC = window.MC || {};

/* ============================================
   DOM HELPERS
   ============================================ */

/**
 * Select a single element
 * @param {string} selector
 * @param {Element} [ctx=document]
 * @returns {Element|null}
 */
MC.$ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Select all matching elements
 * @param {string} selector
 * @param {Element} [ctx=document]
 * @returns {NodeList}
 */
MC.$$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/**
 * Create an element with optional attributes and innerHTML
 * @param {string} tag
 * @param {Object} [attrs={}]
 * @param {string} [html='']
 * @returns {Element}
 */
MC.el = (tag, attrs = {}, html = '') => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'data') {
      Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
    } else el.setAttribute(k, v);
  });
  if (html) el.innerHTML = html;
  return el;
};

/**
 * Add event listener with optional delegation
 * @param {Element|string} target
 * @param {string} event
 * @param {Function} handler
 * @param {string} [delegate]
 */
MC.on = (target, event, handler, delegate) => {
  const el = typeof target === 'string' ? MC.$(target) : target;
  if (!el) return;
  if (delegate) {
    el.addEventListener(event, e => {
      const match = e.target.closest(delegate);
      if (match) handler.call(match, e, match);
    });
  } else {
    el.addEventListener(event, handler);
  }
};

/**
 * Remove event listener
 * @param {Element|string} target
 * @param {string} event
 * @param {Function} handler
 */
MC.off = (target, event, handler) => {
  const el = typeof target === 'string' ? MC.$(target) : target;
  if (!el) return;
  el.removeEventListener(event, handler);
};

/* ============================================
   USER HELPERS
   ============================================ */

/**
 * Get a user object by ID
 * @param {string} id
 * @returns {Object|undefined}
 */
MC.getUser = (id) => MC.users.find(u => u.id === id);

/**
 * Build an avatar element
 * @param {Object} user
 * @param {string} size  — 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @returns {Element}
 */
MC.buildAvatar = (user, size = 'md') => {
  const el = MC.el('div', {
    class: `mc-avatar mc-avatar--${size} ${user.avatarClass}`,
    'aria-label': user.name,
  });
  el.textContent = user.avatar;
  return el;
};

/* ============================================
   NUMBER HELPERS
   ============================================ */

/**
 * Format a number with K/M suffix
 * @param {number} n
 * @returns {string}
 */
MC.formatCount = (n) => {
  if (typeof n === 'string') return n;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
};

/**
 * Return a slightly wrong version of a number
 * Used for counts that flicker or feel unstable
 * @param {number} n
 * @returns {number}
 */
MC.wrongCount = (n) => {
  const delta = Math.floor(Math.random() * 7) - 3;
  return Math.max(0, n + delta);
};

/* ============================================
   STRING HELPERS
   ============================================ */

/**
 * Truncate a string to maxLen with ellipsis
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
MC.truncate = (str, maxLen = 120) => {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
};

/**
 * Escape HTML special characters
 * @param {string} str
 * @returns {string}
 */
MC.escape = (str) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
};

/**
 * Pick a random item from an array
 * @param {Array} arr
 * @returns {*}
 */
MC.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Shuffle an array (Fisher-Yates)
 * @param {Array} arr
 * @returns {Array}
 */
MC.shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ============================================
   TIMING HELPERS
   ============================================ */

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
MC.debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle a function
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
MC.throttle = (fn, limit = 100) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
};

/**
 * Sleep for ms milliseconds
 * @param {number} ms
 * @returns {Promise}
 */
MC.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Run a callback after a random delay within a range
 * @param {Function} fn
 * @param {number} minMs
 * @param {number} maxMs
 */
MC.randomDelay = (fn, minMs = 800, maxMs = 4000) => {
  const delay = minMs + Math.random() * (maxMs - minMs);
  setTimeout(fn, delay);
};

/* ============================================
   ANIMATION HELPERS
   ============================================ */

/**
 * Add a class, then remove it after the animation ends
 * @param {Element} el
 * @param {string} cls
 */
MC.animateOnce = (el, cls) => {
  if (!el) return;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
};

/**
 * Trigger a glitch on an element for a short burst
 * @param {Element} el
 */
MC.glitch = (el) => {
  if (!el) return;
  el.classList.add('mc-glitch', 'is-glitching');
  setTimeout(() => el.classList.remove('is-glitching'), 400);
};

/**
 * Observe elements entering the viewport and animate them
 * @param {string} selector
 * @param {string} animClass
 */
MC.observeEntrance = (selector, animClass = 'mc-post-arrive') => {
  const els = MC.$$(selector);
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
};

/* ============================================
   TOAST HELPER
   ============================================ */

/**
 * Show a toast message
 * @param {string} message
 * @param {'default'|'blue'|'red'} [type='default']
 * @param {number} [duration=3000]
 */
MC.toast = (message, type = 'default', duration = 3000) => {
  let wrap = MC.$('.mc-toast-wrap');
  if (!wrap) {
    wrap = MC.el('div', { class: 'mc-toast-wrap' });
    document.body.appendChild(wrap);
  }

  const modClass = type !== 'default' ? ` mc-toast--${type}` : '';
  const toast = MC.el('div', { class: `mc-toast${modClass}` });
  toast.textContent = message;
  wrap.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 320);
  }, duration);
};

/* ============================================
   COMPOSE PLACEHOLDER ROTATOR
   ============================================ */

/**
 * Rotate compose box placeholder text
 * @param {Element} textarea
 */
MC.rotatePlaceholder = (textarea) => {
  if (!textarea || !MC.composePlaceholders) return;
  let index = 0;
  const rotate = () => {
    textarea.setAttribute('placeholder', MC.composePlaceholders[index]);
    index = (index + 1) % MC.composePlaceholders.length;
  };
  rotate();
  setInterval(rotate, 5000);
};

/* ============================================
   CHARACTER COUNTER
   ============================================ */

/**
 * Bind a character counter to a textarea
 * @param {Element} textarea
 * @param {Element} counter
 * @param {number} [max=280]
 */
MC.bindCharCounter = (textarea, counter, max = 280) => {
  if (!textarea || !counter) return;
  const update = () => {
    const remaining = max - textarea.value.length;
    counter.textContent = remaining;
    counter.classList.toggle('is-warning', remaining < 20);
  };
  textarea.addEventListener('input', update);
  update();
};

/* ============================================
   CORRUPT TEXT
   Randomly corrupts a word in a string
   Used on post bodies in post.js
   ============================================ */

/**
 * Wrap a random word in a post body with .mc-corrupted span
 * @param {string} text
 * @returns {string} HTML string
 */
MC.corruptText = (text) => {
  const words = text.split(' ');
  if (words.length < 5) return MC.escape(text);
  const idx = Math.floor(2 + Math.random() * (words.length - 4));
  return words.map((w, i) => {
    if (i === idx) {
      return `<span class="mc-corrupted" title="[corrupted]">${MC.escape(w)}</span>`;
    }
    return MC.escape(w);
  }).join(' ');
};

/* ============================================
   WRONG TIMESTAMP GENERATOR
   ============================================ */

/**
 * Return an impossible or wrong timestamp string
 * @returns {string}
 */
MC.wrongTime = () => {
  const wrong = [
    'February 31st, 2019',
    '3 minutes from now',
    'before you joined',
    'during an earlier version of today',
    'not yet',
    '13:88 AM',
    'yesterday (recurring)',
    'at some point — confirmed',
    'when you were not looking',
  ];
  return MC.pick(wrong);
};

/* ============================================
   SCROLL LOCK
   ============================================ */

MC.lockScroll  = () => document.body.style.overflow = 'hidden';
MC.unlockScroll = () => document.body.style.overflow = '';

/* ============================================
   LOCAL STORAGE WRAPPER
   Safe — never throws
   ============================================ */

MC.store = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch { /* silent */ }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); }
    catch { /* silent */ }
  },
};

/* Expose globally */
window.MC = MC;