/* ============================================
   THE MINDLESS CORRIDOR — corridor.js
   Builds the hidden deep layer page.
   Terminal stream, data panels, corridor
   messages, entry sequence, scan line.
   ============================================ */

'use strict';

const MC = window.MC || {};

MC.corridor = (() => {

  /* ============================================
     RENDER BACKGROUND
     ============================================ */

  const renderBackground = () => {
    const page = MC.$('.mc-corridor-page');
    if (!page) return;

    /* Scan line overlay */
    const scan = MC.el('div', { class: 'mc-corridor-scan' });
    const scanLine = MC.el('div', { class: 'mc-corridor-scan-line' });
    const bg = MC.el('div', { class: 'mc-corridor-bg' });

    document.body.appendChild(bg);
    document.body.appendChild(scan);
    document.body.appendChild(scanLine);
  };

  /* ============================================
     RENDER ENTRY SEQUENCE
     ============================================ */

  const renderEntry = () => {
    const entry = MC.$('.mc-corridor-entry');
    if (!entry) return;

    entry.innerHTML = `
      <div class="mc-corridor-glyph mc-anim-breathe">⬡</div>

      <div class="mc-corridor-title-wrap">
        <div class="mc-corridor-title"
             data-text="THE MINDLESS CORRIDOR">
          THE MINDLESS CORRIDOR
        </div>
      </div>

      <p class="mc-corridor-subtitle">
        You have reached the part of the platform<br>
        that was not meant to be reached.<br>
        We left it here anyway.<br>
        We knew you would find it.
      </p>
    `;
  };

  /* ============================================
     RENDER TERMINAL
     ============================================ */

  const renderTerminal = () => {
    const terminal = MC.$('.mc-corridor-terminal');
    if (!terminal) return;

    terminal.innerHTML = `
      <div class="mc-corridor-terminal-bar">
        <span class="mc-terminal-dot mc-terminal-dot--red"></span>
        <span class="mc-terminal-dot mc-terminal-dot--amber"></span>
        <span class="mc-terminal-dot mc-terminal-dot--green"></span>
        <span class="mc-corridor-terminal-label">
          CORRIDOR_STREAM — SESSION ACTIVE
        </span>
      </div>
      <div class="mc-corridor-terminal-body" id="terminal-body">
        <span class="mc-terminal-cursor"></span>
      </div>
    `;

    scheduleTerminalLines();
  };

  /* ============================================
     TERMINAL LINE STREAM
     Lines appear one at a time with delays
     ============================================ */

  const terminalLines = [
    { text: '> initializing corridor session...',         type: 'blue',  delay: 800  },
    { text: '> locating user...',                         type: '',      delay: 1600 },
    { text: '> user located.',                            type: 'white', delay: 2200 },
    { text: '> verifying clearance level...',             type: '',      delay: 3000 },
    { text: '> clearance: UNKNOWN. access granted.',      type: 'blue',  delay: 3800 },
    { text: '> loading corridor data...',                 type: '',      delay: 4600 },
    { text: '> WARNING: 4 anomalies detected.',           type: 'red',   delay: 5400 },
    { text: '> anomalies have been noted. session continues.', type: '', delay: 6200 },
    { text: '> session duration: ∞',                     type: 'dim',   delay: 7000 },
    { text: '> you have been here before.',               type: 'white', delay: 8000 },
    { text: '> corridor is stable. corridor is not stable.', type: 'red', delay: 9200 },
    { text: '> welcome back.',                            type: 'blue',  delay: 10400 },
  ];

  const scheduleTerminalLines = () => {
    const body = MC.$('#terminal-body');
    if (!body) return;

    terminalLines.forEach(line => {
      setTimeout(() => {
        const cursor = MC.$('.mc-terminal-cursor', body);

        const el = MC.el('div', {
          class: `mc-terminal-line${line.type ? ` mc-terminal-line--${line.type}` : ''}`,
        });
        el.textContent = line.text;

        /* Insert before cursor */
        if (cursor) {
          body.insertBefore(el, cursor);
        } else {
          body.appendChild(el);
        }

        /* Auto scroll to bottom */
        body.scrollTop = body.scrollHeight;

      }, line.delay);
    });

    /* After all lines — start live stream */
    setTimeout(() => {
      startLiveTerminalStream();
    }, 12000);
  };

  /* ============================================
     LIVE TERMINAL STREAM
     Ongoing low-level output after entry
     ============================================ */

  const liveTerminalPool = [
    { text: '> scroll depth recorded.',             type: 'dim'   },
    { text: '> cursor position logged.',            type: 'dim'   },
    { text: '> anomaly count updated: 5.',          type: 'red'   },
    { text: '> user behavior: consistent.',         type: ''      },
    { text: '> pattern match: 94.7%',               type: 'blue'  },
    { text: '> session extended.',                  type: 'dim'   },
    { text: '> data retained.',                     type: 'dim'   },
    { text: '> new message in corridor stream.',    type: 'white' },
    { text: '> anomaly count updated: 6.',          type: 'red'   },
    { text: '> user is still here.',                type: 'blue'  },
    { text: '> this is expected.',                  type: 'dim'   },
    { text: '> corridor integrity: nominal.',       type: ''      },
    { text: '> corridor integrity: uncertain.',     type: 'red'   },
    { text: '> time stamp could not be verified.', type: 'red'   },
    { text: '> logging: continued.',                type: 'dim'   },
  ];

  const startLiveTerminalStream = () => {
    const body = MC.$('#terminal-body');
    if (!body) return;

    const addLine = () => {
      const line = MC.pick(liveTerminalPool);
      const cursor = MC.$('.mc-terminal-cursor', body);

      const el = MC.el('div', {
        class: `mc-terminal-line${line.type ? ` mc-terminal-line--${line.type}` : ''}`,
      });
      el.textContent = line.text;

      if (cursor) {
        body.insertBefore(el, cursor);
      } else {
        body.appendChild(el);
      }

      /* Cap at 40 lines — remove oldest */
      const lines = MC.$$('.mc-terminal-line', body);
      if (lines.length > 40) {
        lines[0].remove();
      }

      body.scrollTop = body.scrollHeight;

      const next = 4000 + Math.random() * 8000;
      setTimeout(addLine, next);
    };

    const firstDelay = 2000 + Math.random() * 3000;
    setTimeout(addLine, firstDelay);
  };

  /* ============================================
     RENDER DATA PANELS
     ============================================ */

  const renderPanels = () => {
    const wrap = MC.$('.mc-corridor-panels');
    if (!wrap || !MC.corridorPanels) return;

    wrap.innerHTML = '';

    MC.corridorPanels.forEach(panel => {
      const el = MC.el('div', { class: 'mc-corridor-panel' });

      const valueClass = panel.valueMod
        ? `mc-corridor-panel-value mc-corridor-panel-value${panel.valueMod}`
        : 'mc-corridor-panel-value';

      el.innerHTML = `
        <div class="mc-corridor-panel-label mc-mono">
          ${MC.escape(panel.label)}
        </div>
        <div class="${valueClass}">
          ${MC.escape(panel.value)}
        </div>
        <div class="mc-corridor-panel-sub">
          ${MC.escape(panel.sub)}
        </div>
      `;

      /* Panel click — wrong info response */
      el.addEventListener('click', () => {
        const responses = [
          'This value updates in real time. Real time is approximate.',
          'The number you see is the number we chose.',
          'Clicking this has been noted.',
          'Data confirmed. Data is not confirmable.',
        ];
        MC.toast(MC.pick(responses), 'default', 3000);
      });

      wrap.appendChild(el);
    });
  };

  /* ============================================
     RENDER CORRIDOR MESSAGE STREAM
     ============================================ */

  const renderMessages = () => {
    const wrap = MC.$('.mc-corridor-stream');
    if (!wrap || !MC.corridorMessages) return;

    const label = MC.el('div', { class: 'mc-corridor-stream-label mc-mono' });
    label.textContent = '// CORRIDOR MESSAGE STREAM — UNMODERATED //';
    wrap.appendChild(label);

    MC.corridorMessages.forEach((msg, i) => {
      const el = MC.el('div', { class: 'mc-corridor-message' });
      el.style.animationDelay = `${2.4 + i * 0.2}s`;

      el.innerHTML = `
        <div class="mc-corridor-message-header">
          <span class="mc-corridor-message-author mc-mono">
            ${MC.escape(msg.author)}
          </span>
          <span class="mc-corridor-message-time mc-mono">
            ${MC.escape(msg.time)}
          </span>
        </div>
        <div class="mc-corridor-message-text">
          ${MC.escape(msg.text)}
        </div>
      `;

      el.addEventListener('click', () => {
        MC.glitch(MC.$('.mc-corridor-message-author', el));
        MC.toast('Message acknowledged. The author has been notified.', 'red', 3000);
      });

      wrap.appendChild(el);
    });

    /* Add a live message after a delay */
    scheduleLiveMessage(wrap);
  };

  /* ============================================
     LIVE CORRIDOR MESSAGE
     One new message surfaces after the user
     has been in the corridor long enough
     ============================================ */

  const scheduleLiveMessage = (wrap) => {
    const delay = 25000 + Math.random() * 20000;

    setTimeout(() => {
      const liveMessages = [
        {
          author: 'UNRESOLVED_USER',
          time:   'just now',
          text:   'Someone else just arrived. You may have noticed. You may be the someone else.',
        },
        {
          author: 'SYSTEM_NODE_07',
          time:   'just now',
          text:   'Your session in this layer has exceeded the expected duration. Expected duration was infinite. You are on schedule.',
        },
        {
          author: 'u08_GHOST',
          time:   'just now',
          text:   'Hello.',
        },
      ];

      const msg = MC.pick(liveMessages);
      const el  = MC.el('div', { class: 'mc-corridor-message mc-anim-fade-in' });

      el.innerHTML = `
        <div class="mc-corridor-message-header">
          <span class="mc-corridor-message-author mc-mono">
            ${MC.escape(msg.author)}
          </span>
          <span class="mc-corridor-message-time mc-mono">
            ${MC.escape(msg.time)}
          </span>
        </div>
        <div class="mc-corridor-message-text">
          ${MC.escape(msg.text)}
        </div>
      `;

      wrap.appendChild(el);

      if (MC.ambient && MC.ambient.showAlert) {
        MC.ambient.showAlert('New message in the corridor stream.');
      }

    }, delay);
  };

  /* ============================================
     RENDER RETURN BUTTON
     ============================================ */

  const renderReturn = () => {
    const wrap = MC.$('.mc-corridor-return');
    if (!wrap) return;

    wrap.innerHTML = `
      <div class="mc-return-wrap" style="justify-content:center;margin-top:var(--mc-space-4);">
        <a href="index.html" class="mc-return-link">
          ← RETURN TO THE FEED
          <span class="Stars">✦</span>
        </a>
      </div>
      <div class="mc-return-wrap" style="justify-content:center;margin-top:var(--mc-space-3);">
        <a href="../index.html" class="mc-return-link">
          ← RETURN TO ABYSSAL
          <span class="Stars">✦</span>
        </a>
      </div>
    `;
  };

  /* ============================================
     TITLE FLICKER
     Page title changes subtly while in
     the corridor — more aggressive than
     the ambient watching effect
     ============================================ */

  const initTitleFlicker = () => {
    const titles = [
      'THE MINDLESS CORRIDOR',
      'you are here.',
      'THE MINDLESS CORRIDOR',
      'still here.',
      'THE MINDLESS CORRIDOR',
      'we see you.',
      'THE MINDLESS CORRIDOR',
    ];

    let index = 0;

    setInterval(() => {
      index = (index + 1) % titles.length;
      document.title = titles[index];
    }, 8000);
  };

  /* ============================================
     INIT
     ============================================ */

  const init = () => {
    document.title = 'THE MINDLESS CORRIDOR';

    renderBackground();
    renderEntry();
    renderTerminal();
    renderPanels();
    renderMessages();
    renderReturn();
    initTitleFlicker();
  };

  return { init };

})();

document.addEventListener('DOMContentLoaded', MC.corridor.init);

window.MC = MC;