// src/engine/director/morphs/countdown.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import gsap from 'gsap'

export function morphCountdownToVault(elements) {
  const tl = gsap.timeline()

  // Countdown numbers: scale(1)→scale(0.3), opacity→0, converge to center
  const countValues = elements.countdown.scene.querySelectorAll('.count-value')
  if (countValues.length) {
    tl.to(countValues, {
      scale: 0.3,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.inOut'
    }, 0)
  }

  // Countdown labels: opacity→0
  const countLabels = elements.countdown.scene.querySelectorAll('.count-label')
  if (countLabels.length) {
    tl.to(countLabels, { opacity: 0, duration: 0.2 }, 0.2)
  }

  // Countdown title: fade out
  const title = elements.countdown.scene.querySelector('h1')
  if (title) {
    tl.to(title, { opacity: 0, duration: 0.3 }, 0)
  }

  // Countdown scene: pointer-events none
  tl.to(elements.countdown.scene, { pointerEvents: 'none' }, 0)

  // Vault scene: fade in
  tl.to(elements.vault.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  return tl
}

setMorphFn(MORPH_KEYS.COUNTDOWN_TO_VAULT, morphCountdownToVault)
