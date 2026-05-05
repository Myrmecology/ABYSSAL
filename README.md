# ABYSSAL

A sinister, fully animated mock deep web shopping experience built with vanilla JavaScript, WebGL, and the Web Audio API. Every sound is synthesized in code. Every animation runs in the browser. No backend. No database. Pure theater.

---

## What It Is

ABYSSAL is a dark, atmospheric front-end web project featuring a mock storefront selling fictional, unsettling items. It is entirely a creative and visual experience — nothing is real, nothing is for sale, and no data is collected.

---

## Features

- **WebGL Mandelbulb fractals** in all four corners — fully animated, color-shifting, hover-reactive
- **Synthesized audio engine** built with the Web Audio API — ambient drone, heartbeat, static crackle, and interaction sounds
- **Holographic floating symbols** with proximity and click effects
- **Glitch and chromatic aberration** CSS animations throughout
- **Drip effects, particle bursts, scan lines, and breathing page animations**
- **40+ mock products** across five categories — Digital Goods, Physical Curiosities, Arcane Instruments, Media & Documents, and Tech & Data
- **Full mock shopping cart** with add, remove, and theatrical checkout flow
- **Nine hidden easter eggs** including Konami code, idle detection, tab-away detection, symbol click sequences, and more
- **Secret room** at `pages/secret.html` — find it yourself

---

## Stack

| Layer | Technology |
|---|---|
| 3D Fractals | Three.js + WebGL |
| Animation | GSAP + CSS Animations |
| Audio | Web Audio API |
| Everything Else | Vanilla JS + CSS |

No frameworks. No build tools. No dependencies beyond two CDN scripts.

---

## Project Structure

ABYSSAL/
├── index.html
├── .gitignore
├── README.md
├── css/
│   ├── main.css
│   ├── animations.css
│   ├── glitch.css
│   └── shop.css
├── js/
│   ├── main.js
│   ├── mandelbulb.js
│   ├── audio.js
│   ├── symbols.js
│   ├── effects.js
│   ├── shop.js
│   └── easter-eggs.js
├── pages/
│   ├── shop.html
│   ├── item.html
│   └── secret.html
└── assets/
├── audio/
├── fonts/
└── images/
└── icons/

---

## How To Run

No installation required.

**Option 1 — Open directly:**
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ABYSSAL.git

# Open in browser
open index.html
```

**Option 2 — Live Server (recommended for best experience):**

If you have the VS Code Live Server extension installed:

1. Open the project folder in VS Code
2. Right-click `index.html`
3. Select **Open with Live Server**

**Option 3 — Python local server:**
```bash
cd ABYSSAL
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## Controls & Secrets

| Action | Effect |
|---|---|
| `[` key | Toggle audio mute |
| Right click | Blocked — with a message |
| Hover Mandelbulb fractals | They grow toward you |
| Click floating symbols | Explosion effect |
| Konami code | Something happens |
| Click the ABYSSAL title 5 times | Something else happens |
| Hold the warning block for 3 seconds | You have been noted |
| Go idle for 30 seconds | We noticed |
| Switch browser tabs | We counted |
| Visit `pages/secret.html` | You were expected |

---

## Notes

- Audio starts on first user interaction — this is a browser requirement
- Best experienced in a dark room with headphones
- All products are fictional. All transactions are theatrical. All sales are permanent.

---

* Happy coding

This project is entirely for fun, this project is to strengthen my coding skills. 
