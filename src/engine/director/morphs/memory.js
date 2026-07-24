// src/engine/director/morphs/memory.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphMemoryToFate(elements) {
  const tl = gsap.timeline()

  // Memory cards: stagger opacity→0, scale→0.9, y→-8px
  const cards = elements.memory.scene.querySelectorAll('.memory-card')
  tl.to(cards, {
    opacity: 0,
    scale: 0.9,
    y: -8,
    duration: 0.3,
    stagger: 0.06,
    ease: 'power2.inOut'
  }, 0)

  // Memory scene: pointer-events none
  tl.to(elements.memory.scene, { pointerEvents: 'none' }, 0)

  // Fate scene: fade in
  tl.to(elements.fate.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  return tl
}

setMorphFn(MORPH_KEYS.MEMORY_TO_FATE, morphMemoryToFate)
