// src/config.js — ALL magic numbers live here. Edit here, not in code.

const base = import.meta.env.BASE_URL

export const TIMING = {
  MORPH_TIMEOUT_MS: 10_000,
  COUNTDOWN_INTERVAL_MS: 1_000,
  VAULT_SHAKE_MS: 250,
  WRONG_CODE_ERROR_AFTER: 3,   // show error only after N wrong attempts
  STAR_SHOOT_MIN_MS: 8_000,
  STAR_SHOOT_MAX_MS: 12_000,
}

export const ANIMATION = {
  MORPH_EASE: 'power2.inOut',
  SPIN_EASE: 'power4.out',
  SPIN_ROTATIONS: 4,   // minimum full rotations before landing
  LETTER_LINE_STAGGER: 0.15,
  CARD_STAGGER: 0.10,
  STAR_FADE_DURATION: 1.50,
  CONSTELLATION_DRAW_DELAY: 1.50,
  SONG_FADE_IN: 4.00,
  ENVELOPE_SCALE_BACK: 0.65,
}

export const AUDIO = {
  AMBIENT_VOLUME: 0.35,
  PULSE_VOLUME: 0.70,
  SONG_VOLUME: 0.25,
}

export const VISUALS = {
  STAR_COUNT: 150,
  CONSTELLATION_STARS: 24,
}

export const COLORS = {
  CRIMSON: '#AC1C35',
  CRIMSON_DEEP: '#7A0E22',
  BG: '#080106',
  GOLD: '#C9A84C',
}

export const PATHS = {
  AUDIO_AMBIENT: `${base}audio/ambient.wav`,
  AUDIO_PULSE: `${base}audio/pulse.wav`,
  AUDIO_SONG: `${base}audio/song.mp3`,
  IMAGE_PRECIOUS: `${base}images/precious.jpg`,
}

export const CONTENT = {
  TARGET_DATE: '2026-11-07T00:00:00',
  RECIPIENT_NAME: 'Precious Eniola Adelusi',
  PASSCODE_HASH: 'MTEwNw==',   // atob → '1107'
  SKIP_COUNTDOWN: import.meta.env.DEV,  // true locally, false in production
}
