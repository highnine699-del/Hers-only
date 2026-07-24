// src/main.js
import { director } from './engine/director/director.js'
import { state }    from './engine/state.js'
import { loadAssets } from './assets.js'

// Import all morph registrations (side effects only)
import './engine/director/morphs/countdown.js'
import './engine/director/morphs/vault.js'
import './engine/director/morphs/envelope.js'
import './engine/director/morphs/letter.js'
import './engine/director/morphs/promises.js'
import './engine/director/morphs/memory.js'
import './engine/director/morphs/fate.js'
import './engine/director/morphs/constellation.js'

// Import scene initialisers
import { init as initCountdown }     from './scenes/countdown.js'
import { init as initVault }         from './scenes/vault.js'
import { init as initEnvelope }      from './scenes/envelope.js'
import { init as initLetter }        from './scenes/letter.js'
import { init as initPromises }      from './scenes/promises.js'
import { init as initMemory }        from './scenes/memory.js'
import { init as initFate }          from './scenes/fate.js'
import { init as initConstellation } from './scenes/constellation.js'
import { init as initAfterglow }     from './scenes/afterglow.js'

function updateVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}

function collectAllElements() {
  return {
    stage:         document.querySelector('#stage'),
    countdown:   { scene: document.querySelector('.countdown-scene') },
    vault:       { scene: document.querySelector('.vault-scene') },
    envelope:    { scene: document.querySelector('.envelope-scene') },
    letter:      { scene: document.querySelector('.letter-scene') },
    promises:    { scene: document.querySelector('.promises-scene') },
    memory:      { scene: document.querySelector('.memory-scene') },
    fate:        { scene: document.querySelector('.fate-scene') },
    constellation:{ scene: document.querySelector('.constellation-scene'),
                   canvas: document.querySelector('.star-canvas') },
    afterglow:   { scene: document.querySelector('.afterglow-scene') },
  }
}

function validateElements(elements) {
  const walk = (obj, path = '') => {
    for (const [k, v] of Object.entries(obj)) {
      const p = path ? `${path}.${k}` : k
      if (v === null || v === undefined) throw new Error(`[Boot] Missing: ${p}`)
      if (typeof v === 'object' && !v.nodeType) walk(v, p)
    }
  }
  walk(elements)
  console.log('✓ All elements validated')
}

async function bootstrap() {
  updateVh()
  window.addEventListener('resize', updateVh)

  const elements = collectAllElements()
  validateElements(elements)

  director.init(elements)
  state.init(elements)

  await loadAssets()
  console.log('✓ Assets loaded')

  initCountdown(elements)
  initVault(elements)
  initEnvelope(elements)
  initLetter(elements)
  initPromises(elements)
  initMemory(elements)
  initFate(elements)
  initConstellation(elements)
  initAfterglow(elements)

  console.log('✓ Birthday Vault ready')
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', bootstrap)
  : bootstrap()

