// src/components/wheel.js
export function createWheel(onSpinComplete) {
  const container = document.createElement('div')
  container.className = 'wheel-container'
  container.style.cssText = `
    position: relative;
    width: 280px;
    height: 280px;
    margin: 2rem auto;
  `
  
  // Wheel circle
  const wheel = document.createElement('div')
  wheel.className = 'wheel'
  wheel.style.cssText = `
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      var(--surface) 0deg 60deg,
      var(--surface-rim) 60deg 120deg,
      var(--surface) 120deg 180deg,
      var(--surface-rim) 180deg 240deg,
      var(--surface) 240deg 300deg,
      var(--surface-rim) 300deg 360deg
    );
    border: 2px solid var(--crimson);
    cursor: pointer;
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  `
  
  // Center label
  const center = document.createElement('div')
  center.style.cssText = `
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    pointer-events: none;
  `
  center.textContent = 'SPIN'
  
  // Pointer (triangle at top)
  const pointer = document.createElement('div')
  pointer.style.cssText = `
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 20px solid var(--crimson);
    z-index: 10;
  `
  
  wheel.appendChild(center)
  container.appendChild(pointer)
  container.appendChild(wheel)
  
  // Spin handler
  let isSpinning = false
  wheel.addEventListener('click', () => {
    if (isSpinning) return
    isSpinning = true
    
    // Random rotation: at least 4 full rotations + random segment
    const baseRotations = 4
    const randomSegment = Math.floor(Math.random() * 6)
    const segmentAngle = 60
    const totalRotation = (baseRotations * 360) + (randomSegment * segmentAngle)
    
    wheel.style.transform = `rotate(${totalRotation}deg)`
    
    // Callback after spin completes
    setTimeout(() => {
      isSpinning = false
      if (onSpinComplete) onSpinComplete(randomSegment)
    }, 4000)
  })
  
  return container
}
