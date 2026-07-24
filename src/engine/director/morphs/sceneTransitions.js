import { MORPH_KEYS, setMorphFn } from '../morphRegistry.js'

function createFadeMorph(fromKey, toKey) {
    return async function morph({ elements, gsap }) {
        const from = elements[fromKey].scene
        const to = elements[toKey].scene

        const timeline = gsap.timeline()
        timeline.to(from, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
        timeline.to(from, { pointerEvents: 'none' }, 0)
        timeline.set(to, { opacity: 0, pointerEvents: 'none' })
        timeline.to(to, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
        timeline.to(to, { pointerEvents: 'auto' }, 0.5)

        return new Promise((resolve) => {
            timeline.eventCallback('onComplete', resolve)
        })
    }
}

setMorphFn(MORPH_KEYS.ENVELOPE_TO_LETTER, createFadeMorph('envelope', 'letter'))
setMorphFn(MORPH_KEYS.LETTER_TO_PROMISES, createFadeMorph('letter', 'promises'))
setMorphFn(MORPH_KEYS.PROMISES_TO_MEMORY, createFadeMorph('promises', 'memory'))
setMorphFn(MORPH_KEYS.MEMORY_TO_FATE, createFadeMorph('memory', 'fate'))
setMorphFn(MORPH_KEYS.FATE_TO_CONSTELLATION, createFadeMorph('fate', 'constellation'))
setMorphFn(MORPH_KEYS.CONSTELLATION_TO_AFTERGLOW, createFadeMorph('constellation', 'afterglow'))
