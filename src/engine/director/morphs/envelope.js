// src/engine/director/morphs/envelope.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphEnvelopeToLetter(elements) {
  const tl = gsap.timeline()

  // Envelope scene: fade out (already receded from envelope animation)
  tl.to(elements.envelope.scene, { opacity: 0, pointerEvents: 'none', duration: 0.3 }, 0)

  // Letter scene: fade in
  tl.to(elements.letter.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, '<0.1')

  return tl
}

setMorphFn(MORPH_KEYS.ENVELOPE_TO_LETTER, morphEnvelopeToLetter)
