// src/scenes/countdown.js
import { syncNetworkTime, getNow, calculateCountdown, formatTime } from '../engine/time.js'
import { CONTENT } from '../config.js'
import { state } from '../engine/state.js'

let elements = null
let intervalId = null

export function init(els) {
  elements = els.countdown

  // Dev bypass — skip straight to vault when running locally
  if (CONTENT.SKIP_COUNTDOWN) {
    state.forceScene('vault')
    return
  }

  // Build countdown UI
  const scene = elements.scene
  scene.innerHTML = `
    <h1 style="font-family: 'Great Vibes', cursive; font-size: clamp(2.5rem, 6vw, 4rem); color: var(--text); text-align: center; margin: 0 0 2rem 0;">THE BIRTHDAY VAULT</h1>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0;">
      <div class="count-block" style="text-align: center;">
        <div class="count-value countdown-days" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 600;">00</div>
        <div class="count-label" style="color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem;">DAYS</div>
      </div>
      <div class="count-block" style="text-align: center;">
        <div class="count-value countdown-hours" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 600;">00</div>
        <div class="count-label" style="color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem;">HOURS</div>
      </div>
      <div class="count-block" style="text-align: center;">
        <div class="count-value countdown-minutes" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 600;">00</div>
        <div class="count-label" style="color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem;">MINUTES</div>
      </div>
      <div class="count-block" style="text-align: center;">
        <div class="count-value countdown-seconds" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 600;">00</div>
        <div class="count-label" style="color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem;">SECONDS</div>
      </div>
    </div>
    <p style="color: var(--muted); text-align: center; margin-top: 2rem;">For ${CONTENT.RECIPIENT_NAME}</p>
  `

  // Collect element references
  elements.days = scene.querySelector('.countdown-days')
  elements.hours = scene.querySelector('.countdown-hours')
  elements.minutes = scene.querySelector('.countdown-minutes')
  elements.seconds = scene.querySelector('.countdown-seconds')

  // Sync network time once per session
  syncNetworkTime().catch(() => { })

  // Check if we should skip countdown (already past date)
  const now = getNow()
  const countdown = calculateCountdown(now)
  if (countdown.isZero) {
    // Skip to vault
    state.requestTransition('vault')
    return
  }

  // Start countdown tick
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
}

function updateCountdown() {
  const now = getNow()
  const countdown = calculateCountdown(now)

  elements.days.textContent = formatTime(countdown.days)
  elements.hours.textContent = formatTime(countdown.hours)
  elements.minutes.textContent = formatTime(countdown.minutes)
  elements.seconds.textContent = formatTime(countdown.seconds)

  if (countdown.isZero) {
    clearInterval(intervalId)
    state.requestTransition('vault')
  }
}
