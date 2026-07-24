// src/scenes/vault.js
import { createKeypad } from '../components/keypad.js'
import { CONTENT, TIMING } from '../config.js'
import { state } from '../engine/state.js'
import { assets } from '../assets.js'

const PASSCODE = atob(CONTENT.PASSCODE_HASH) // '1107'
let elements = null
let currentCode = ''
let wrongAttempts = 0

export function init(els) {
  elements = els.vault
  
  // Build vault UI
  const scene = elements.scene
  scene.innerHTML = `
    <h2 style="font-family: 'DM Sans', sans-serif; font-size: 1rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.2em; text-align: center; margin: 0 0 1rem 0;">ENTER YOUR KEY</h2>
    <div class="code-display" style="display: flex; justify-content: center; gap: 0.75rem; margin: 1rem 0;">
      <span class="code-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--crimson);"></span>
      <span class="code-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--crimson);"></span>
      <span class="code-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--crimson);"></span>
      <span class="code-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--crimson);"></span>
    </div>
    <div class="error-message" style="color: var(--crimson); text-align: center; min-height: 1.5rem; opacity: 0; transition: opacity 0.3s;"></div>
  `
  
  // Add keypad
  const keypad = createKeypad()
  scene.appendChild(keypad)
  
  // Collect element references
  elements.codeDots = Array.from(scene.querySelectorAll('.code-dot'))
  elements.errorMessage = scene.querySelector('.error-message')
  elements.keypad = keypad
  
  // Add event listeners
  keypad.addEventListener('click', handleKeypadClick)
  
  // Keyboard support
  scene.addEventListener('keydown', handleKeyDown)
}

function handleKeypadClick(e) {
  const btn = e.target.closest('button')
  if (!btn) return
  
  const digit = btn.dataset.digit
  const action = btn.dataset.action
  
  if (action === 'backspace') {
    currentCode = currentCode.slice(0, -1)
  } else if (digit) {
    if (currentCode.length < 4) {
      currentCode += digit
    }
  } else if (action === 'enter') {
    checkCode()
    return
  }
  
  updateDisplay()
  
  if (currentCode.length === 4) {
    checkCode()
  }
}

function handleKeyDown(e) {
  const key = e.key
  
  if (/^[0-9]$/.test(key)) {
    if (currentCode.length < 4) {
      currentCode += key
      updateDisplay()
      if (currentCode.length === 4) checkCode()
    }
  } else if (key === 'Backspace') {
    currentCode = currentCode.slice(0, -1)
    updateDisplay()
  } else if (key === 'Enter') {
    checkCode()
  }
}

function updateDisplay() {
  elements.codeDots.forEach((dot, i) => {
    if (i < currentCode.length) {
      dot.style.background = 'var(--text)'
      dot.textContent = currentCode[i]
    } else {
      dot.style.background = 'var(--crimson)'
      dot.textContent = ''
    }
  })
}

function checkCode() {
  if (currentCode === PASSCODE) {
    // Correct code
    state.requestTransition('envelope')
  } else {
    // Wrong code
    wrongAttempts++
    currentCode = ''
    updateDisplay()
    
    // Play pulse sound
    assets.pulse?.play()
    
    // Shake animation
    elements.keypad.style.animation = 'shake 0.25s ease-in-out'
    setTimeout(() => {
      elements.keypad.style.animation = ''
    }, TIMING.VAULT_SHAKE_MS)
    
    // Show error after 3 wrong attempts
    if (wrongAttempts >= TIMING.WRONG_CODE_ERROR_AFTER) {
      elements.errorMessage.textContent = 'Try again'
      elements.errorMessage.style.opacity = '1'
      setTimeout(() => {
        elements.errorMessage.style.opacity = '0'
      }, 2000)
    }
  }
}
