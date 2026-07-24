# BIRTHDAY VAULT — PHASE VALIDATION CHECKLIST

Use this before declaring a phase complete. Do not skip steps.

---

## PHASE 1 VALIDATION — Shell & Director

**Prerequisites:**
- [ ] `git clone` or `git init` in project directory
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts Vite on `http://localhost:5173`

**Verification Steps:**

1. **Console startup sequence**
   ```
   Open browser console (F12 → Console tab)
   You should see:
   ✓ All elements validated
   ✓ Assets loaded
   ✓ Birthday Vault ready
   ```
   - [ ] All three messages appear in this order
   - [ ] No red error messages
   - [ ] No yellow warnings about missing files

2. **State verification**
   ```javascript
   // Paste into console and press Enter:
   console.log('Current scene:', state.getCurrent())
   console.log('Director busy:', director.busy)
   console.log('Valid transition?', state.isValidTransition('countdown', 'vault'))
   ```
   Expected output:
   ```
   Current scene: countdown
   Director busy: false
   Valid transition? true
   ```
   - [ ] All three values correct

3. **Morph registry check**
   ```javascript
   // In console:
   const { MORPH_KEYS } = await import('./src/engine/director/morphRegistry.js')
   console.log(Object.keys(MORPH_KEYS))
   ```
   Should list 8 keys: `COUNTDOWN_TO_VAULT`, `VAULT_TO_ENVELOPE`, etc.
   - [ ] All 8 keys present
   - [ ] No typos in key names

4. **Element collection**
   ```javascript
   // In console:
   console.log('Stage element:', elements.stage)
   console.log('Countdown scene:', elements.countdown.scene)
   console.log('Vault scene:', elements.vault.scene)
   ```
   All three should be DOM nodes (not null/undefined).
   - [ ] Stage element is valid
   - [ ] All 8 scene elements exist in DOM
   - [ ] All scene elements have `opacity: 0` except countdown

5. **Config values**
   ```javascript
   // In console:
   import { TIMING, ANIMATION, COLORS } from './src/config.js'
   console.log(TIMING.MORPH_TIMEOUT_MS)
   console.log(ANIMATION.ENVELOPE_SCALE_BACK)
   console.log(COLORS.CRIMSON)
   ```
   - [ ] `TIMING.MORPH_TIMEOUT_MS` === 10000
   - [ ] `ANIMATION.ENVELOPE_SCALE_BACK` === 0.6
   - [ ] `COLORS.CRIMSON` === '#AC1C35'

6. **Asset loading**
   ```javascript
   // In console:
   import { ASSETS } from './src/assets.js'
   console.log(ASSETS.audio.ambient)
   console.log(ASSETS.audio.song)
   ```
   Both should be Howler instances (have `.play()` method).
   - [ ] ambient and song are Howler objects
   - [ ] Can call `.play()` without error

7. **File structure**
   ```bash
   # In terminal:
   ls -la src/
   ls -la src/engine/director/
   ls -la src/config.js
   ls -la src/assets.js
   ```
   - [ ] All listed files exist
   - [ ] No typos in filenames

---

### PHASE 1 EXIT CRITERIA

Phase 1 is **COMPLETE** when:
- [x] All 7 verification steps pass
- [x] No console errors on app boot
- [x] Director can be called (even if morph is no-op)
- [x] State reads/writes without error
- [x] Config and assets load on first import
- [x] localStorage works (can write and read)
- [x] Git history shows clean commits per file type

**Do not proceed to Phase 2 until all above checked.**

---

## PHASE 2 VALIDATION — Countdown & Vault

**Prerequisite:** Phase 1 complete and passing.

**Verification Steps:**

1. **Countdown display**
   ```
   Visual check:
   - Countdown numbers visible in center of screen
   - Format: XX XX XX XX (days, hours, minutes, seconds)
   - Numbers update every 1 second
   - Text color is light (--text: #FFF0F3)
   ```
   - [ ] Numbers displaying correctly
   - [ ] Numbers ticking down
   - [ ] No NaN values
   - [ ] Format is DD HH MM SS (two digits each)

2. **Countdown logic**
   ```javascript
   // In console:
   import { getNetworkTime, calculateCountdown } from './src/engine/time.js'
   const now = await getNetworkTime()
   const cd = calculateCountdown(now)
   console.log(cd)
   ```
   Should show: `{ days: N, hours: N, minutes: N, seconds: N, isZero: false }`
   - [ ] All values are numbers >= 0
   - [ ] `isZero` is boolean

3. **Passcode validation**
   ```javascript
   // In console:
   const correct = atob('MTEwNw==')
   console.log('Passcode is:', correct)
   ```
   Should print: `Passcode is: 1107`
   - [ ] Decoded value is exactly "1107"

4. **Keypad rendering**
   ```
   Visual check after countdown scene visible:
   - Circular keypad with 10 digits (0-9)
   - Digits arranged in ring pattern
   - Border is crimson color
   - Buttons have hover effect (scale + color change)
   ```
   - [ ] All 10 digits visible
   - [ ] Arranged in circle (not grid)
   - [ ] Hover effect works on each digit
   - [ ] Keypad is centered on screen

5. **Code input**
   ```
   User interaction test:
   - Click digit buttons in order: 1, 1, 0, 7
   - Watch code display update: • • • • → •• • • → •• •• → •• •• •
   - All four digits entered, nothing more
   ```
   - [ ] Code display shows correct number of bullets
   - [ ] Cannot enter 5th digit (maxes at 4)
   - [ ] Code resets after checking (if wrong)

6. **Wrong code behavior**
   ```
   User interaction test:
   - Click: 1, 2, 3, 4
   - Observe: keypad shakes, pulse sound plays, code resets
   ```
   - [ ] Keypad shakes left-right
   - [ ] Pulse sound plays (audible or muted browser doesn't block it)
   - [ ] Code display returns to •••• after shake
   - [ ] Can enter new code immediately after

7. **Correct code behavior**
   ```
   User interaction test:
   - Click: 1, 1, 0, 7
   - Observe: vault scene fades, envelope scene appears, morph completes
   ```
   - [ ] No shake animation
   - [ ] No sound
   - [ ] Transition is smooth (no blank frames)
   - [ ] Envelope visible after transition

8. **Morph timing**
   ```javascript
   // In console, test morph directly:
   await director.morph('countdown', 'vault')
   console.log('Morph completed')
   ```
   Should complete in ~0.8s without errors.
   - [ ] No timeout errors
   - [ ] Timeline completes smoothly
   - [ ] `director.busy` returns to false
   - [ ] Can call morph again

9. **State consistency**
   ```javascript
   // After vault scene is visible:
   console.log('Current scene:', state.getCurrent())
   ```
   Should still show: `countdown` (state updates AFTER morph, during next scene interaction)
   - [ ] State reflects actual visible scene OR next scene after morph

10. **Audio setup**
    ```javascript
    // In console:
    import { ASSETS } from './src/assets.js'
    console.log('Ambient loaded:', !!ASSETS.audio.ambient)
    console.log('Pulse loaded:', !!ASSETS.audio.pulse)
    console.log('Ambient volume:', ASSETS.audio.ambient.volume())
    ```
    - [ ] Both audio objects exist
    - [ ] Volumes are set (not NaN)

---

### PHASE 2 EXIT CRITERIA

Phase 2 is **COMPLETE** when:
- [x] Countdown displays and ticks
- [x] Keypad renders and accepts input
- [x] Wrong code shakes and plays sound
- [x] Correct code (`1107`) unlocks vault
- [x] Morph to envelope is smooth
- [x] All console checks pass
- [x] No errors during any test
- [x] Mobile: fingers can tap keypad digits easily

**Do not proceed to Phase 3 until all above checked.**

---

## PHASE 3 VALIDATION — Envelope & Letter

**Prerequisite:** Phase 2 complete and passing.

**Verification Steps:**

1. **Envelope display**
   ```
   Visual check (after entering correct code):
   - Envelope visible in center
   - Has rectangular shape with border
   - Contains polaroid photo of Precious
   - Soft glow/shadow effect
   ```
   - [ ] Envelope renders
   - [ ] Photo is visible inside
   - [ ] Style matches design (crimson border, semi-transparent bg)

2. **Envelope opening animation**
   ```
   User interaction test:
   - Observation: Flap rotates upward, seal glows then disappears
   - Letter paper rises from inside
   - Envelope dims and recedes
   ```
   - [ ] Flap rotates smoothly on X-axis (~160 degrees)
   - [ ] Seal shrinks and fades
   - [ ] Paper rises with proper easing
   - [ ] Envelope fades to background

3. **Letter paper**
   ```
   Visual check (after envelope opens):
   - Centered white paper with border
   - Creamy/off-white color
   - Slight shadow
   - No text visible yet
   ```
   - [ ] Paper dimensions correct (~340x440px)
   - [ ] Color is off-white/cream
   - [ ] Shadow effect visible
   - [ ] No text visible before animation

4. **Letter text reveal**
   ```
   Visual check:
   - Text appears line-by-line
   - Lines fade in from top to bottom
   - All 15 lines of letter appear (including blanks)
   - Text color is dark (not white)
   ```
   - [ ] First line ("To Precious,") appears
   - [ ] Each line follows with ~0.15s delay
   - [ ] Final line ("— Your Popsi") appears last
   - [ ] All lines fully opaque when done

5. **Continue button**
   ```
   Visual check:
   - After all text, "Continue" button fades in below paper
   - Crimson background, white text
   - Positioned near bottom-right of paper
   ```
   - [ ] Button appears after last line
   - [ ] Text readable
   - [ ] Can click without selecting text on paper

6. **Ambient audio**
   ```
   Audio check:
   - After envelope opens, soft ambient music begins
   - Volume is moderate (not loud, background level)
   - Loops continuously
   - Doesn't restart if heard before
   ```
   - [ ] Ambient audio plays (if system has audio + not muted)
   - [ ] Volume reasonable (~40%)
   - [ ] Plays from when envelope opens
   - [ ] No audio errors in console

7. **Morph to letter**
   ```javascript
   // In console:
   await director.morph('envelope', 'letter')
   console.log('Letter scene visible')
   ```
   - [ ] Completes without timeout
   - [ ] Envelope fades, letter appears
   - [ ] `director.busy` returns to false

8. **Letter paper stays in memory scenes**
   ```
   Visual check (advance to next scenes):
   - Letter paper remains visible behind promise cards
   - Paper is dimmed but readable
   - Promise cards lift OFF the paper surface
   ```
   - [ ] Paper doesn't vanish when leaving letter scene
   - [ ] Appears as backing layer for next scene
   - [ ] Dimmed (opacity ~0.5) so cards stand out

9. **File structure**
   ```bash
   ls -la src/scenes/letter.js
   ls -la src/engine/director/morphs/envelope.js
   ls -la src/engine/director/morphs/letter.js
   ```
   - [ ] All three files exist
   - [ ] No import errors when loading

10. **Exported functions**
    ```javascript
    // In console:
    import { LETTER_LINES } from './src/scenes/letter.js'
    console.log('Letter lines:', LETTER_LINES.length)
    console.log('First line:', LETTER_LINES[0])
    ```
    - [ ] LETTER_LINES array exists
    - [ ] Contains 15 lines (with blanks)
    - [ ] First line is "To Precious,"

---

### PHASE 3 EXIT CRITERIA

Phase 3 is **COMPLETE** when:
- [x] Envelope opens smoothly
- [x] Letter paper rises and settles
- [x] All 15 text lines appear in sequence
- [x] Ambient audio plays without errors
- [x] Continue button appears
- [x] Morph to envelope works
- [x] Morph to letter works
- [x] No console errors during any animation
- [x] Mobile: letter text readable, button tappable

**Do not proceed to Phase 4 until all above checked.**

---

## PHASES 4-7 VALIDATION (ABBREVIATED)

Each phase follows same structure:

**Phase 4 (Promises & Memory):**
- Heart cards render and flip
- Memory cards scatter with VanillaTilt
- Hidden card unlocked after all 4 visible cards seen
- Morph: letter → promises → memory

**Phase 5 (Fate Engine):**
- Memory cards converge to center
- Wheel appears from convergence
- Spin button triggers acceleration
- Result displays
- Morph: memory → fate

**Phase 6 (Constellation):**
- Wheel explodes to stars
- Star field renders on canvas
- ~24 gold stars form heart shape
- Lines draw connecting them
- Song fades in at constellation

**Phase 7 (Afterglow):**
- Stars dim
- Closing message appears
- "Happy Birthday, Precious" displays
- Open Again | Close buttons
- Song continues

For each phase, verify:
- [ ] Visual elements render correctly
- [ ] All animations complete without timeout
- [ ] Morphs overlap smoothly (no blank frames)
- [ ] State.current reflects visible scene
- [ ] Console clean of errors
- [ ] Mobile responsive and touchable
- [ ] Audio doesn't restart unexpectedly

---

## PHASE 8 VALIDATION — Polish

**Checks:**
- [ ] `@media (prefers-reduced-motion)` overrides all animations to instant/none
- [ ] Mobile viewport at 375px, 812px, 1024px — all readable
- [ ] iOS Safari: viewport height correct (`--vh` custom property)
- [ ] Reduced motion set: animations still complete (no loops)
- [ ] All audio volumes at expected levels (not ear-splitting)
- [ ] Lighthouse accessibility score >= 90
- [ ] No 404s in network tab
- [ ] All assets preload before first use

---

## PHASE 9 VALIDATION — Content Fill

**Before replacing placeholder data:**
- [ ] Letter text prepared and finalized
- [ ] 4 memories selected + descriptions written
- [ ] Precious photo selected (high quality, 350x350px min)
- [ ] Promise card text finalized
- [ ] Fate outcomes written (4 total)
- [ ] Closing message finalized

**After replacements:**
- [ ] Run full end-to-end test from countdown to afterglow
- [ ] Verify all content displays correctly
- [ ] Audio plays, timing looks good
- [ ] State saves/restores properly

---

## DEPLOYMENT VALIDATION

**Before GitHub Pages push:**

```bash
npm run build
# Verify dist/ directory exists and is non-empty

# Check dist/ structure:
ls dist/
# Should show: index.html, _app/, audio/, images/

# Test locally:
npx vite preview
# Visit http://localhost:4173
# Run through all phases again
```

- [ ] Build completes without errors
- [ ] dist/ folder has all assets
- [ ] Vite preview works
- [ ] All scenes accessible in preview
- [ ] Audio plays in preview

**GitHub Pages steps:**
1. Push to `main` branch
2. Settings → Pages → Deploy from `/dist` on main
3. Wait 30 seconds
4. Visit `https://highnine699-del.github.io/birthday-vault/`
5. Test full flow again

**Post-deployment:**
- [ ] URL loads without 404
- [ ] All scenes render
- [ ] Audio plays (check browser tab for audio icon)
- [ ] Countdown ticks (if before Nov 7, 2026)
- [ ] Passcode works
- [ ] No CORS errors in console
- [ ] Mobile loads and is responsive

---

## FINAL SIGN-OFF

When ALL phases pass validation:

```
✓ Phase 1: Shell & Director
✓ Phase 2: Countdown & Vault
✓ Phase 3: Envelope & Letter
✓ Phase 4: Promises & Memory
✓ Phase 5: Fate Engine
✓ Phase 6: Constellation
✓ Phase 7: Afterglow & Closing
✓ Phase 8: Polish
✓ Phase 9: Content Fill
✓ Deployment: GitHub Pages

Birthday Vault is PRODUCTION-READY.
```

Date Completed: ____________
Tested on devices: ____________

---

**END OF VALIDATION CHECKLIST**
