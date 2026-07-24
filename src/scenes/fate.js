// src/scenes/fate.js
import { createWheel } from '../components/wheel.js'
import { state } from '../engine/state.js'
import { ANIMATION } from '../config.js'

const FORTUNES = [
  'A year of unexpected joy',
  'Your courage will open new doors',
  'Kindness returns to you multiplied',
  'A beautiful surprise awaits',
  'Your dreams are closer than you think',
  'Love surrounds you always',
]

let elements = null

export function init(els) {
  elements = els.fate
  
  // Build fate UI
  const scene = elements.scene
  scene.innerHTML = `
    <h2 style="font-family: 'DM Sans', sans-serif; font-size: 1rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.2em; text-align: center; margin: 0 0 1rem 0;">SPIN FOR YOUR FORTUNE</h2>
    <div class="fortune-display" style="min-height: 3rem; text-align: center; font-family: 'Great Vibes', cursive; font-size: 1.5rem; color: var(--text); margin: 1rem 0; opacity: 0; transition: opacity 0.5s;"></div>
    <button class="continue-btn" style="margin-top: 2rem; padding: 0.75rem 2rem; background: var(--crimson); border: none; border-radius: 999px; color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; cursor: pointer; opacity: 0.4; pointer-events: none; transition: opacity 0.3s;">Continue</button>
  `
  
  // Collect element references
  elements.fortuneDisplay = scene.querySelector('.fortune-display')
  elements.continueBtn = scene.querySelector('.continue-btn')
  
  // Add wheel
  const wheel = createWheel(handleSpinComplete)
  scene.appendChild(wheel)
  
  // Add continue button handler
  elements.continueBtn.addEventListener('click', () => {
    state.requestTransition('constellation')
  })
}

function handleSpinComplete(segmentIndex) {
  // Display fortune
  const fortune = FORTUNES[segmentIndex]
  elements.fortuneDisplay.textContent = fortune
  elements.fortuneDisplay.style.opacity = '1'
  
  // Enable continue button
  elements.continueBtn.style.opacity = '1'
  elements.continueBtn.style.pointerEvents = 'auto'
}
