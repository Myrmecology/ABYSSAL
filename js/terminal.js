/* ============================================
   ABYSSAL — terminal.js
   Fake interactive terminal — press ~ to open
   ============================================ */

(function () {

  // --- Terminal state ---
  let isOpen    = false;
  let history   = [];
  let histIdx   = -1;
  let inputLock = false;

  // --- Command definitions ---
  const commands = {

    help: () => [
      '┌─────────────────────────────────────┐',
      '│         ABYSSAL TERMINAL v0.0.1     │',
      '│         [ AUTHORIZED USE ONLY ]     │',
      '└─────────────────────────────────────┘',
      '',
      '  help        — you are already here',
      '  whoami      — identify yourself',
      '  ls          — list available sectors',
      '  scan        — scan current environment',
      '  status      — system status report',
      '  ping        — test connection',
      '  log         — view recent activity',
      '  time        — current session time',
      '  clear       — clear terminal output',
      '  exit        — close terminal',
      '',
      '  WARNING: some commands are not listed.',
    ],

    whoami: () => [
      'QUERYING IDENTITY DATABASE...',
      '',
      '  DESIGNATION   : UNKNOWN',
      '  ACCESS LEVEL  : GUEST [ UNVERIFIED ]',
      '  ORIGIN        : ' + fakeIP(),
      '  SESSION ID    : ' + fakeSessionId(),
      '  THREAT RATING : ' + randomFrom([
        'NEGLIGIBLE', 'LOW', 'CURIOUS', 'WATCHING'
      ]),
      '',
      '  You are not in our system.',
      '  You are not supposed to be here.',
      '  These two facts are not contradictory.',
    ],

    ls: () => [
      'LISTING ACCESSIBLE SECTORS...',
      '',
      '  drwx——   SECTOR_0       [ RESTRICTED ]',
      '  drwx——   SECTOR_1       [ ACCESSIBLE ]',
      '  drwx——   SECTOR_2       [ CORRUPTED  ]',
      '  drwx——   SECTOR_VOID    [ ????????? ]',
      '  drwx——   /market        [ OPEN       ]',
      '  drwx——   /archive       [ SEALED     ]',
      '  drwx——   /logs          [ REDACTED   ]',
      '  drwx——   /them          [ DO NOT OPEN]',
      '',
      '  8 sectors found. 3 acknowledged.',
    ],

    scan: () => [
      'INITIATING ENVIRONMENT SCAN...',
      '',
      '  [ ████████████████████ ] 100%',
      '',
      '  DISPLAY       : ' + window.screen.width + 'x' + window.screen.height,
      '  BROWSER       : IDENTIFIED [ LOGGED ]',
      '  LOCATION      : APPROXIMATED [ LOGGED ]',
      '  OPEN TABS     : ' + (Math.floor(Math.random() * 8) + 1),
      '  CAMERA        : ' + randomFrom(['INACTIVE', 'INACTIVE', 'UNCERTAIN']),
      '  MICROPHONE    : INACTIVE',
      '  OBSERVERS     : ' + (Math.floor(Math.random() * 20) + 2),
      '  ANOMALIES     : ' + (Math.floor(Math.random() * 4)),
      '',
      '  SCAN COMPLETE. RESULTS HAVE BEEN LOGGED.',
      '  You did not consent to this scan.',
      '  You consented when you loaded the page.',
    ],

    status: () => [
      'FETCHING SYSTEM STATUS...',
      '',
      '  CORE          : OPERATIONAL',
      '  MARKET        : ONLINE [ ' + AbyssalShopCount() + ' ITEMS ]',
      '  AUDIO ENGINE  : ' + (window.AbyssalAudio ? 'ACTIVE' : 'DORMANT'),
      '  FRACTAL CORES : RENDERING',
      '  OBSERVERS     : PRESENT',
      '  LAST INCIDENT : ' + fakeDate(),
      '  NEXT INCIDENT : UNKNOWN',
      '  UPTIME        : ' + fakeUptime(),
      '',
      '  ALL SYSTEMS FUNCTIONAL.',
      '  That is not necessarily good news.',
    ],

    ping: () => [
      'PINGING ABYSSAL CORE...',
      '',
      '  PING 1 : 1ms    [ response: "we know" ]',
      '  PING 2 : 1ms    [ response: "we see"  ]',
      '  PING 3 : 1ms    [ response: "we wait" ]',
      '  PING 4 : ---    [ no response ]',
      '  PING 5 : 1ms    [ response: "still here" ]',
      '',
      '  5 packets transmitted.',
      '  4 received, 1 absorbed.',
      '  Average latency: 1ms.',
      '  Something answered before we asked.',
    ],

    log: () => {
      const entries = [];
      entries.push('RECENT ACTIVITY LOG:');
      entries.push('');
      const actions = [
        'PAGE ACCESSED',
        'ITEM VIEWED',
        'SYMBOL OBSERVED',
        'CURSOR TRACKED',
        'KEYSTROKE LOGGED',
        'SCROLL DEPTH RECORDED',
        'IDENTITY APPROXIMATED',
        'PRESENCE NOTED',
      ];
      for (let i = 0; i < 7; i++) {
        const t = fakeLogTime(i);
        const a = randomFrom(actions);
        entries.push(`  ${t}  —  ${a}`);
      }
      entries.push('');
      entries.push('  End of visible log.');
      entries.push('  The rest has been classified.');
      return entries;
    },

    time: () => {
      const now     = new Date();
      const elapsed = window.ABYSSAL
        ? Math.floor((Date.now() - window.ABYSSAL.startTime) / 1000)
        : 0;
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      return [
        'TEMPORAL STATUS:',
        '',
        '  LOCAL TIME    : ' + now.toTimeString().slice(0, 8),
        '  SESSION TIME  : ' + mins + ':' + secs,
        '  TIME ZONE     : ' + Intl.DateTimeFormat().resolvedOptions().timeZone,
        '  ABYSSAL TIME  : IMMEASURABLE',
        '',
        '  Time here does not move the way you think.',
      ];
    },

    clear: () => {
      clearOutput();
      return [];
    },

    exit: () => {
      setTimeout(closeTerminal, 300);
      return [
        'CLOSING TERMINAL...',
        '',
        '  You can leave the terminal.',
        '  You cannot leave ABYSSAL.',
      ];
    },

    // --- Hidden commands ---
    void: () => [
      'ACCESSING VOID SECTOR...',
      '',
      '  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '  ▓                              ▓',
      '  ▓   THIS SECTOR IS NOT READY  ▓',
      '  ▓   OR IT IS TOO READY        ▓',
      '  ▓   We have not decided        ▓',
      '  ▓                              ▓',
      '  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
      '',
      '  Access attempt has been noted.',
    ],

    secret: () => {
      window.location.href = 'pages/secret.html';
      return [
        'REDIRECTING TO SECTOR ZERO...',
        '',
        '  You found the command.',
        '  We left it here on purpose.',
        '  Or you were meant to find it.',
        '  The distinction no longer matters.',
      ];
    },

    abyssal: () => [
      '',
      '  ▄▄▄    ▄▄▄▄    ▄▄  ▄  ▄▄▄▄    ▄▄▄    ▄▄   ▄',
      '  █  █  █    █   ██  █  █       █       █   █',
      '  ████  ████████  █ ██  ████    ████     ████',
      '  █  █  █    █    █  █  █       █        █  █',
      '  ████  █    █    █  █  ████    ████     █   █',
      '',
      '  You called. We answered.',
      '  That was a mistake.',
      '  Welcome anyway.',
    ],

    knock: () => [
      'INITIATING KNOCK SEQUENCE...',
      '',
      '  knock.',
      '  knock.',
      '  knock.',
      '',
      '  Something knocked back.',
      '  From inside the page.',
      '  We did not do that.',
    ],

    buy: () => [
      'INITIATING DIRECT PURCHASE PROTOCOL...',
      '',
      '  ERROR: Insufficient void currency.',
      '  ERROR: Identity not recognized.',
      '  ERROR: You do not exist in our system.',
      '',
      '  Please visit the market.',
      '  The market is already watching you.',
    ],
  };

  // --- Utility functions ---
  function fakeIP() {
    return [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ].join('.');
  }

  function fakeSessionId() {
    const c = 'ABCDEF0123456789';
    return Array.from({ length: 16 }, () =>
      c[Math.floor(Math.random() * c.length)]
    ).join('');
  }

  function fakeDate() {
    const days  = Math.floor(Math.random() * 30) + 1;
    const hours = Math.floor(Math.random() * 24);
    const mins  = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${days} DAYS AGO AT ${hours}:${mins}`;
  }

  function fakeUptime() {
    const d = Math.floor(Math.random() * 999) + 100;
    const h = Math.floor(Math.random() * 24);
    const m = Math.floor(Math.random() * 60);
    return `${d}d ${h}h ${m}m`;
  }

  function fakeLogTime(offset) {
    const now  = new Date(Date.now() - offset * 1000 * 60 * (1 + Math.random() * 5));
    const h    = String(now.getHours()).padStart(2, '0');
    const m    = String(now.getMinutes()).padStart(2, '0');
    const s    = String(now.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function AbyssalShopCount() {
    return window.AbyssalShopData ? window.AbyssalShopData.length : '??';
  }

  // --- Build terminal DOM ---
  function buildTerminal() {
    const terminal = document.createElement('div');
    terminal.id    = 'abyssal-terminal';
    terminal.style.cssText = `
      position: fixed;
      bottom: 3rem;
      left: 50%;
      transform: translateX(-50%) translateY(110%);
      width: min(720px, 92vw);
      height: 420px;
      background: rgba(2, 2, 2, 0.97);
      border: 1px solid #8b0000;
      box-shadow:
        0 0 30px rgba(139,0,0,0.4),
        0 0 60px rgba(139,0,0,0.15),
        inset 0 0 20px rgba(0,0,0,0.8);
      z-index: 999995;
      display: flex;
      flex-direction: column;
      font-family: 'Share Tech Mono', monospace;
      transition: transform 0.4s cubic-bezier(0.77,0,0.175,1),
                  opacity  0.4s ease;
      opacity: 0;
      pointer-events: none;
      border-radius: 2px;
    `;

    // Title bar
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #1a1a1a;
      background: #080808;
      flex-shrink: 0;
    `;
    titleBar.innerHTML = `
      <span style="font-size:0.6rem;color:#8b0000;letter-spacing:0.3em;">
        ABYSSAL TERMINAL — UNAUTHORIZED SESSION
      </span>
      <button id="terminal-close-btn" style="
        background:none;border:none;color:#8b0000;
        font-size:1rem;cursor:pointer;font-family:inherit;
        padding:0 0.2rem;
      ">✕</button>
    `;

    // Output area
    const output = document.createElement('div');
    output.id    = 'terminal-output';
    output.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      font-size: 0.72rem;
      color: #888;
      letter-spacing: 0.08em;
      line-height: 1.8;
      scrollbar-width: thin;
      scrollbar-color: #8b0000 #000;
    `;

    // Input row
    const inputRow = document.createElement('div');
    inputRow.style.cssText = `
      display: flex;
      align-items: center;
      padding: 0.6rem 1rem;
      border-top: 1px solid #1a1a1a;
      background: #040404;
      flex-shrink: 0;
    `;
    inputRow.innerHTML = `
      <span style="color:#8b0000;font-size:0.72rem;
                   letter-spacing:0.1em;margin-right:0.5rem;">
        ABYSSAL:~$
      </span>
      <input id="terminal-input" type="text" autocomplete="off"
             spellcheck="false" autocorrect="off"
             style="
               flex:1;
               background:transparent;
               border:none;
               outline:none;
               color:#aaa;
               font-family:'Share Tech Mono',monospace;
               font-size:0.72rem;
               letter-spacing:0.1em;
               caret-color:#8b0000;
             " />
    `;

    terminal.appendChild(titleBar);
    terminal.appendChild(output);
    terminal.appendChild(inputRow);
    document.body.appendChild(terminal);

    // Boot message
    printLines([
      'ABYSSAL TERMINAL — BUILD 0.0.1-VOID',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'UNAUTHORIZED ACCESS DETECTED.',
      'Session is being logged.',
      '',
      'Type  help  to see available commands.',
      'Some commands are not listed.',
      '',
    ]);

    // Events
    document.getElementById('terminal-close-btn')
      .addEventListener('click', closeTerminal);

    const input = document.getElementById('terminal-input');
    input.addEventListener('keydown', handleInput);
  }

  // --- Print lines to output ---
  function printLines(lines, color = '#888') {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    lines.forEach((line, i) => {
      setTimeout(() => {
        const el       = document.createElement('div');
        el.textContent = line;
        el.style.color = line.startsWith('  ERROR')
          ? '#8b0000'
          : line.startsWith('  ') && line.includes(':')
            ? '#aaa'
            : color;
        output.appendChild(el);
        output.scrollTop = output.scrollHeight;
      }, i * 18);
    });
  }

  // --- Clear output ---
  function clearOutput() {
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '';
  }

  // --- Handle input ---
  function handleInput(e) {
    if (inputLock) return;

    const input = document.getElementById('terminal-input');

    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[history.length - 1 - histIdx] || '';
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[history.length - 1 - histIdx] || '';
      } else {
        histIdx     = -1;
        input.value = '';
      }
      return;
    }

    if (e.key !== 'Enter') return;

    const raw = input.value.trim().toLowerCase();
    input.value = '';
    histIdx     = -1;
    if (!raw) return;

    // Echo command
    history.push(raw);
    const output = document.getElementById('terminal-output');
    if (output) {
      const echo       = document.createElement('div');
      echo.textContent = `ABYSSAL:~$ ${raw}`;
      echo.style.color = '#8b0000';
      echo.style.marginTop = '0.4rem';
      output.appendChild(echo);
    }

    if (window.AbyssalAudio) window.AbyssalAudio.playHover();

    // Run command
    if (commands[raw]) {
      inputLock = true;
      const result = commands[raw]();
      if (result && result.length > 0) {
        setTimeout(() => {
          printLines(result);
          setTimeout(() => { inputLock = false; }, result.length * 18 + 100);
        }, 120);
      } else {
        inputLock = false;
      }
    } else {
      // Unknown command
      const unknown = [
        `COMMAND NOT RECOGNIZED: "${raw}"`,
        '',
        '  This command may exist on a level you cannot access.',
        '  Type  help  for visible commands.',
      ];
      setTimeout(() => printLines(unknown, '#555'), 80);
    }
  }

  // --- Open terminal ---
  function openTerminal() {
    if (isOpen) return;
    isOpen = true;

    const t = document.getElementById('abyssal-terminal');
    if (!t) return;

    t.style.pointerEvents = 'all';
    t.style.opacity       = '1';
    t.style.transform     = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      const input = document.getElementById('terminal-input');
      if (input) input.focus();
    }, 420);

    if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
  }

  // --- Close terminal ---
  function closeTerminal() {
    if (!isOpen) return;
    isOpen = false;

    const t = document.getElementById('abyssal-terminal');
    if (!t) return;

    t.style.opacity       = '0';
    t.style.transform     = 'translateX(-50%) translateY(110%)';
    t.style.pointerEvents = 'none';

    if (window.AbyssalAudio) window.AbyssalAudio.playGlitch();
  }

  // --- Toggle on ~ key ---
  function initKeyListener() {
    document.addEventListener('keydown', (e) => {
      // Don't intercept if typing in terminal input
      if (e.target.id === 'terminal-input') return;

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        isOpen ? closeTerminal() : openTerminal();
      }

      if (e.key === 'Escape' && isOpen) {
        closeTerminal();
      }
    });
  }

  // --- Hint that terminal exists ---
  function initTerminalHint() {
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 6rem;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem;
      color: #1a1a1a;
      letter-spacing: 0.15em;
      z-index: 9000;
      pointer-events: none;
      transition: color 1s;
    `;
    hint.textContent = '[ ~ ] TERMINAL';
    document.body.appendChild(hint);

    // Occasionally flash the hint so it is barely discoverable
    setInterval(() => {
      hint.style.color = '#3a0000';
      setTimeout(() => {
        hint.style.color = '#1a1a1a';
      }, 800);
    }, 18000 + Math.random() * 12000);
  }

  // --- Boot ---
  function init() {
    buildTerminal();
    initKeyListener();
    initTerminalHint();
  }

  window.addEventListener('DOMContentLoaded', init);

})();