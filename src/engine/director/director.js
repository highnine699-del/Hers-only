// src/engine/director/director.js
import gsap from 'gsap'
import { getMorphFn } from './morphRegistry.js'
import { TIMING } from '../../config.js'

export const director = {
  busy: false,
  elements: null,

  init(elements) {
    this.elements = elements
    this.busy = false
  },

  async morph(from, to) {
    // INTENTIONAL: concurrent requests are silently ignored, not queued.
    // All transitions are tap-triggered — overlap = accidental double-tap.
    // If automatic transitions are added later, implement a single-slot queue.
    if (this.busy) {
      console.warn('[Director] Busy — morph request ignored:', from, '→', to)
      return false
    }

    const key = `${from}_${to}` 
    const morphFn = getMorphFn(key)
    if (!morphFn) {
      console.warn('[Director] No morph registered for:', key)
      return false
    }

    this.busy = true

    try {
      await Promise.race([
        morphFn(this.elements),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`[Director] Morph timed out: ${key}`)),
            TIMING.MORPH_TIMEOUT_MS
          )
        ),
      ])
      return true
    } catch (err) {
      console.error(err)
      this._recover(to)
      return false
    } finally {
      this.busy = false
      // DO NOT call revert() here — it would undo completed animations
    }
  },

  _recover(targetScene) {
    console.warn('[Director] Recovery triggered for:', targetScene)
    gsap.killTweensOf('*')
    const sceneEl = this.elements?.[targetScene]?.scene
    if (sceneEl) {
      gsap.set(sceneEl, { opacity: 1, pointerEvents: 'auto', scale: 1 })
    }
  },
}
