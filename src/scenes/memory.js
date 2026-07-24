// src/scenes/memory.js
import { state } from '../engine/state.js'
import VanillaTilt from 'vanilla-tilt'

export const MEMORIES = [
  { id: 1, title: 'Memory 01', text: '[PLACEHOLDER — First real memory]',  locked: false },
  { id: 2, title: 'Memory 02', text: '[PLACEHOLDER — Second real memory]', locked: false },
  { id: 3, title: 'Memory 03', text: '[PLACEHOLDER — Third real memory]',  locked: false },
  { id: 4, title: 'Memory 04', text: '[PLACEHOLDER — Hidden memory]',      locked: true  },
]

let elements = null
let expandedCard = null

export function init(els) {
  elements = els.memory
  
  // Build memory UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="memory-cards" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 2rem 0;"></div>
    <button class="continue-btn" style="margin-top: 2rem; padding: 0.75rem 2rem; background: var(--crimson); border: none; border-radius: 999px; color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; cursor: pointer;">Continue</button>
  `
  
  // Collect element references
  elements.cardsGrid = scene.querySelector('.memory-cards')
  elements.continueBtn = scene.querySelector('.continue-btn')
  
  // Build memory cards
  MEMORIES.forEach((memory, index) => {
    const cardEl = document.createElement('button')
    cardEl.className = 'memory-card'
    cardEl.dataset.id = memory.id
    
    // Random rotation for scattered effect
    const rotation = (Math.random() - 0.5) * 16 // ±8deg
    
    cardEl.style.cssText = `
      position: relative;
      min-height: 120px;
      border: none;
      border-radius: 16px;
      background: var(--surface);
      border: 1px solid var(--surface-rim);
      color: var(--text);
      padding: 1.5rem;
      text-align: left;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      cursor: ${memory.locked ? 'not-allowed' : 'pointer'};
      opacity: ${memory.locked ? 0.4 : 1};
      transform: rotate(${rotation}deg);
      transition: transform 0.3s, box-shadow 0.3s;
    `
    
    // Card content
    const title = document.createElement('div')
    title.style.cssText = 'font-weight: 600; margin-bottom: 0.5rem;'
    title.textContent = memory.title
    
    const text = document.createElement('div')
    text.style.cssText = 'font-size: 0.9rem; line-height: 1.5; opacity: 0.8;'
    text.textContent = memory.locked ? '🔒 Locked' : memory.text
    
    // Lock icon for locked cards
    if (memory.locked) {
      const lockIcon = document.createElement('div')
      lockIcon.style.cssText = 'position: absolute; top: 1rem; right: 1rem; font-size: 1.2rem;'
      lockIcon.textContent = '🔒'
      cardEl.appendChild(lockIcon)
    }
    
    cardEl.appendChild(title)
    cardEl.appendChild(text)
    
    // Add VanillaTilt for unlocked cards
    if (!memory.locked) {
      VanillaTilt.init(cardEl, {
        max: 5,
        speed: 400,
        glare: false,
      })
    }
    
    // Add click handler for unlocked cards
    if (!memory.locked) {
      cardEl.addEventListener('click', () => handleCardClick(cardEl, memory))
    }
    
    elements.cardsGrid.appendChild(cardEl)
  })
  
  // Add continue button handler
  elements.continueBtn.addEventListener('click', () => {
    state.requestTransition('fate')
  })
}

function handleCardClick(cardEl, memory) {
  if (expandedCard === cardEl) {
    // Collapse
    cardEl.style.minHeight = '120px'
    const text = cardEl.querySelector('div:last-child')
    text.textContent = memory.text
    expandedCard = null
  } else {
    // Expand
    if (expandedCard) {
      // Collapse previous
      const prevMemory = MEMORIES.find(m => m.id === parseInt(expandedCard.dataset.id))
      if (prevMemory) {
        expandedCard.style.minHeight = '120px'
        const prevText = expandedCard.querySelector('div:last-child')
        prevText.textContent = prevMemory.text
      }
    }
    
    cardEl.style.minHeight = '200px'
    const text = cardEl.querySelector('div:last-child')
    text.textContent = memory.text + '\n\n(Tap again to collapse)'
    expandedCard = cardEl
  }
}
