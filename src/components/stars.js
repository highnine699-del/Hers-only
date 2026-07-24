export function createConstellation(canvas, { width, height }) {
    if (!canvas) return null

    const context = canvas.getContext('2d')
    if (!context) return null

    const stars = Array.from({ length: 36 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        drift: Math.random() * 0.01 + 0.003,
    }))

    const draw = () => {
        context.clearRect(0, 0, width, height)
        context.fillStyle = 'rgba(255, 240, 243, 0.95)'

        stars.forEach((star) => {
            context.beginPath()
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
            context.fillStyle = `rgba(255, 240, 243, ${star.alpha})`
            context.fill()
            star.y += star.drift
            if (star.y > height + 4) {
                star.y = -4
            }
        })

        context.beginPath()
        context.moveTo(width * 0.2, height * 0.22)
        context.quadraticCurveTo(width * 0.48, height * 0.1, width * 0.64, height * 0.32)
        context.quadraticCurveTo(width * 0.75, height * 0.46, width * 0.84, height * 0.7)
        context.strokeStyle = 'rgba(246, 184, 193, 0.65)'
        context.lineWidth = 2
        context.stroke()

        context.beginPath()
        context.arc(width * 0.52, height * 0.43, 8, 0, Math.PI * 2)
        context.fillStyle = 'rgba(255, 214, 224, 0.95)'
        context.fill()
    }

    const animation = () => {
        draw()
        requestAnimationFrame(animation)
    }

    animation()
    return { stop: () => cancelAnimationFrame(animation) }
}
