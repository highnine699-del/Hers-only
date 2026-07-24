// src/scenes/envelope.js
import { state } from '../engine/state.js'
import { assets } from '../assets.js'
import { ANIMATION } from '../config.js'

let elements = null
let isOpened = false

export function init(els) {
  elements = els.envelope
  
  // Build envelope UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="envelope-container" style="position: relative; width: 280px; height: 180px; cursor: pointer;">
      <div class="envelope-back" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 238, 244, 0.95), rgba(255, 221, 232, 0.95)); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.3);"></div>
      <div class="envelope-flap" style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(180deg, rgba(255, 197, 215, 0.95), rgba(255, 225, 235, 0.95)); clip-path: polygon(0 0, 100% 0, 50% 100%); transform-origin: top center; border-radius: 12px 12px 0 0;"></div>
      <div class="wax-seal" style="position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); width: 50px; height: 50px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #ffe2e7, #f589a3 62%); border: 1px solid rgba(255, 255, 255, 0.35); display: grid; place-items: center; font-size: 1.5rem;">♡</div>
      <div class="letter-paper" style="position: absolute; inset: 0; padding: 20px; opacity: 0; transform: translateY(20px); display: grid; place-items: center; color: #5b1424; font-size: 0.9rem; pointer-events: none;">
        <p style="margin: 0; text-align: center;">Tap to read</p>
      </div>
    </div>
  `
  
  // Collect element references
  elements.envelope = scene.querySelector('.envelope-container')
  elements.flap = scene.querySelector('.envelope-flap')
  elements.seal = scene.querySelector('.wax-seal')
  elements.paper = scene.querySelector('.letter-paper')
  
  // Add tap handler
  elements.envelope.addEventListener('click', handleTap)
}

function handleTap() {
  if (isOpened) return
  isOpened = true
  
  // Start ambient audio on first user interaction (LAW 9)
  assets.ambient?.play()
  
  // Animate flap opening
  elements.flap.style.transition = 'transform 0.6s ease'
  elements.flap.style.transform = 'rotateX(-160deg)'
  
  // Dissolve wax seal
  elements.seal.style.transition = 'opacity 0.3s, transform 0.3s'
  elements.seal.style.opacity = '0'
  elements.seal.style.transform = 'translate(-50%, -50%) scale(0)'
  
  // Rise letter paper
  setTimeout(() => {
    elements.paper.style.transition = 'opacity 0.5s, transform 0.5s'
    elements.paper.style.opacity = '1'
    elements.paper.style.transform = 'translateY(0)'
  }, 300)
  
  // Recede envelope body
  setTimeout(() => {
    elements.envelope.style.transition = 'transform 0.5s, opacity 0.5s'
    elements.envelope.style.transform = 'scale(0.65)'
    elements.envelope.style.opacity = '0.25'
  }, 600)
  
  // Transition to letter scene after animation
  setTimeout(() => {
    state.requestTransition('letter')
  }, 1200)
}
