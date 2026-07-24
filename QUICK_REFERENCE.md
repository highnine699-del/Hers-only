# BIRTHDAY VAULT — QUICK REFERENCE & TROUBLESHOOTING

---

## QUICK START

```bash
git clone https://github.com/highnine699-del/birthday-vault.git
cd birthday-vault
npm install
npm run dev
# Open http://localhost:5173
```

---

## FILE STRUCTURE CHEAT SHEET

```
birthday-vault/
├── src/
│   ├── main.js                 ← app entry, element collector, bootstrapper
│   ├── config.js               ← ALL magic numbers (EDIT HERE, not in code)
│   ├── assets.js               ← Howler setup, image preload
│   ├── style.css               ← global styles + CSS variables
│   ├── index.html              ← single HTML file, 9 scene divs
│   │
│   ├── engine/
│   │   ├── state.js            ← current scene, validation, forceScene()
│   │   ├── storage.js          ← localStorage read/write
│   │   ├── time.js             ← network time, countdown calc
│   │   └── director/
│   │       ├── director.js     ← busy lock, morph router, GSAP context
│   │       ├── morphRegistry.js ← Map of all 8 morphs, MORPH_KEYS constants
│   │       └── morphs/
│   │           ├── countdown.js    ↓ numbers→keypad ring
│   │           ├── vault.js        ↓ ripple→envelope
│   │           ├── envelope.js     ↓ paper rise→letter
│   │           ├── letter.js       ↓ cards lift→promises
│   │           ├── promises.js     ↓ fold→memory
│   │           ├── memory.js       ↓ converge→fate
│   │           ├── fate.js         ↓ explode→stars
│   │           └── constellation.js ↓ dim→afterglow
│   │
│   ├── scenes/
│   │   ├── countdown.js     ← display + tick + midnight check
│   │   ├── vault.js         ← keypad input + passcode logic
│   │   ├── envelope.js      ← [stubbed]
│   │   ├── letter.js        ← LETTER_LINES array + text reveal
│   │   ├── promises.js      ← CARDS array + flip state
│   │   ├── memory.js        ← MEMORIES array + hidden unlock
│   │   ├── fate.js          ← wheel spin + outcomes
│   │   ├── constellation.js ← canvas orchestration
│   │   └── afterglow.js     ← closing screen
│   │
│   └── components/
│       ├── keypad.js        ← circular keypad DOM + API
│       ├── wheel.js         ← CSS wheel segments
│       └── stars.js         ← canvas: stars, heart, twinkle
│
├── public/
│   ├── audio/
│   │   ├── ambient.wav      ← soft background (loops, Phase 3+)
│   │   ├── pulse.wav        ← wrong passcode feedback
│   │   └── song.mp3         ← closing song (Phase 6+)
│   └── images/
│       └── precious.jpg     ← recipient's photo
│
├── package.json
├── vite.config.js
└── index.html (top level)
```

---

## COMMON OPERATIONS

### Update Magic Number (e.g., star count)

**OLD (WRONG):**
```javascript
// src/components/stars.js
const STAR_COUNT = 150
```

**NEW (RIGHT):**
1. Edit `src/config.js`:
   ```javascript
   export const VISUALS = {
     STAR_COUNT: 150,  // ← change here
   }
   ```

2. Use in code:
   ```javascript
   import { VISUALS } from '../config.js'
   const stars = []
   for (let i = 0; i < VISUALS.STAR_COUNT; i++) { ... }
   ```

**Why:** Single source of truth. All refs auto-update.

---

### Add New Audio (e.g., heart beat)

1. Place file in `public/audio/heartbeat.wav`

2. Add to `src/config.js`:
   ```javascript
   export const PATHS = {
     AUDIO_AMBIENT: '/birthday-vault/audio/ambient.wav',
     AUDIO_PULSE: '/birthday-vault/audio/pulse.wav',
     AUDIO_SONG: '/birthday-vault/audio/song.mp3',
     AUDIO_HEARTBEAT: '/birthday-vault/audio/heartbeat.wav',  // ← new
   }
   ```

3. Load in `src/assets.js`:
   ```javascript
   ASSETS.audio.heartbeat = new Howler.Howl({
     src: [PATHS.AUDIO_HEARTBEAT],
     volume: AUDIO.HEARTBEAT_VOLUME || 0.3,
   })
   ```

4. Use anywhere:
   ```javascript
   import { ASSETS } from '../assets.js'
   ASSETS.audio.heartbeat.play()
   ```

---

### Change Timing (e.g., morph is too slow)

**Scenario:** Envelope opens too slowly.

1. Open `src/config.js`
2. Find timing:
   ```javascript
   export const TIMING = {
     MORPH_TIMEOUT_MS: 10_000,
   }
   ```

3. If a specific morph is slow, change in `src/engine/director/morphs/envelope.js`:
   ```javascript
   timeline.to(flap, {
     rotateX: -160,
     duration: 0.3,  // ← was 0.5, now faster
   }, 0)
   ```

4. Test and iterate.

---

### Test Morph in Isolation

```javascript
// In browser console:
import { director } from './src/engine/director/director.js'

// Test countdown → vault
await director.morph('countdown', 'vault')
console.log('Morph completed')
console.log('Director busy:', director.busy)

// Manually verify vault scene is visible:
document.querySelector('.vault-scene').style.opacity
// Should be 1
```

---

### Force Scene (Emergency Recovery)

```javascript
// If app is stuck between scenes:
import { state } from './src/engine/state.js'
state.forceScene('vault')
// app jumps to vault scene, state syncs
```

**What this does:**
- Kills any running GSAP timelines
- Shows target scene (opacity 1, pointerEvents auto)
- Sets state.current to match
- Saves to localStorage

---

### Preload Image

```javascript
// src/scenes/vault.js — after Precious photo loads
const img = document.querySelector('.polaroid img')
img.src = '/birthday-vault/images/precious.jpg'

// Or in assets.js:
const precious = new Image()
precious.src = PATHS.IMAGE_PRECIOUS
await new Promise(res => { precious.onload = res })
ASSETS.images.precious = precious
```

---

## DEBUGGING CHECKLIST

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "Cannot read property X of undefined" | Element selector wrong | Check class name in HTML. Run `collectAllElements()` validation. |
| Morph doesn't trigger | `director.busy` still true | Check previous morph completed. Console: `director.busy` should be false. |
| Morph never completes | GSAP timeline doesn't resolve | Ensure morph returns `timeline` or `Promise`. Check for infinite loops. |
| Audio doesn't play | Howler not loaded or path wrong | Check PATHS in config.js. Test `ASSETS.audio.ambient.play()` in console. |
| Scene jumps instead of morphs | Opacity being set to 1 too early | Scenes must stay at opacity 0 until morph brings them in. No `display: block` ever. |
| Countdown doesn't tick | `startTick()` not called | Check `scenes/countdown.js` init. Check interval is set. |
| Passcode always wrong | Code format mismatch | Verify `atob('MTEwNw==')` === `'1107'`. Test in console. |
| Mobile buttons hard to tap | Touch target too small | Keypad buttons must be >=40px. Buttons need `pointer-events: auto`. |
| Canvas black screen | Canvas not mounted or sized | Check `canvas.width/height` set correctly. Check canvas context exists. |
| Song doesn't fade in | Volume too loud to start | Check AUDIO.SONG_VOLUME in config.js. Set to 0.25 initially. |
| State wrong after morph | State update missing | Scenes must call `director.morph()`, director updates state after. |
| Vite build fails | Missing asset path | Ensure `base: '/birthday-vault/'` in vite.config.js. Check file paths use `/birthday-vault/` prefix. |

---

## PERFORMANCE TIPS

### Reduce TweenMax Calls
```javascript
// BAD: Creates 3 tweens
gsap.to(el, { opacity: 0 })
gsap.to(el, { scale: 0 })
gsap.to(el, { y: -20 })

// GOOD: Single tween
gsap.to(el, {
  opacity: 0,
  scale: 0,
  y: -20,
  duration: 0.3,
})
```

### Use GSAP Timeline for Multi-Element Animation
```javascript
// BAD: Tweens might not sync
gsap.to('.card', { x: 100, stagger: 0.1 })
gsap.to('.text', { opacity: 0 })

// GOOD: Timeline guarantees sync
const tl = gsap.timeline()
tl.to('.card', { x: 100, stagger: 0.1 }, 0)
tl.to('.text', { opacity: 0 }, 0)  // starts at same time
```

### Cleanup Canvas on Exit
```javascript
// In constellation scene, on exit:
export function destroy() {
  if (animationId) cancelAnimationFrame(animationId)
  if (canvas) canvas.width = 0  // frees memory
}
```

### Preload Heavy Assets
```javascript
// In main.js, before bootstrap:
const precacheList = [
  '/birthday-vault/audio/song.mp3',
  '/birthday-vault/images/precious.jpg',
]

precacheList.forEach(path => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = path.endsWith('.mp3') ? 'audio' : 'image'
  link.href = path
  document.head.appendChild(link)
})
```

---

## MOBILE DEBUGGING

### Test at Exact Breakpoints
```bash
# iPhone 12 / 13
375px × 812px

# iPad Pro
1024px × 1366px

# Android Galaxy S21
360px × 800px
```

### iOS Specific Issues

**Viewport height wrong (address bar disappears):**
```javascript
// Already in main.js:
const updateVh = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
window.addEventListener('resize', updateVh)
```

**Audio won't autoplay:**
- First interaction (tap) must trigger audio
- `ambient.wav` starts only at envelope tap ✓ (Phase 3)
- `song.mp3` starts only at constellation trigger ✓ (Phase 6)

**Touch event lag:**
```css
button {
  touch-action: manipulation;
  -webkit-user-select: none;
}
```

### Android Specific Issues

**Back button exits:**
```javascript
// Optional: prevent back navigation
window.addEventListener('popstate', (e) => {
  e.preventDefault()
  return false
})
```

**Font rendering:**
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## GIT WORKFLOW

### Commit Per Feature
```bash
# Phase 1
git add src/engine/director/director.js
git commit -m "feat: director with GSAP context isolation"

git add src/engine/director/morphRegistry.js
git commit -m "feat: morph registry with Map (no string keys)"

git add src/style.css
git commit -m "feat: CSS variables and layout"
```

### Branch for Major Changes
```bash
git checkout -b phase-4-promises
# ... build phase
git push origin phase-4-promises
# PR review or self-review
git checkout main
git merge phase-4-promises
```

### Restore Previous Scene
```bash
git log --oneline | head -10
# Find commit hash
git checkout <hash> -- src/

# Or revert entire commit:
git revert <hash>
```

---

## LIGHTHOUSE CHECKLIST

Run in DevTools → Lighthouse after Phase 8:

| Metric | Target | Fix |
|--------|--------|-----|
| Performance | >90 | Reduce unused CSS, preload assets |
| Accessibility | >95 | Alt text on images, button labels |
| Best Practices | >90 | HTTPS deployed, no console errors |
| SEO | >90 | Meta tags in HTML, viewport set |

```html
<!-- Add to index.html <head> -->
<meta name="theme-color" content="#AC1C35">
<meta name="description" content="A private birthday experience.">
<meta property="og:title" content="Birthday Vault">
<meta property="og:description" content="For Precious.">
<meta property="og:image" content="https://highnine699-del.github.io/birthday-vault/images/precious.jpg">
```

---

## ENVIRONMENT VARIABLES (Optional)

If you need config per deployment (e.g., staging vs. production):

```bash
# .env.local (git-ignored)
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development

# Access in code:
const url = import.meta.env.VITE_API_URL
```

---

## EMERGENCY COMMANDS

### Full Cache Clear
```bash
# Clear npm cache
npm cache clean --force

# Reinstall deps
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Kill Hung Process
```bash
# Find Vite process
lsof -i :5173

# Kill by PID
kill -9 <PID>

# Restart
npm run dev
```

### Restore to Last Commit
```bash
git checkout -- .
git clean -fd
```

---

## QUICK CHECKLISTS

### Before Each Phase Handoff
- [ ] Run validation checklist for phase
- [ ] Console clean of errors/warnings
- [ ] All tests pass
- [ ] Mobile tested (iOS + Android)
- [ ] Reduced motion tested
- [ ] Commit with clear message

### Before Deployment
- [ ] `npm run build` succeeds
- [ ] `dist/` directory not empty
- [ ] Vite preview works (`npm run preview`)
- [ ] Git committed and pushed
- [ ] GitHub Pages settings correct
- [ ] Test URL loads
- [ ] All scenes accessible

### Before Nov 7 Delivery
- [ ] End-to-end test from countdown to afterglow
- [ ] Passcode works
- [ ] Audio plays
- [ ] Photos display
- [ ] Text readable
- [ ] Mobile responsive
- [ ] No console errors
- [ ] GitHub Pages URL active

---

## CONTACT & ESCALATION

If stuck for >30 min on a single issue:

1. **Check validation checklist** — ensure phase prerequisites met
2. **Console errors first** — always start with red errors, not warnings
3. **Test in isolation** — can you reproduce in simple example?
4. **Search codebase** — pattern might already exist elsewhere
5. **Git diff** — what changed since last working state?
6. **Restore from backup** — if corrupted, `git checkout <hash>`

---

**END OF QUICK REFERENCE**

Print this. Keep it open while building. Saves hours.
