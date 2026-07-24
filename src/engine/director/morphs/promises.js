// src/engine/director/morphs/promises.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphPromisesToMemory(elements) {
  const tl = gsap.timeline()

  // Promises cards: stagger opacity→0, scale→0.8, y→-12px
  const cards = elements.promises.scene.querySelectorAll('.heart-card')
  tl.to(cards, {
    opacity: 0,
    scale: 0.8,
    y: -12,
    duration: 0.3,
    stagger: 0.08,
    ease: 'power2.inOut'
  }, 0)

  // Promises scene: pointer-events none
  tl.to(elements.promises.scene, { pointerEvents: 'none' }, 0)

  // Memory scene: fade in
  tl.to(elements.memory.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  return tl
}

setMorphFn(MORPH_KEYS.PROMISES_TO_MEMORY, morphPromisesToMemory)
