// src/engine/director/morphs/letter.js
import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'
import { ANIMATION } from '../../../config.js'
import gsap from 'gsap'

export function morphLetterToPromises(elements) {
  const tl = gsap.timeline()

  // Letter text: stagger opacity→0, y→-8px (fades out)
  const lines = elements.letter.scene.querySelectorAll('.letter-lines p')
  tl.to(lines, {
    opacity: 0,
    y: -8,
    duration: 0.3,
    stagger: 0.05,
    ease: 'power2.inOut'
  }, 0)

  // Letter paper: stays, dims to opacity 0.35 (backdrop for cards)
  const letterPaper = elements.letter.scene.querySelector('.letter-paper')
  if (letterPaper) {
    tl.to(letterPaper, { opacity: 0.35, duration: 0.4 }, 0.2)
  }

  // Continue button: fade out
  const continueBtn = elements.letter.scene.querySelector('.continue-btn')
  if (continueBtn) {
    tl.to(continueBtn, { opacity: 0, duration: 0.3 }, 0)
  }

  // Letter scene: pointer-events none
  tl.to(elements.letter.scene, { pointerEvents: 'none' }, 0)

  // Promises scene: fade in
  tl.to(elements.promises.scene, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 0.3)

  return tl
}

setMorphFn(MORPH_KEYS.LETTER_TO_PROMISES, morphLetterToPromises)
