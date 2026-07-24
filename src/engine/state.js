// src/engine/state.js
import { storage } from './storage.js'
import { director } from './director/director.js'

const SCENES = [
  'countdown', 'vault', 'envelope', 'letter',
  'promises', 'memory', 'fate', 'constellation', 'afterglow',
]

const VALID_TRANSITIONS = new Set([
  'countdown_vault', 'vault_envelope', 'envelope_letter',
  'letter_promises', 'promises_memory', 'memory_fate',
  'fate_constellation', 'constellation_afterglow',
])

let current = 'countdown'
let elements = null
let memoryCardUnlocked = false

export const state = {
  init(els) {
    elements = els
    const saved = storage.load()
    if (saved && SCENES.includes(saved)) current = saved
    this.forceScene(current)
  },

  getCurrent() { return current },

  isValidTransition(from, to) {
    return VALID_TRANSITIONS.has(`${from}_${to}`)
  },

  async requestTransition(to) {
    if (!this.isValidTransition(current, to)) {
      console.warn('[State] Invalid transition:', current, '→', to)
      return false
    }
    const from = current
    const success = await director.morph(from, to)
    if (success) {
      current = to
      storage.save(to)
    }
    return success
  },

  forceScene(sceneName) {
    if (!SCENES.includes(sceneName)) return false
    current = sceneName
    if (!elements) return false
    SCENES.forEach(name => {
      const el = elements[name]?.scene
      if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none' }
    })
    const target = elements[sceneName]?.scene
    if (target) { target.style.opacity = '1'; target.style.pointerEvents = 'auto' }
    storage.save(current)
    return true
  },

  unlockMemoryCard() {
    memoryCardUnlocked = true
  },

  isMemoryCardUnlocked() {
    return memoryCardUnlocked
  },
}
