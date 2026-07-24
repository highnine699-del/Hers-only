// src/engine/director/morphRegistry.js
import { notImplemented } from './notImplemented.js'

export const MORPH_KEYS = {
  COUNTDOWN_TO_VAULT:          'countdown_vault',
  VAULT_TO_ENVELOPE:           'vault_envelope',
  ENVELOPE_TO_LETTER:          'envelope_letter',
  LETTER_TO_PROMISES:          'letter_promises',
  PROMISES_TO_MEMORY:          'promises_memory',
  MEMORY_TO_FATE:              'memory_fate',
  FATE_TO_CONSTELLATION:       'fate_constellation',
  CONSTELLATION_TO_AFTERGLOW:  'constellation_afterglow',
}

const registry = new Map(
  Object.values(MORPH_KEYS).map(key => [key, notImplemented])
)

export function getMorphFn(key) {
  if (!registry.has(key)) {
    console.warn('[MorphRegistry] Unknown key:', key)
    return null
  }
  return registry.get(key)
}

export function setMorphFn(key, fn) {
  if (!registry.has(key)) {
    throw new Error(`[MorphRegistry] Cannot register unknown key: ${key}`)
  }
  registry.set(key, fn)
}
