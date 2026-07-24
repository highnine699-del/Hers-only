// src/engine/time.js
import { CONTENT } from '../config.js'

const TARGET_DATE_MS = new Date(CONTENT.TARGET_DATE).getTime()

// serverOffset is the difference (ms) between authoritative server time
// and the local clock. We sync once per session and then use arithmetic
// on every tick to avoid repeated network calls.
let serverOffset = 0
let _synced = false

export async function syncNetworkTime() {
  if (_synced) return
  _synced = true
  try {
    const localBefore = Date.now()
    const res = await fetch('https://worldtimeapi.org/api/ip', {
      signal: AbortSignal.timeout(3000)
    })
    if (!res.ok) throw new Error('bad response')
    const data = await res.json()
    const serverNow = data.unixtime ? data.unixtime * 1000 : new Date(data.datetime).getTime()
    const localAfter = Date.now()
    // estimate network latency by averaging before/after
    serverOffset = serverNow - Math.round((localBefore + localAfter) / 2)
    console.log(`[Time] Synced. Offset: ${serverOffset}ms`)
  } catch (err) {
    console.warn('[Time] Network sync failed — using local clock')
    serverOffset = 0
  }
}

export function getNow() {
  return Date.now() + serverOffset
}

export function calculateCountdown(nowMs) {
  const diff = Math.max(0, TARGET_DATE_MS - nowMs)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, isZero: totalSeconds === 0 }
}

export function formatTime(num) {
  return String(num).padStart(2, '0')
}
