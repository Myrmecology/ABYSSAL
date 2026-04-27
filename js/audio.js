/* ============================================
   ABYSSAL — audio.js
   Web Audio API — all sound synthesized in code
   UPDATED: removed high pitch whisper tone
   ============================================ */

(function () {
  let ctx        = null;
  let masterGain = null;
  let started    = false;

  // --- Boot audio context on first user interaction ---
  function initAudio() {
    if (started) return;
    started = true;

    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.45;
    masterGain.connect(ctx.destination);

    startDrone();
    startHeartbeat();
    startStaticCrackle();
  }

  // --- Deep ambient drone ---
  function startDrone() {
    const frequencies = [27.5, 36.7, 41.2, 55.0];

    frequencies.forEach((freq, i) => {
      const osc    = ctx.createOscillator();
      const gain   = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type          = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value  = i % 2 === 0 ? -8 : 8;

      filter.type            = 'lowpass';
      filter.frequency.value = 180;
      filter.Q.value         = 1.5;

      gain.gain.value = 0.08;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();

      // Slow LFO breathing on gain
      const lfo     = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.06 + i * 0.015;
      lfoGain.gain.value  = 0.04;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
    });
  }

  // --- Slow heartbeat pulse ---
  function startHeartbeat() {
    function beat() {
      if (!ctx) return;

      const now = ctx.currentTime;

      // First thump
      const osc1  = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 0.15);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Second thump (softer)
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, now + 0.22);
      osc2.frequency.exponentialRampToValueAtTime(28, now + 0.38);
      gain2.gain.setValueAtTime(0.22, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.5);

      // Irregular timing — feels alive and wrong
      const nextBeat = 1800 + Math.random() * 800;
      setTimeout(beat, nextBeat);
    }

    setTimeout(beat, 2000);
  }

  // --- Static crackle layer ---
  function startStaticCrackle() {
    const bufferSize = ctx.sampleRate * 2;
    const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data       = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() < 0.004
        ? (Math.random() * 2 - 1) * 0.9
        : 0;
    }

    function playStaticLoop() {
      if (!ctx) return;
      const source = ctx.createBufferSource();
      const gain   = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      source.buffer = buffer;
      source.loop   = false;

      filter.type            = 'highpass';
      filter.frequency.value = 1200;

      gain.gain.value = 0.18;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      source.start();

      source.onended = () => {
        setTimeout(playStaticLoop, Math.random() * 3000 + 1000);
      };
    }

    playStaticLoop();
  }

  // --- One-shot: glitch burst ---
  function playGlitch() {
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type            = ['square', 'sawtooth', 'square'][i % 3];
      osc.frequency.value = 80 + Math.random() * 800;

      gain.gain.setValueAtTime(0.18, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.05);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.06);
    }
  }

  // --- One-shot: cart add (unsettling) ---
  function playCartAdd() {
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.55);

    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(233, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(116, now + 0.3);
    gain2.gain.setValueAtTime(0.08, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.55);
  }

  // --- One-shot: hover sound ---
  function playHover() {
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // --- One-shot: easter egg reveal ---
  function playEasterEgg() {
    if (!ctx) return;
    const now   = ctx.currentTime;
    const notes = [110, 116.5, 130.8, 138.6, 155.6];

    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type            = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  }

  // --- One-shot: checkout confirmation ---
  function playCheckout() {
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(27.5, now + 1.5);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 2.1);

    setTimeout(playGlitch, 400);
    setTimeout(playGlitch, 900);
  }

  // --- One-shot: lightning strike sound ---
  function playLightning() {
    if (!ctx) return;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.6;
    const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data       = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) *
        Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const source = ctx.createBufferSource();
    const gain   = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    source.buffer          = buffer;
    filter.type            = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value         = 0.5;
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    source.start(now);
  }

  // --- Expose globally ---
  window.AbyssalAudio = {
    init:         initAudio,
    masterGain,
    playGlitch,
    playCartAdd,
    playHover,
    playEasterEgg,
    playCheckout,
    playLightning
  };

  ['click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, () => AbyssalAudio.init(), { once: true });
  });

})();