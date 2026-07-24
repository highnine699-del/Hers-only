# BIRTHDAY VAULT — IDE MASTER PROMPT v2.2

**Project:** Single-scene birthday experience for Precious Eniola Adelusi
**Unlock:** November 7, 2026 | Code: `1107`
**Recipient:** highnine699-del.github.io/birthday-vault/
**Build Start:** June 27, 2026

---

## PART A: ARCHITECTURAL LAW (NON-NEGOTIABLE)

These rules exist to prevent bugs. Violating them requires explicit override + justification in code comments.

### A.1 — Director Never Uses String Keys

**OLD (FORBIDDEN):**
```javascript
const morphs = {
  'countdown_vault': () => {},
  'vault_envelope': () => {},
}
```

**NEW (REQUIRED):**
```javascript
// src/engine/director/morphRegistry.js
export const MORPH_KEYS = {
  COUNTDOWN_TO_VAULT: 'countdown_vault',
  VAULT_TO_ENVELOPE: 'vault_envelope',
  ENVELOPE_TO_LETTER: 'envelope_letter',
  LETTER_TO_PROMISES: 'letter_promises',
  PROMISES_TO_MEMORY: 'promises_memory',
  MEMORY_TO_FATE: 'memory_fate',
  FATE_TO_CONSTELLATION: 'fate_constellation',
  CONSTELLATION_TO_AFTERGLOW: 'constellation_afterglow',
}

const morphRegistry = new Map([
  [MORPH_KEYS.COUNTDOWN_TO_VAULT, morphCountdownToVault],
  [MORPH_KEYS.VAULT_TO_ENVELOPE, morphVaultToEnvelope],
  // ...
])

export function getMorphFn(from, to) {
  const key = `${from}_${to}`
  if (!morphRegistry.has(key)) {
    throw new Error(`[MorphRegistry] Undefined morph: ${from} → ${to}. Valid keys: ${Array.from(morphRegistry.keys()).join(', ')}`)
  }
  return morphRegistry.get(key)
}
```

**Why:** Prevents typos like `vault_envolope`. Map enforces valid transitions at lookup time.

---

### A.2 — Director Uses GSAP Context, Not Global Kill

**OLD (FORBIDDEN):**
```javascript
gsap.killTweensOf('*')  // ← kills everything, unsafe
```

**NEW (REQUIRED):**
```javascript
// src/engine/director/director.js
let morphContext = null

export const director = {
  busy: false,
  elements: null,

  init(elements) {
    this.elements = elements
    // Setup happens here
  },

  async morph(from, to) {
    if (this.busy) return
    this.busy = true

    // Kill previous morph context, not everything
    if (morphContext) morphContext.kill()

    try {
      morphContext = gsap.context(() => {
        const fn = getMorphFn(from, to)
        return fn(this.elements)
      })

      await Promise.race([
        morphContext.promise || Promise.resolve(),
        createTimeout(MORPH_TIMEOUT_MS),
      ])
    } catch (err) {
      console.error('[Director] Morph failed:', err)
      if (morphContext) morphContext.kill()
      this._recover(to)
    } finally {
      this.busy = false
    }
  },

  _recover(targetScene) {
    if (morphContext) morphContext.kill()
    // Safe recovery follows...
  }
}
```

**Why:** GSAP context isolates tweens. Only the current morph is killed. Background elements (glow, particles, music) continue untouched.

---

### A.3 — Recovery Syncs State

**OLD (FORBIDDEN):**
```javascript
_recover(targetScene) {
  gsap.killTweensOf('*')
  const sceneEl = this.elements[targetScene].scene
  gsap.set(sceneEl, { opacity: 1, scale: 1 })
  // state.current is still wrong ← BUG
}
```

**NEW (REQUIRED):**
```javascript
// src/engine/director/director.js
import { state } from '../state.js'

_recover(targetScene) {
  if (morphContext) morphContext.kill()
  const sceneEl = this.elements[targetScene]?.scene
  if (!sceneEl) return

  // Sync visual state
  gsap.set(sceneEl, { opacity: 1, pointerEvents: 'auto', scale: 1 })
  
  // Sync logical state ← CRITICAL
  state.forceScene(targetScene)
}
```

And in state.js:
```javascript
// src/engine/state.js
export function forceScene(sceneName) {
  // Only used in recovery. Caller must be director.
  if (!isValidScene(sceneName)) {
    console.error('[State] forceScene: invalid scene', sceneName)
    return
  }
  current = sceneName
  storage.save(sceneName)
  console.warn('[State] Forced to scene:', sceneName)
}
```

**Why:** Visual state (DOM) and logical state (state.current) must never diverge. Recovery must fix both.

---

### A.4 — Zero String Magic Numbers

**OLD (FORBIDDEN):**
```javascript
gsap.to(envelope, { scale: 0.6, duration: 0.3 })
const STAR_COUNT = 150
const FADE_VOL = 0.25
```

**NEW (REQUIRED):**
```javascript
// src/config.js — SINGLE SOURCE OF TRUTH
export const TIMING = {
  MORPH_TIMEOUT_MS: 10_000,
  MORPH_OVERLAP_BUFFER: 0.2, // morphs overlap by this much
}

export const ANIMATION = {
  ENVELOPE_SCALE_BACK: 0.6,
  ENVELOPE_FADE_BACK: 0.3,
  KEYPAD_WRONG_SHAKE: {
    amplitude: 8,
    duration: 0.15,
  },
}

export const AUDIO = {
  AMBIENT_VOLUME: 0.4,
  SONG_VOLUME: 0.25,
  SONG_FADE_IN_DURATION: 2.0,
  PULSE_VOLUME: 0.6,
}

export const VISUALS = {
  STAR_COUNT: 150,
  CONSTELLATION_STAR_COUNT: 24,
  STAR_TWINKLE_INTERVAL_MIN: 1.5,
  STAR_TWINKLE_INTERVAL_MAX: 4.0,
}

export const COLORS = {
  CRIMSON: '#AC1C35',
  CRIMSON_DEEP: '#7A0E22',
  CRIMSON_GLOW: 'rgba(172, 28, 53, 0.25)',
  BG: '#080106',
  SURFACE: 'rgba(172, 28, 53, 0.10)',
  TEXT: '#FFF0F3',
  MUTED: '#D4A0AA',
  GOLD: '#C9A84C',
  GOLD_SOFT: 'rgba(201, 168, 76, 0.15)',
}

export const PATHS = {
  AUDIO_AMBIENT: '/birthday-vault/audio/ambient.wav',
  AUDIO_PULSE: '/birthday-vault/audio/pulse.wav',
  AUDIO_SONG: '/birthday-vault/audio/song.mp3',
  IMAGE_PRECIOUS: '/birthday-vault/images/precious.jpg',
}
```

**Why:** All magic numbers in one place. Tweaks happen once, apply everywhere. Easy to compare design intent vs. actual values.

---

### A.5 — Assets Centralized

**OLD (FORBIDDEN):**
```javascript
// scattered:
audio.ambient = new Howl({ src: '/birthday-vault/audio/ambient.wav' })
// elsewhere:
img.src = '/birthday-vault/images/precious.jpg'
```

**NEW (REQUIRED):**
```javascript
// src/assets.js
import { PATHS } from './config.js'

export const ASSETS = {
  audio: {
    ambient: null,
    pulse: null,
    song: null,
  },
  images: {
    precious: null,
  },
}

export async function loadAssets() {
  // Initialize Howler
  const Howler = await import('howler')
  ASSETS.audio.ambient = new Howler.Howl({
    src: [PATHS.AUDIO_AMBIENT],
    loop: true,
    volume: AUDIO.AMBIENT_VOLUME,
  })
  ASSETS.audio.pulse = new Howler.Howl({
    src: [PATHS.AUDIO_PULSE],
    volume: AUDIO.PULSE_VOLUME,
  })
  ASSETS.audio.song = new Howler.Howl({
    src: [PATHS.AUDIO_SONG],
    loop: false,
    volume: AUDIO.SONG_VOLUME,
  })

  // Preload image
  const img = new Image()
  img.src = PATHS.IMAGE_PRECIOUS
  ASSETS.images.precious = img

  console.log('[Assets] All assets loaded')
  return ASSETS
}
```

Usage:
```javascript
// src/main.js
import { loadAssets, ASSETS } from './assets.js'
await loadAssets()
// Now ASSETS.audio.song.play() works everywhere
```

**Why:** Single entry point. Easy to add error handling, preloading, alt paths. No import path scattered across 8 files.

---

## PART B: CODEBASE VERIFICATION CHECKLIST

Before each phase, run these checks. Do not proceed if any fail.

### B.1 — File Structure Check
```bash
# Phase 1 and beyond must have exactly this structure:
birthday-vault/
├── src/
│   ├── main.js
│   ├── style.css
│   ├── config.js                    ← NEW (A.4)
│   ├── assets.js                    ← NEW (A.5)
│   ├── index.html
│   ├── engine/
│   │   ├── director/
│   │   │   ├── director.js          ← uses GSAP context (A.2)
│   │   │   ├── morphRegistry.js     ← NEW (A.1, uses Map)
│   │   │   └── morphs/
│   │   │       ├── countdown.js
│   │   │       ├── vault.js
│   │   │       └── [6 more]
│   │   ├── state.js                 ← includes forceScene() (A.3)
│   │   ├── storage.js
│   │   └── time.js
│   ├── scenes/
│   │   ├── countdown.js
│   │   ├── vault.js
│   │   └── [6 more]
│   ├── components/
│   │   ├── keypad.js
│   │   ├── wheel.js
│   │   └── stars.js
│   └── events.js                    ← NEW (EventEmitter, for future polish)
├── public/
│   ├── audio/
│   │   ├── ambient.wav
│   │   ├── pulse.wav
│   │   └── song.mp3
│   ├── images/
│   │   └── precious.jpg
│   └── favicon.svg
├── package.json
├── vite.config.js
└── index.html
```

### B.2 — Config Validation
```javascript
// After creating config.js, run this validation:
import { TIMING, ANIMATION, AUDIO, VISUALS, COLORS, PATHS } from './config.js'

// Check all values are defined
const check = (obj, path) => {
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      throw new Error(`[ConfigCheck] Missing: ${path}.${k}`)
    }
  }
}

check(TIMING, 'TIMING')
check(ANIMATION, 'ANIMATION')
check(AUDIO, 'AUDIO')
check(VISUALS, 'VISUALS')
check(COLORS, 'COLORS')
check(PATHS, 'PATHS')

console.log('✓ Config validation passed')
```

### B.3 — Director Initialization Check
```javascript
// main.js should do this exactly:
import { director } from './engine/director/director.js'
import { state } from './engine/state.js'
import { storage } from './engine/storage.js'

const elements = collectAllElements() // see B.4

director.init(elements)
state.init(elements, storage)

console.log('✓ Director initialized, busy =', director.busy)
console.log('✓ Current scene:', state.current)
```

### B.4 — Elements Collector
```javascript
// src/main.js — This function runs ONCE at startup
function collectAllElements() {
  const els = {
    stage: document.querySelector('#stage'),
    bgLayer: document.querySelector('.bg-layer'),
    particleLayer: document.querySelector('.particle-layer'),

    countdown: {
      scene: document.querySelector('.countdown-scene'),
      days: document.querySelector('#days'),
      hours: document.querySelector('#hours'),
      minutes: document.querySelector('#minutes'),
      seconds: document.querySelector('#seconds'),
      labels: document.querySelectorAll('.countdown-label'),
    },
    vault: {
      scene: document.querySelector('.vault-scene'),
      keypadRing: document.querySelector('.keypad-ring'),
      keypadDigits: document.querySelectorAll('.keypad-digit'),
      codeDisplay: document.querySelector('.code-display'),
      polaroid: document.querySelector('.polaroid'),
      polaroidImg: document.querySelector('.polaroid img'),
    },
    // [8 scenes total, same pattern]
  }

  // Validate all exist
  validateElements(els)
  return els
}

function validateElements(els) {
  const walk = (obj, path = '') => {
    for (const [k, v] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${k}` : k
      if (v === null || v === undefined) {
        throw new Error(`[Elements] Missing selector: ${fullPath}`)
      }
      if (typeof v === 'object' && v.nodeType === undefined) {
        walk(v, fullPath)
      }
    }
  }
  walk(els)
  console.log('✓ All elements collected and validated')
}
```

### B.5 — Morph Registry Check
```javascript
// src/engine/director/morphRegistry.js
// After each morph file is created, add it here and validate:

import { getMorphFn, MORPH_KEYS } from './morphRegistry.js'

// Test all keys are registered
const validTransitions = [
  MORPH_KEYS.COUNTDOWN_TO_VAULT,
  MORPH_KEYS.VAULT_TO_ENVELOPE,
  MORPH_KEYS.ENVELOPE_TO_LETTER,
  MORPH_KEYS.LETTER_TO_PROMISES,
  MORPH_KEYS.PROMISES_TO_MEMORY,
  MORPH_KEYS.MEMORY_TO_FATE,
  MORPH_KEYS.FATE_TO_CONSTELLATION,
  MORPH_KEYS.CONSTELLATION_TO_AFTERGLOW,
]

for (const key of validTransitions) {
  const fn = getMorphFn(key)
  if (typeof fn !== 'function') {
    throw new Error(`[MorphRegistry] Not a function: ${key}`)
  }
}

console.log('✓ All 8 morphs registered and callable')
```

---

## PART C: PHASE-BY-PHASE BUILD SPEC

Each phase has:
1. **Deliverables** (exact files to create/modify)
2. **Verification** (tests to run before proceeding)
3. **Common mistakes** (what breaks this phase)

---

### PHASE 1 — SHELL & DIRECTOR

**Goal:** App boots, morphs between scenes (even if invisible), no errors.

#### Deliverables

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Birthday Vault</title>
  <link rel="stylesheet" href="/birthday-vault/src/style.css">
</head>
<body>
  <div id="stage">
    <!-- Persistent layers -->
    <div class="bg-layer"></div>
    <div class="particle-layer"></div>

    <!-- Scenes (all start hidden) -->
    <div class="countdown-scene" style="opacity: 0">
      <div id="days">00</div>
      <div id="hours">00</div>
      <div id="minutes">00</div>
      <div id="seconds">00</div>
    </div>

    <div class="vault-scene" style="opacity: 0">
      <div class="keypad-ring"></div>
      <div class="code-display">••••</div>
      <div class="polaroid"><img src="/birthday-vault/images/precious.jpg" alt=""></div>
    </div>

    <div class="envelope-scene" style="opacity: 0">
      <div class="envelope">
        <div class="flap"></div>
        <div class="body"></div>
      </div>
    </div>

    <!-- [5 more scenes, same pattern] -->
    <div class="letter-scene" style="opacity: 0"></div>
    <div class="promises-scene" style="opacity: 0"></div>
    <div class="memory-scene" style="opacity: 0"></div>
    <div class="fate-scene" style="opacity: 0"></div>
    <div class="constellation-scene" style="opacity: 0">
      <canvas id="star-canvas"></canvas>
    </div>
    <div class="afterglow-scene" style="opacity: 0"></div>
  </div>

  <script type="module" src="/birthday-vault/src/main.js"></script>
</body>
</html>
```

**package.json**
```json
{
  "name": "birthday-vault",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "gsap": "^3.15.0",
    "howler": "^2.2.4",
    "lenis": "^1.3.23",
    "vanilla-tilt": "^1.8.1"
  },
  "devDependencies": {
    "vite": "^8.0.0"
  }
}
```

**vite.config.js**
```javascript
export default {
  base: '/birthday-vault/',
  server: {
    port: 5173,
  },
}
```

**src/config.js** — Use exactly as specified in A.4 above.

**src/assets.js** — Use exactly as specified in A.5 above.

**src/engine/state.js**
```javascript
// src/engine/state.js
export let current = 'countdown'
let elements = null
let storage = null

const SCENES = [
  'countdown',
  'vault',
  'envelope',
  'letter',
  'promises',
  'memory',
  'fate',
  'constellation',
  'afterglow',
]

const VALID_TRANSITIONS = new Set([
  'countdown_vault',
  'vault_envelope',
  'envelope_letter',
  'letter_promises',
  'promises_memory',
  'memory_fate',
  'fate_constellation',
  'constellation_afterglow',
])

export function init(els, stor) {
  elements = els
  storage = stor
}

export function getCurrent() {
  return current
}

export function isValidScene(sceneName) {
  return SCENES.includes(sceneName)
}

export function isValidTransition(from, to) {
  return VALID_TRANSITIONS.has(`${from}_${to}`)
}

export function forceScene(sceneName) {
  // RECOVERY ONLY
  if (!isValidScene(sceneName)) {
    console.error('[State] forceScene: invalid scene', sceneName)
    return false
  }
  current = sceneName
  storage.save(sceneName)
  console.warn('[State] Forced to scene:', sceneName)
  return true
}

export function requestTransition(to) {
  if (!isValidTransition(current, to)) {
    console.error('[State] Invalid transition:', current, '→', to)
    return false
  }
  // Scenes call this. Director handles actual transition.
  return true
}
```

**src/engine/storage.js**
```javascript
// src/engine/storage.js
const STORAGE_KEY = 'birthday-vault-scene'

export const storage = {
  save(sceneName) {
    try {
      localStorage.setItem(STORAGE_KEY, sceneName)
    } catch (err) {
      console.error('[Storage] Save failed:', err)
    }
  },

  load() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'countdown'
    } catch (err) {
      console.error('[Storage] Load failed:', err)
      return 'countdown'
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('[Storage] Clear failed:', err)
    }
  },
}
```

**src/engine/time.js**
```javascript
// src/engine/time.js
// Parse network time, calculate countdown to November 7, 2026, midnight

export async function getNetworkTime() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Africa/Lagos')
    const data = await response.json()
    return new Date(data.datetime)
  } catch (err) {
    console.warn('[Time] Network fetch failed, using local time:', err)
    return new Date()
  }
}

export function calculateCountdown(nowDate) {
  const target = new Date('2026-11-07T00:00:00').getTime()
  const now = nowDate.getTime()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isZero: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isZero: false }
}
```

**src/engine/director/morphRegistry.js**
```javascript
// src/engine/director/morphRegistry.js
export const MORPH_KEYS = {
  COUNTDOWN_TO_VAULT: 'countdown_vault',
  VAULT_TO_ENVELOPE: 'vault_envelope',
  ENVELOPE_TO_LETTER: 'envelope_letter',
  LETTER_TO_PROMISES: 'letter_promises',
  PROMISES_TO_MEMORY: 'promises_memory',
  MEMORY_TO_FATE: 'memory_fate',
  FATE_TO_CONSTELLATION: 'fate_constellation',
  CONSTELLATION_TO_AFTERGLOW: 'constellation_afterglow',
}

// Placeholder functions (replaced per phase)
async function notImplemented() {
  console.warn('[Morph] Not yet implemented, skipping')
  return Promise.resolve()
}

const registry = new Map([
  [MORPH_KEYS.COUNTDOWN_TO_VAULT, notImplemented],
  [MORPH_KEYS.VAULT_TO_ENVELOPE, notImplemented],
  [MORPH_KEYS.ENVELOPE_TO_LETTER, notImplemented],
  [MORPH_KEYS.LETTER_TO_PROMISES, notImplemented],
  [MORPH_KEYS.PROMISES_TO_MEMORY, notImplemented],
  [MORPH_KEYS.MEMORY_TO_FATE, notImplemented],
  [MORPH_KEYS.FATE_TO_CONSTELLATION, notImplemented],
  [MORPH_KEYS.CONSTELLATION_TO_AFTERGLOW, notImplemented],
])

export function getMorphFn(key) {
  if (!registry.has(key)) {
    const valid = Array.from(registry.keys()).join(', ')
    throw new Error(`[MorphRegistry] Unknown morph key: ${key}\nValid keys: ${valid}`)
  }
  return registry.get(key)
}

export function setMorphFn(key, fn) {
  if (!registry.has(key)) {
    throw new Error(`[MorphRegistry] Cannot set unknown key: ${key}`)
  }
  registry.set(key, fn)
  console.log(`[MorphRegistry] Registered morph: ${key}`)
}
```

**src/engine/director/director.js** — Use exactly as specified in A.2 above, with:
- `GSAP context` isolation
- `try/finally` with `busy` flag
- `_recover()` that calls `state.forceScene()`
- Import from `morphRegistry.js`

**src/style.css** — Minimal, Phase 1 only
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --crimson: #AC1C35;
  --crimson-deep: #7A0E22;
  --crimson-glow: rgba(172, 28, 53, 0.25);
  --bg: #080106;
  --surface: rgba(172, 28, 53, 0.10);
  --surface-rim: rgba(172, 28, 53, 0.22);
  --text: #FFF0F3;
  --muted: #D4A0AA;
  --gold: #C9A84C;
  --gold-soft: rgba(201, 168, 76, 0.15);
  --vh: 1vh;
}

html, body {
  width: 100%;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

#stage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
}

.bg-layer, .particle-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* All scenes positioned absolutely within stage */
.countdown-scene,
.vault-scene,
.envelope-scene,
.letter-scene,
.promises-scene,
.memory-scene,
.fate-scene,
.constellation-scene,
.afterglow-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}

.countdown-scene {
  opacity: 1;
  pointer-events: auto;
}

/* Placeholder scene styles */
.countdown-scene div { font-size: 4rem; font-weight: 700; }
.vault-scene { background: rgba(0,0,0,0.3); }
.envelope-scene { background: rgba(0,0,0,0.3); }
```

**src/main.js**
```javascript
// src/main.js
import { director } from './engine/director/director.js'
import { state } from './engine/state.js'
import { storage } from './engine/storage.js'
import { loadAssets } from './assets.js'

// Collect all DOM elements once
function collectAllElements() {
  const els = {
    stage: document.querySelector('#stage'),
    bgLayer: document.querySelector('.bg-layer'),
    particleLayer: document.querySelector('.particle-layer'),

    countdown: {
      scene: document.querySelector('.countdown-scene'),
      days: document.querySelector('#days'),
      hours: document.querySelector('#hours'),
      minutes: document.querySelector('#minutes'),
      seconds: document.querySelector('#seconds'),
    },
    vault: {
      scene: document.querySelector('.vault-scene'),
      keypadRing: document.querySelector('.keypad-ring'),
      codeDisplay: document.querySelector('.code-display'),
      polaroid: document.querySelector('.polaroid'),
    },
    envelope: {
      scene: document.querySelector('.envelope-scene'),
      envelope: document.querySelector('.envelope'),
    },
    letter: {
      scene: document.querySelector('.letter-scene'),
    },
    promises: {
      scene: document.querySelector('.promises-scene'),
    },
    memory: {
      scene: document.querySelector('.memory-scene'),
    },
    fate: {
      scene: document.querySelector('.fate-scene'),
    },
    constellation: {
      scene: document.querySelector('.constellation-scene'),
      canvas: document.querySelector('#star-canvas'),
    },
    afterglow: {
      scene: document.querySelector('.afterglow-scene'),
    },
  }

  // Validate
  validateElements(els)
  return els
}

function validateElements(els) {
  const walk = (obj, path = '') => {
    for (const [k, v] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${k}` : k
      if (v === null || v === undefined) {
        throw new Error(`[Elements] Missing: ${fullPath}`)
      }
      if (typeof v === 'object' && !v.nodeType && !v.getContext) {
        walk(v, fullPath)
      }
    }
  }
  walk(els)
  console.log('✓ All elements validated')
}

async function bootstrap() {
  // Handle iOS vh fix
  const updateVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  }
  updateVh()
  window.addEventListener('resize', updateVh)

  // Load assets
  try {
    await loadAssets()
    console.log('✓ Assets loaded')
  } catch (err) {
    console.error('[Bootstrap] Asset loading failed:', err)
  }

  // Collect elements
  const elements = collectAllElements()

  // Initialize systems
  director.init(elements)
  state.init(elements, storage)

  // Restore previous scene or start at countdown
  const savedScene = storage.load()
  if (state.isValidScene(savedScene)) {
    state.current = savedScene
    console.log('✓ Restored scene:', savedScene)
  }

  console.log('✓ Birthday Vault ready')
  console.log('  Current scene:', state.current)
  console.log('  Director busy:', director.busy)
}

// Bootstrap when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap)
} else {
  bootstrap()
}
```

#### Verification Checklist (Phase 1)

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts Vite, accessible at `http://localhost:5173`
- [ ] Console shows: `✓ Birthday Vault ready`
- [ ] No console errors
- [ ] `director.init()` was called
- [ ] `state.current` === `'countdown'`
- [ ] `director.busy` === `false`
- [ ] All 8 scene divs exist in DOM and have `opacity: 0`
- [ ] Config.js loads without errors: `import { TIMING } from './config.js'` works
- [ ] Assets can be imported: `import { loadAssets } from './assets.js'` works
- [ ] MorphRegistry is callable: `getMorphFn(MORPH_KEYS.COUNTDOWN_TO_VAULT)` returns a function

#### Common Mistakes (Phase 1)

| Mistake | Fix |
|---------|-----|
| `Cannot read property 'scene' of undefined` | Element selector wrong in `collectAllElements()`. Check class name in HTML. |
| `Morph failed: no morph defined` | `morphRegistry.js` not imported in director, or morph key typo. Use constants. |
| `director.busy` stays true | Missing `finally` block, or GSAP timeline doesn't resolve. Check timeline returns properly. |
| Assets fail to load | Path mismatch. Ensure `vite.config.js` has `base: '/birthday-vault/'`. |
| Module not found errors | Check all imports have `.js` extension. Check file paths match directory structure. |

---

### PHASE 2 — COUNTDOWN & VAULT

**Goal:** Countdown ticks, enters passcode, wrong code shakes, correct code unlocks.

#### Deliverables

**src/engine/time.js** — Already created in Phase 1. Extend with:
```javascript
export function formatTime(num, digits = 2) {
  return String(num).padStart(digits, '0')
}
```

**src/scenes/countdown.js**
```javascript
// src/scenes/countdown.js
import { director } from '../engine/director/director.js'
import { state } from '../engine/state.js'
import { getNetworkTime, calculateCountdown, formatTime } from '../engine/time.js'

let tickInterval = null
let elements = null

export function init(els) {
  elements = els.countdown
  startTick()
}

function startTick() {
  // Update every 1s
  tickInterval = setInterval(async () => {
    const now = await getNetworkTime()
    const { days, hours, minutes, seconds, isZero } = calculateCountdown(now)

    elements.days.textContent = formatTime(days, 2)
    elements.hours.textContent = formatTime(hours, 2)
    elements.minutes.textContent = formatTime(minutes, 2)
    elements.seconds.textContent = formatTime(seconds, 2)

    if (isZero && !director.busy) {
      clearInterval(tickInterval)
      console.log('[Countdown] Time reached!')
      await director.morph('countdown', 'vault')
    }
  }, 1000)
}

export function destroy() {
  if (tickInterval) clearInterval(tickInterval)
}
```

**src/components/keypad.js**
```javascript
// src/components/keypad.js
// Circular keypad: 12 digits arranged in a ring
// Returns DOM element, exposes: getCode(), setCode(), reset()

export function createKeypad() {
  const container = document.createElement('div')
  container.className = 'keypad-ring'
  container.style.cssText = `
    position: relative;
    width: 300px;
    height: 300px;
    border: 2px solid var(--crimson);
    border-radius: 50%;
  `

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const anglePerDigit = 360 / digits.length
  const radius = 120

  digits.forEach((digit, i) => {
    const angle = (i * anglePerDigit - 90) * (Math.PI / 180)
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)

    const btn = document.createElement('button')
    btn.className = 'keypad-digit'
    btn.textContent = digit
    btn.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--crimson);
      background: var(--surface);
      color: var(--text);
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      left: 50%;
      top: 50%;
      transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px));
      transition: all 0.2s;
    `

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'var(--crimson)'
      btn.style.scale = '1.15'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'var(--surface)'
      btn.style.scale = '1'
    })

    btn.dataset.digit = digit
    container.appendChild(btn)
  })

  return container
}

export function keypadAPI(ringEl) {
  let code = ''
  const MAX_LENGTH = 4

  return {
    getCode: () => code,
    setCode: (newCode) => { code = newCode },
    reset: () => { code = '' },
    append: (digit) => {
      if (code.length < MAX_LENGTH) {
        code += digit
      }
    },
    backspace: () => {
      code = code.slice(0, -1)
    },
  }
}
```

**src/scenes/vault.js**
```javascript
// src/scenes/vault.js
import { director } from '../engine/director/director.js'
import { AUDIO } from '../config.js'
import { ASSETS } from '../assets.js'

const PASSCODE = atob('MTEwNw==') // "1107"

let elements = null
let keypadAPI = null

export function init(els, api) {
  elements = els.vault
  keypadAPI = api

  // Attach digit buttons
  const digits = elements.keypadRing.querySelectorAll('.keypad-digit')
  digits.forEach(btn => {
    btn.addEventListener('click', () => handleDigit(btn.dataset.digit))
  })
}

async function handleDigit(digit) {
  keypadAPI.append(digit)
  updateDisplay()

  if (keypadAPI.getCode().length === 4) {
    await checkCode()
  }
}

function updateDisplay() {
  const code = keypadAPI.getCode()
  elements.codeDisplay.textContent = '•'.repeat(code.length) + '•'.repeat(4 - code.length)
}

async function checkCode() {
  const code = keypadAPI.getCode()

  if (code === PASSCODE) {
    console.log('[Vault] Code correct!')
    keypadAPI.reset()
    updateDisplay()
    await director.morph('vault', 'envelope')
  } else {
    console.log('[Vault] Code wrong:', code)
    playWrongCodeAnimation()
    ASSETS.audio.pulse.play()
    keypadAPI.reset()
    updateDisplay()
  }
}

function playWrongCodeAnimation() {
  // Shake keypad
  const ring = elements.keypadRing
  let originalX = ring.offsetLeft
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      ring.style.transform = i % 2 === 0 ? 'translateX(-8px)' : 'translateX(8px)'
    }, i * 50)
  }
  setTimeout(() => {
    ring.style.transform = 'translateX(0)'
  }, 300)
}
```

**src/engine/director/morphs/countdown.js**
```javascript
// src/engine/director/morphs/countdown.js
import { gsap } from 'gsap'

export async function morphCountdownToVault(elements) {
  const { countdown, vault } = elements
  const timeline = gsap.timeline()

  // Countdown numbers shrink to center
  timeline.to([countdown.days, countdown.hours, countdown.minutes, countdown.seconds], {
    scale: 0.3,
    opacity: 0,
    duration: 0.4,
  }, 0)

  // Keypad expands from behind
  timeline.fromTo(vault.keypadRing, {
    scale: 0,
    opacity: 0,
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.6,
  }, 0.2)

  // Polaroid drifts in
  timeline.fromTo(vault.polaroid, {
    x: 120,
    opacity: 0,
    rotate: -3,
  }, {
    x: 0,
    opacity: 1,
    rotate: 0,
    duration: 0.5,
  }, 0.5)

  // Code display fades in
  timeline.fromTo(vault.codeDisplay, {
    opacity: 0,
  }, {
    opacity: 1,
    duration: 0.3,
  }, 0.7)

  // Hide countdown scene
  timeline.to(countdown.scene, {
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.2,
  }, 0)

  // Show vault scene
  timeline.fromTo(vault.scene, {
    opacity: 0,
    pointerEvents: 'none',
  }, {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.3,
  }, 0.1)

  return timeline
}
```

**src/engine/director/morphs/vault.js**
```javascript
// src/engine/director/morphs/vault.js
import { gsap } from 'gsap'

export async function morphVaultToEnvelope(elements) {
  const { vault, envelope } = elements
  const timeline = gsap.timeline()

  // Keypad ring expands as ripple, fills screen
  timeline.to(vault.keypadRing, {
    scale: 5,
    opacity: 0,
    duration: 0.4,
  }, 0)

  // Background flashes crimson
  timeline.to(elements.bgLayer, {
    backgroundColor: 'var(--crimson)',
    duration: 0.2,
  }, 0)

  timeline.to(elements.bgLayer, {
    backgroundColor: 'var(--bg)',
    duration: 0.2,
  }, 0.2)

  // Code display and polaroid fade
  timeline.to([vault.codeDisplay, vault.polaroid], {
    opacity: 0,
    duration: 0.3,
  }, 0.4)

  // Envelope appears floating
  timeline.fromTo(envelope.scene, {
    opacity: 0,
    pointerEvents: 'none',
  }, {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.4,
  }, 0.5)

  timeline.fromTo(envelope.envelope, {
    scale: 0.6,
    opacity: 0,
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
  }, 0.5)

  // Hide vault
  timeline.to(vault.scene, {
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.2,
  }, 0)

  return timeline
}
```

**src/style.css** — Add:
```css
.keypad-digit {
  outline: none;
  box-shadow: 0 0 8px rgba(172, 28, 53, 0.3);
}

.keypad-digit:active {
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0.95) !important;
}

.polaroid {
  position: relative;
  width: 180px;
  height: 220px;
  background: white;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: rotate(-3deg);
}

.polaroid img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.polaroid::after {
  content: 'Nov 7, 2026';
  display: block;
  text-align: center;
  color: #333;
  font-size: 0.9rem;
  margin-top: 8px;
  font-family: 'Courier New', monospace;
}
```

**src/main.js** — Extend:
```javascript
import { init as initCountdown } from './scenes/countdown.js'
import { init as initVault } from './scenes/vault.js'
import { createKeypad, keypadAPI } from './components/keypad.js'

// After director.init():
initCountdown(elements)

const keypadRing = createKeypad()
elements.vault.keypadRing = keypadRing
// If keypad is rendered via HTML instead, just use the API
const keypadApi = keypadAPI(keypadRing)
initVault(elements, keypadApi)
```

#### Verification Checklist (Phase 2)

- [ ] Countdown displays and ticks every second
- [ ] Countdown format is `DD HH MM SS`
- [ ] Keypad renders as 12 buttons in a circle
- [ ] Clicking digits appends to code display (`••••`)
- [ ] After 4 digits, code is checked immediately
- [ ] Wrong code: shake animation plays + pulse sound plays, code resets
- [ ] Correct code (`1107`): morphs to envelope scene
- [ ] Morph timeline completes without errors
- [ ] No console errors during digit entry or morph

#### Common Mistakes (Phase 2)

| Mistake | Fix |
|---------|-----|
| Countdown doesn't tick | `startTick()` not called or interval not set. Check `scenes/countdown.js` init. |
| Passcode always wrong | Check `atob('MTEwNw==')` actually equals `'1107'`. Test in browser console. |
| Keypad buttons off-circle | Math error in angle calculation. Verify `anglePerDigit * radius`. |
| Morph doesn't trigger | `director.morph()` may be called while `busy = true`. Check previous morph completed. |
| Wrong code sound doesn't play | `ASSETS.audio.pulse` may not be loaded. Check `loadAssets()` completes before vault init. |

---

### PHASE 3 — ENVELOPE & LETTER

**Goal:** Envelope opens with flap animation, letter paper rises, text lines appear.

#### Deliverables

**src/components/envelope.js** (new)
```javascript
// Renders envelope DOM: flap, body, wax seal
export function createEnvelope() {
  const envelope = document.createElement('div')
  envelope.className = 'envelope'
  envelope.style.cssText = `
    position: relative;
    width: 280px;
    height: 200px;
  `

  const body = document.createElement('div')
  body.className = 'envelope-body'
  body.style.cssText = `
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--surface);
    border: 2px solid var(--crimson);
    border-radius: 2px;
  `

  const flap = document.createElement('div')
  flap.className = 'envelope-flap'
  flap.style.cssText = `
    position: absolute;
    width: 100%;
    height: 50%;
    top: 0;
    background: var(--crimson);
    transform-origin: top center;
    transform-style: preserve-3d;
    border: 1px solid var(--crimson-deep);
  `

  const seal = document.createElement('div')
  seal.className = 'envelope-seal'
  seal.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gold);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(201, 168, 76, 0.5);
  `

  envelope.appendChild(body)
  envelope.appendChild(flap)
  envelope.appendChild(seal)

  return envelope
}

export function envelopeAPI(envelopeEl) {
  const flap = envelopeEl.querySelector('.envelope-flap')
  const seal = envelopeEl.querySelector('.envelope-seal')

  return {
    open: async () => {
      // Flap animation handled by morph
      return Promise.resolve()
    },
    getFlap: () => flap,
    getSeal: () => seal,
    getElement: () => envelopeEl,
  }
}
```

**src/scenes/letter.js** (new)
```javascript
// src/scenes/letter.js
export const LETTER_LINES = [
  'To Precious,',
  '',
  'Happy birthday, my love.',
  '',
  'I wanted to give you something',
  'that lives inside a moment—',
  'a place where time stops,',
  'and only you and this exist.',
  '',
  'Everything that follows',
  'is proof.',
  '',
  'Open your heart.',
  '',
  '— Your Popsi',
]

let elements = null

export function init(els) {
  elements = els.letter
  renderLetterContent()
}

function renderLetterContent() {
  const paperEl = document.createElement('div')
  paperEl.className = 'letter-paper'
  paperEl.style.cssText = `
    position: relative;
    width: 340px;
    height: 440px;
    background: rgba(255, 240, 243, 0.95);
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `

  const contentEl = document.createElement('div')
  contentEl.className = 'letter-content'
  paperEl.appendChild(contentEl)

  LETTER_LINES.forEach((line, i) => {
    const lineEl = document.createElement('p')
    lineEl.textContent = line
    lineEl.style.cssText = `
      opacity: 0;
      color: #333;
      font-size: 1rem;
      line-height: 1.6;
      margin: 8px 0;
      font-family: Georgia, serif;
    `
    lineEl.dataset.index = i
    contentEl.appendChild(lineEl)
  })

  const continueBtn = document.createElement('button')
  continueBtn.textContent = 'Continue'
  continueBtn.style.cssText = `
    opacity: 0;
    position: absolute;
    bottom: 30px;
    right: 40px;
    padding: 8px 16px;
    background: var(--crimson);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  `
  continueBtn.dataset.button = 'letter-continue'
  paperEl.appendChild(continueBtn)

  elements.scene.appendChild(paperEl)
  elements.paper = paperEl
  elements.lines = contentEl.querySelectorAll('p')
  elements.continueBtn = continueBtn
}

export function getLinesForAnimation() {
  return Array.from(elements.lines || [])
}

export function getContinueBtn() {
  return elements.continueBtn
}

export function getPaper() {
  return elements.paper
}
```

**src/engine/director/morphs/envelope.js** (new)
```javascript
// src/engine/director/morphs/envelope.js
import { gsap } from 'gsap'
import { ASSETS } from '../../assets.js'

export async function morphEnvelopeToLetter(elements) {
  const { envelope, letter } = elements
  const timeline = gsap.timeline()

  const flap = envelope.envelope.querySelector('.envelope-flap')
  const seal = envelope.envelope.querySelector('.envelope-seal')
  const paper = letter.paper

  // Open flap (rotate on X axis)
  timeline.to(flap, {
    rotateX: -160,
    duration: 0.5,
  }, 0)

  // Dissolve seal
  timeline.to(seal, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
  }, 0.1)

  // Paper rises from envelope
  timeline.fromTo(paper, {
    y: 60,
    opacity: 0,
    scale: 0.8,
  }, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.5,
  }, 0.3)

  // Envelope recedes
  timeline.to(envelope.envelope, {
    scale: 0.6,
    opacity: 0.3,
    duration: 0.4,
  }, 0.6)

  // Hide envelope scene
  timeline.to(envelope.scene, {
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.2,
  }, 0)

  // Show letter scene
  timeline.fromTo(letter.scene, {
    opacity: 0,
    pointerEvents: 'none',
  }, {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.3,
  }, 0.1)

  // Start ambient audio
  ASSETS.audio.ambient.play()

  // Reveal letter lines (after paper settles)
  const lines = letter.paper.querySelectorAll('p')
  lines.forEach((line, i) => {
    timeline.to(line, {
      opacity: 1,
      duration: 0.4,
    }, 1.0 + i * 0.15)
  })

  // Reveal continue button
  const continueBtn = letter.paper.querySelector('button')
  timeline.to(continueBtn, {
    opacity: 1,
    duration: 0.3,
  }, 1.0 + lines.length * 0.15 + 0.3)

  return timeline
}
```

**src/engine/director/morphs/letter.js** (new)
```javascript
// src/engine/director/morphs/letter.js
import { gsap } from 'gsap'

export async function morphLetterToPromises(elements) {
  const { letter, promises } = elements
  const timeline = gsap.timeline()

  const paper = letter.paper
  const lines = letter.paper.querySelectorAll('p')
  const continueBtn = letter.paper.querySelector('button')

  // Fade out text
  timeline.to(lines, {
    opacity: 0,
    y: -8,
    stagger: 0.05,
    duration: 0.3,
  }, 0)

  timeline.to(continueBtn, {
    opacity: 0,
    duration: 0.2,
  }, 0)

  // Dim paper slightly (stays visible as backdrop)
  timeline.to(paper, {
    opacity: 0.5,
    duration: 0.3,
  }, 0.2)

  // Hide letter scene text but keep paper
  timeline.to(letter.scene, {
    pointerEvents: 'none',
    duration: 0,
  }, 0.5)

  // Promise cards appear (on the paper)
  // This is stubbed; actual cards rendered by promises scene
  timeline.fromTo(promises.scene, {
    opacity: 0,
  }, {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.4,
  }, 0.4)

  return timeline
}
```

**src/style.css** — Add:
```css
.letter-paper {
  font-weight: 400;
  letter-spacing: 0.3px;
}

.letter-paper p {
  white-space: pre-wrap;
}

.letter-paper button {
  transition: all 0.2s;
}

.letter-paper button:hover {
  background: var(--crimson-deep);
  transform: scale(1.05);
}

.envelope-body {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.envelope-flap {
  cursor: pointer;
  transition: none; /* GSAP controls this */
}
```

**src/main.js** — Extend:
```javascript
import { init as initLetter } from './scenes/letter.js'

// After director.init():
initLetter(elements)
```

#### Verification Checklist (Phase 3)

- [ ] Envelope visible after vault morph completes
- [ ] Clicking envelope (or letting morph trigger) opens flap
- [ ] Flap rotates on X axis smoothly
- [ ] Wax seal shrinks and fades
- [ ] Letter paper rises from inside envelope
- [ ] Envelope recedes behind paper
- [ ] Letter lines appear one by one, from top to bottom
- [ ] Continue button appears after last line
- [ ] Ambient audio plays when envelope opens
- [ ] Ambient audio does not overlap/restart if heard previously
- [ ] Continue button click triggers morph to promises scene
- [ ] No console errors during morph

---

### PHASE 4 — PROMISES & MEMORY (Abbreviated for space)

Build exactly per original plan:
- `src/scenes/promises.js` — 4 heart cards, flip logic, state unlock
- `src/scenes/memory.js` — 4 memory cards + 1 hidden card, scatter logic
- `src/engine/director/morphs/promises.js` — cards lift off paper
- `src/engine/director/morphs/memory.js` — cards converge into fate position

---

### PHASE 5 — FATE ENGINE

- `src/components/wheel.js` — CSS wheel segments from memory card positions
- `src/scenes/fate.js` — spin, outcome display
- `src/engine/director/morphs/fate.js` — memory cards rotate, morph to wheel

---

### PHASE 6 — CONSTELLATION

- `src/components/stars.js` — Canvas: star field, heart constellation, twinkle
- `src/scenes/constellation.js` — canvas mount, sequence orchestration
- `src/engine/director/morphs/constellation.js` — wheel explodes to stars

---

### PHASE 7 — AFTERGLOW & CLOSING

- `src/scenes/afterglow.js` — closing message, buttons
- `src/engine/director/morphs/constellation.js` → extend to handle afterglow transition
- Song starts at constellation, continues through afterglow

---

### PHASE 8 — POLISH

Mobile viewport fixes, reduced motion, cross-browser audio, deployment.

---

### PHASE 9 — CONTENT FILL

Replace placeholder data with real letter, memories, promises, outcomes.

---

## PART D: CRITICAL RUNTIME CHECKS

These run silently on every app boot. If any fail, app stops and logs the error.

```javascript
// src/engine/startup-validation.js
export async function validateAll() {
  const checks = [
    () => validateConfig(),
    () => validateElements(),
    () => validateAssets(),
    () => validateDirector(),
    () => validateState(),
  ]

  for (const check of checks) {
    try {
      await check()
    } catch (err) {
      console.error('[Validation]', err)
      throw err
    }
  }

  console.log('✓ All runtime checks passed')
}

function validateConfig() {
  const { TIMING, ANIMATION, AUDIO, VISUALS, COLORS, PATHS } = window.__CONFIG__
  if (!TIMING || !ANIMATION) throw new Error('Config not loaded')
}

function validateElements() {
  const stage = document.querySelector('#stage')
  if (!stage) throw new Error('Missing #stage container')
  const scenes = document.querySelectorAll('[class*="-scene"]')
  if (scenes.length < 8) throw new Error('Not all 8 scenes in DOM')
}

function validateAssets() {
  // Check Howler is loaded, audio objects exist
  if (!window.Howl) throw new Error('Howler not loaded')
}

function validateDirector() {
  if (director.current === undefined) throw new Error('Director not initialized')
}

function validateState() {
  if (state.getCurrent() === undefined) throw new Error('State not initialized')
}
```

Called in `main.js`:
```javascript
import { validateAll } from './engine/startup-validation.js'
await validateAll()
```

---

## PART E: DEPLOYMENT CHECKLIST

Before pushing to GitHub Pages:

```bash
✓ npm run build completes without errors
✓ dist/ directory created
✓ dist/index.html is valid HTML
✓ All assets copied to dist/ (audio/, images/)
✓ vite.config.js has base: '/birthday-vault/'
✓ GitHub Pages settings point to /dist on main branch
✓ Test at https://highnine699-del.github.io/birthday-vault/
✓ All scenes accessible without 404
✓ Audio plays
✓ Countdown ticks if before Nov 7, 2026
✓ Passcode works
✓ Console clean of errors
✓ Lighthouse accessibility score >90
✓ Mobile viewport tested (iOS + Android)
✓ Reduced motion respected (@media prefers-reduced-motion)
```

---

## PART F: EMERGENCY RECOVERY

If app corrupts (e.g., state and DOM out of sync):

```javascript
// Run in browser console:
localStorage.removeItem('birthday-vault-scene')
director.forceScene = (s) => director._recover(s)
director.forceScene('countdown')
location.reload()
```

---

**BUILD START:** June 27, 2026
**PHASE 1 TARGET:** Same day
**PHASE 2–3 TARGET:** June 28–29
**POLISH & DEPLOY:** June 30
**UNLOCK:** November 7, 2026, 00:00 UTC+1

---

## FINAL RULES

1. **Never skip validation.** Always run verification before next phase.
2. **Never commit if console has errors.** Even warnings should be addressed.
3. **Always test on mobile.** Viewport, touch, reduced motion.
4. **Always backup before refactor.** Use git branches.
5. **Configs and assets centralized.** No magic strings scattered.
6. **Recovery must sync state + DOM.** Both or nothing.
7. **Morphs isolated with context.** No global tweens killed.
8. **Passcode never plain text.** Always base64.
9. **Countdown fetches network time.** Fallback to local only.
10. **Audio starts at first interaction.** Then continues autonomously.

---

**END OF MASTER PROMPT**

This prompt is self-contained. With codebase and this document, you need no other context to build Birthday Vault to production standard.
