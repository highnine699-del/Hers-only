// src/scenes/letter.js
import { state } from '../engine/state.js'
import { ANIMATION } from '../config.js'

export const LETTER_LINES = [
  { text: 'To Precious,',      style: 'salutation' },
  { text: '',                  style: 'blank' },
  { text: '[PLACEHOLDER — First paragraph. Replace with real letter.]', style: 'body' },
  { text: '',                  style: 'blank' },
  { text: '[PLACEHOLDER — Second paragraph.]', style: 'body' },
  { text: '',                  style: 'blank' },
  { text: '[PLACEHOLDER — Third paragraph.]', style: 'body' },
  { text: '',                  style: 'blank' },
  { text: '[PLACEHOLDER — Fourth paragraph.]', style: 'body' },
  { text: '',                  style: 'blank' },
  { text: '[PLACEHOLDER — Fifth paragraph.]', style: 'body' },
  { text: '',                  style: 'blank' },
  { text: 'With everything,',  style: 'closing' },
  { text: '',                  style: 'blank' },
  { text: '[Your name]',       style: 'signature' },
]

let elements = null

export function init(els) {
  elements = els.letter
  
  // Build letter UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="letter-paper" style="position: relative; max-width: 500px; padding: 2rem; background: linear-gradient(180deg, rgba(255, 248, 245, 0.95), rgba(255, 240, 235, 0.95)); border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
      <div class="letter-lines" style="display: grid; gap: 0.5rem;"></div>
      <button class="continue-btn" style="margin-top: 2rem; padding: 0.75rem 2rem; background: var(--crimson); border: none; border-radius: 999px; color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity 0.3s;">Continue →</button>
    </div>
  `
  
  // Collect element references
  elements.letterPaper = scene.querySelector('.letter-paper')
  elements.linesContainer = scene.querySelector('.letter-lines')
  elements.continueBtn = scene.querySelector('.continue-btn')
  
  // Build letter lines
  LETTER_LINES.forEach((line, index) => {
    const p = document.createElement('p')
    p.className = `letter-line-${index}`
    p.style.cssText = `
      margin: 0;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s, transform 0.5s;
    `
    
    if (line.style === 'salutation' || line.style === 'closing') {
      p.style.fontFamily = "'Great Vibes', cursive"
      p.style.fontSize = "1.8rem"
      p.style.color = "#7f1b2c"
    } else if (line.style === 'signature') {
      p.style.fontFamily = "'Great Vibes', cursive"
      p.style.fontSize = "1.5rem"
      p.style.color = "#7f1b2c"
      p.style.textAlign = "right"
    } else {
      p.style.fontFamily = "'DM Sans', sans-serif"
      p.style.fontSize = "1rem"
      p.style.lineHeight = "1.8"
      p.style.color = "#5b1424"
    }
    
    p.textContent = line.text
    elements.linesContainer.appendChild(p)
  })
  
  // Add continue button handler
  elements.continueBtn.addEventListener('click', () => {
    state.requestTransition('promises')
  })
  
  // Stagger reveal lines
  setTimeout(() => {
    revealLines()
  }, 500)
}

function revealLines() {
  const lines = elements.linesContainer.querySelectorAll('p')
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.style.opacity = '1'
      line.style.transform = 'translateY(0)'
      
      // Show continue button after last line
      if (index === lines.length - 1) {
        setTimeout(() => {
          elements.continueBtn.style.opacity = '1'
          elements.continueBtn.style.pointerEvents = 'auto'
        }, 500)
      }
    }, index * ANIMATION.LETTER_LINE_STAGGER * 1000)
  })
}
