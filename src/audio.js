import { Howl } from 'howler'

let ambientSound = null

export function createAmbient() {
  if (ambientSound) {
    return ambientSound
  }

  ambientSound = new Howl({
    src: ['/audio/ambient.wav'],
    html5: true,
    loop: true,
    volume: 0.18,
    preload: true,
  })

  return ambientSound
}

export function startAmbient() {
  const sound = createAmbient()
  if (!sound.playing()) {
    sound.play()
  }
}

export function playPulse() {
  const pulse = new Howl({
    src: ['/audio/pulse.wav'],
    html5: true,
    volume: 0.26,
    preload: true,
  })
  pulse.play()
}
