// src/engine/director/morphs/fate.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphFateToConstellation(elements) {
  const tl = gsap.timeline()

  // Wheel: scale→0, opacity→0
  const wheel = elements.fate.scene.querySelector('.wheel')
  if (wheel) {
    tl.to(wheel, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(1.5)' }, 0)
  }

  // Fortune text: opacity→0, y→-8px
  const fortune = elements.fate.scene.querySelector('.fortune-display')
  if (fortune) {
    tl.to(fortune, { opacity: 0, y: -8, duration: 0.3 }, 0)
  }

  // Fate scene: pointer-events none
  tl.to(elements.fate.scene, { pointerEvents: 'none' }, 0)

  // Constellation scene: fade in
  tl.to(elements.constellation.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  return tl
}

setMorphFn(MORPH_KEYS.FATE_TO_CONSTELLATION, morphFateToConstellation)
