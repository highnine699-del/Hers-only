// src/scenes/afterglow.js
import { CONTENT } from '../config.js'

export function init(els) {
  const elements = els.afterglow
  
  // Build afterglow UI
  const scene = elements.scene
  scene.innerHTML = `
    <div class="afterglow-content" style="text-align: center; max-width: 500px; padding: 2rem;">
      <h2 style="font-family: 'Great Vibes', cursive; font-size: 2.5rem; color: var(--text); margin: 0 0 1.5rem 0;">Happy Birthday, ${CONTENT.RECIPIENT_NAME}</h2>
      <p style="font-family: 'DM Sans', sans-serif; font-size: 1rem; color: var(--muted); line-height: 1.8; margin: 0 0 2rem 0;">
        The vault closes gently, leaving behind a warm glow and a promise that love remains, even in the quietest moments. May your year ahead be filled with light, laughter, and the kind of joy that settles deep in your heart.
      </p>
      <p style="font-family: 'Great Vibes', cursive; font-size: 1.5rem; color: var(--gold); margin: 0;">With all my love</p>
    </div>
  `
}
