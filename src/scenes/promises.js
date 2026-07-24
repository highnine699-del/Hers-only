// src/scenes/promises.js
import { state } from '../engine/state.js'
import { ANIMATION } from '../config.js'

export const CARDS = [
  { front: '♡',  back: 'Free Meal — I\'ll plan something delicious. You pick the place.' },
  { front: '♡',  back: 'Free Hug — Redeem any time. No questions asked.' },
  { front: '♡',  back: '[PLACEHOLDER — Add real secret or confession here]' },
  { front: '♡',  back: 'Emergency Comfort Call — Any hour. I\'ll always pick up.' },
]

let elements = null
let selectedCard = null

export function init(els) {
  elements = els.promises
  
  // Build promises UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="cards-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 2rem 0;"></div>
    <button class="continue-btn" style="margin-top: 2rem; padding: 0.75rem 2rem; background: var(--crimson); border: none; border-radius: 999px; color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; cursor: pointer; opacity: 0.4; pointer-events: none; transition: opacity 0.3s;">Continue</button>
  `
  
  // Collect element references
  elements.cardsGrid = scene.querySelector('.cards-grid')
  elements.continueBtn = scene.querySelector('.continue-btn')
  
  // Build heart cards
  CARDS.forEach((card, index) => {
    const cardEl = document.createElement('button')
    cardEl.className = 'heart-card'
    cardEl.style.cssText = `
      position: relative;
      width: 100%;
      min-height: 140px;
      border: none;
      border-radius: 20px;
      background: var(--surface);
      border: 1px solid var(--surface-rim);
      color: var(--text);
      font-size: 1rem;
      cursor: pointer;
      perspective: 1000px;
      transition: opacity 0.3s, transform 0.3s;
      padding: 0;
    `
    
    // Card inner for 3D flip
    const cardInner = document.createElement('div')
    cardInner.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 140px;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    `
    
    // Front of card
    const cardFront = document.createElement('div')
    cardFront.style.cssText = `
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      backface-visibility: hidden;
      font-size: 3rem;
      color: var(--crimson);
    `
    cardFront.textContent = card.front
    
    // Back of card
    const cardBack = document.createElement('div')
    cardBack.style.cssText = `
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 1rem;
      backface-visibility: hidden;
      transform: rotateY(180deg);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      line-height: 1.5;
      text-align: center;
      color: var(--text);
    `
    cardBack.textContent = card.back
    
    cardInner.appendChild(cardFront)
    cardInner.appendChild(cardBack)
    cardEl.appendChild(cardInner)
    
    // Add click handler
    cardEl.addEventListener('click', () => handleCardClick(cardEl, cardInner))
    
    elements.cardsGrid.appendChild(cardEl)
  })
  
  // Add continue button handler
  elements.continueBtn.addEventListener('click', () => {
    state.requestTransition('memory')
  })
}

function handleCardClick(cardEl, cardInner) {
  if (selectedCard === cardEl) return // Already flipped
  
  // Flip the clicked card
  cardInner.style.transform = 'rotateY(180deg)'
  selectedCard = cardEl
  
  // Dim other cards
  const allCards = elements.cardsGrid.querySelectorAll('.heart-card')
  allCards.forEach(c => {
    if (c !== cardEl) {
      c.style.opacity = '0.4'
    }
  })
  
  // Enable continue button
  elements.continueBtn.style.opacity = '1'
  elements.continueBtn.style.pointerEvents = 'auto'
}
