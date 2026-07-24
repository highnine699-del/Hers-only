// src/engine/director/morphs/vault.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { COLORS } from '../../../config.js'
import gsap from 'gsap'

export function morphVaultToEnvelope(elements) {
  const tl = gsap.timeline()

  // Background: flash to full crimson
  const ripple = document.createElement('div')
  ripple.style.cssText = `
    position: fixed;
    inset: 0;
    background: ${COLORS.CRIMSON};
    opacity: 0;
    pointer-events: none;
    z-index: 100;
  `
  elements.stage.appendChild(ripple)

  tl.to(ripple, { opacity: 1, duration: 0.2 }, 0)
  tl.to(ripple, { opacity: 0, duration: 0.3 }, 0.2)

  // Vault scene: fade out
  tl.to(elements.vault.scene, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0)

  // Envelope scene: fade in
  tl.to(elements.envelope.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  // Clean up ripple
  tl.call(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple)
  })

  return tl
}

setMorphFn(MORPH_KEYS.VAULT_TO_ENVELOPE, morphVaultToEnvelope)
