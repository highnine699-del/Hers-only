// src/components/keypad.js

const RADIUS = 108
const BTN_SIZE = 48
const CENTER = 140 // half of container width/height

function placeOnRing(angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180) // -90 so 0° = 12 o'clock
  const x = CENTER + RADIUS * Math.cos(rad) - BTN_SIZE / 2
  const y = CENTER + RADIUS * Math.sin(rad) - BTN_SIZE / 2
  return `left:${x.toFixed(1)}px; top:${y.toFixed(1)}px;`
}

function makeBtn({ text, dataset, style = '' }) {
  const btn = document.createElement('button')
  btn.style.cssText = `
    position: absolute;
    width: ${BTN_SIZE}px;
    height: ${BTN_SIZE}px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--surface-rim);
    color: var(--text);
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background 0.15s;
    ${style}
  `
  btn.textContent = text
  Object.entries(dataset || {}).forEach(([k, v]) => (btn.dataset[k] = v))
  return btn
}

export function createKeypad() {
  const container = document.createElement('div')
  container.className = 'keypad-ring'
  container.style.cssText = `
    position: relative;
    width: ${CENTER * 2}px;
    height: ${CENTER * 2}px;
    margin: 1rem auto;
  `

  // Digits 1–9 evenly around the ring (1 at 12 o'clock, clockwise)
  // 9 digits × 40° spacing = 360°, starting at -160° so 1 sits at top-left like a dial
  // Standard phone/PIN layout: 1 2 3 across top, 4 5 6 middle, 7 8 9 bottom
  const digitAngles = [
    { digit: '1', angle: -150 }, // ~10 o'clock
    { digit: '2', angle: -90 }, // 12 o'clock
    { digit: '3', angle: -30 }, // ~2 o'clock
    { digit: '4', angle: -90 + 60 * 0 }, // recalc below
    { digit: '5', angle: 0 },
    { digit: '6', angle: 90 - 60 },
    { digit: '7', angle: 150 },
    { digit: '8', angle: 90 },
    { digit: '9', angle: 30 },
  ]

  // Simpler: evenly space 1–9 starting at -150° (top-left), step 40°
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  digits.forEach((digit, i) => {
    const angle = -150 + i * (300 / 8) // spread 1–9 over 300° (leave gap at bottom for 0/controls)
    const btn = makeBtn({ text: digit, dataset: { digit } })
    btn.className = 'keypad-btn'
    btn.style.cssText += placeOnRing(angle)
    container.appendChild(btn)
  })

  // 0 at bottom center (6 o'clock)
  const zeroBtn = makeBtn({ text: '0', dataset: { digit: '0' } })
  zeroBtn.className = 'keypad-btn'
  zeroBtn.style.cssText += placeOnRing(90) // 6 o'clock
  container.appendChild(zeroBtn)

  // Backspace at ~7 o'clock
  const backspaceBtn = makeBtn({
    text: '⌫',
    dataset: { action: 'backspace' },
    style: 'font-size: 1rem;',
  })
  backspaceBtn.className = 'keypad-action'
  backspaceBtn.setAttribute('aria-label', 'Backspace')
  backspaceBtn.style.cssText += placeOnRing(130)
  container.appendChild(backspaceBtn)

  // OK at ~5 o'clock
  const enterBtn = makeBtn({
    text: 'OK',
    dataset: { action: 'enter' },
    style: 'background: var(--crimson); border: none; font-size: 0.9rem; font-weight: 600;',
  })
  enterBtn.className = 'keypad-action'
  enterBtn.setAttribute('aria-label', 'Enter')
  enterBtn.style.cssText += placeOnRing(50)
  container.appendChild(enterBtn)

  return container
}
