// src/scenes/constellation.js
import { state } from '../engine/state.js'
import { assets } from '../assets.js'
import { VISUALS, TIMING, ANIMATION, AUDIO } from '../config.js'

let elements = null
let animationId = null
let stars = []

export function init(els) {
  elements = els.constellation
  
  // Build constellation UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="constellation-content" style="text-align: center; z-index: 1;">
      <h2 style="font-family: 'Great Vibes', cursive; font-size: 2rem; color: var(--text); margin: 0 0 1rem 0;">Your Constellation</h2>
      <p style="font-family: 'DM Sans', sans-serif; font-size: 1rem; color: var(--muted); line-height: 1.6; margin: 0 0 2rem 0;">The stars hold your name tonight — a little constellation of affection, courage, and promise.</p>
      <button class="continue-btn" style="padding: 0.75rem 2rem; background: var(--crimson); border: none; border-radius: 999px; color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; cursor: pointer;">Continue</button>
    </div>
  `
  
  // Collect element references
  elements.content = scene.querySelector('.constellation-content')
  elements.continueBtn = scene.querySelector('.continue-btn')
  
  // Add continue button handler
  elements.continueBtn.addEventListener('click', () => {
    state.requestTransition('afterglow')
  })
  
  // Start canvas animation
  initCanvas()
}

function initCanvas() {
  const canvas = elements.canvas
  const ctx = canvas.getContext('2d')
  
  // Set canvas size
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)
  
  // Generate stars
  for (let i = 0; i < VISUALS.STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.02 + 0.01,
    })
  }
  
  // Select constellation stars (24 stars forming a pattern)
  const constellationStars = []
  for (let i = 0; i < VISUALS.CONSTELLATION_STARS; i++) {
    constellationStars.push({
      x: canvas.width * 0.3 + (Math.random() * canvas.width * 0.4),
      y: canvas.height * 0.3 + (Math.random() * canvas.height * 0.4),
      size: 3,
      opacity: 1,
    })
  }
  
  // Start song audio on constellation scene entry (LAW 9)
  assets.song?.play()
  assets.song?.fade(0, AUDIO.SONG_VOLUME, ANIMATION.SONG_FADE_IN)
  
  // Animation loop
  let time = 0
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background stars (twinkling)
    stars.forEach(star => {
      star.opacity += Math.sin(time * star.speed) * 0.01
      star.opacity = Math.max(0.3, Math.min(1, star.opacity))
      
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.fill()
    })
    
    // Draw constellation lines (progressive drawing)
    if (time > TIMING.CONSTELLATION_DRAW_DELAY * 60) {
      const progress = Math.min(1, (time - TIMING.CONSTELLATION_DRAW_DELAY * 60) / 180)
      
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.6)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < constellationStars.length - 1; i++) {
        if (i / constellationStars.length < progress) {
          ctx.beginPath()
          ctx.moveTo(constellationStars[i].x, constellationStars[i].y)
          ctx.lineTo(constellationStars[i + 1].x, constellationStars[i + 1].y)
          ctx.stroke()
        }
      }
      
      // Draw constellation stars
      constellationStars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(201, 168, 76, 1)'
        ctx.fill()
        
        // Glow effect
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(201, 168, 76, 0.3)'
        ctx.fill()
      })
    }
    
    time++
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

export function destroy() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  stars = []
}
