// src/assets.js
import { Howl } from 'howler'
import { PATHS, AUDIO } from './config.js'

export const assets = {
  ambient: null,
  pulse: null,
  song: null,
}

export async function loadAssets() {
  assets.ambient = new Howl({
    src: [PATHS.AUDIO_AMBIENT],
    volume: AUDIO.AMBIENT_VOLUME,
    loop: true,
  })

  assets.pulse = new Howl({
    src: [PATHS.AUDIO_PULSE],
    volume: AUDIO.PULSE_VOLUME,
  })

  assets.song = new Howl({
    src: [PATHS.AUDIO_SONG],
    volume: AUDIO.SONG_VOLUME,
  })

  return assets
}
