// src/engine/director/morphs/constellation.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphConstellationToAfterglow(elements) {
  const tl = gsap.timeline()
  
  // Canvas: opacity→0 (cleanup happens in constellation scene destroy)
  const canvas = elements.constellation.canvas
  if (canvas) {
    tl.to(canvas, { opacity: 0, duration: ANIMATION.STAR_FADE_DURATION }, 0)
  }
  
  // Constellation content: opacity→0, y→-12px
  const content = elements.constellation.scene.querySelector('.constellation-content')
  if (content) {
    tl.to(content, { opacity: 0, y: -12, duration: 0.5 }, 0)
  }
  
  // Constellation scene: pointer-events none
  tl.to(elements.constellation.scene, { pointerEvents: 'none' }, 0)
  
  // Afterglow scene: fade in
  tl.to(elements.afterglow.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)
  
  return tl
}

setMorphFn(MORPH_KEYS.CONSTELLATION_TO_AFTERGLOW, morphConstellationToAfterglow)
