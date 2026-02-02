// canvas van waar het gaat gebeuren
const canvas = document.querySelector("#canvas")
const context = canvas.getContext("2d")
canvas.width = window.innerWidth / 2
canvas.height = window.innerHeight / 2

const canvas1 = document.querySelector("#canvas1")
const context1 = canvas1.getContext("2d")
canvas1.width = window.innerWidth / 2
canvas1.height = window.innerHeight / 2

// spullen om de audio uit elkaar te kunnen halen en te analyseren
const audio = document.querySelector("#audio")
const audioContext = new AudioContext()
const track = audioContext.createMediaElementSource(audio)
const analyser = audioContext.createAnalyser()

track.connect(analyser)
analyser.connect(audioContext.destination)

analyser.fftSize = 256
const data = new Uint8Array(analyser.frequencyBinCount)

// speelt af als je op de knop drukt
const button = document.querySelector("button")
button.addEventListener("click", buttonHandler)

function buttonHandler() {
    const icon = document.querySelector("#icon")
    if (audioContext.state === "suspended") {
        audioContext.resume()
    }

    if (button.dataset.playing === "false") {
        audio.play()
        button.dataset.playing = "true"
        icon.className = "fa-solid fa-pause"
    } else if (button.dataset.playing === "true") {
        audio.pause()
        button.dataset.playing = "false"
        icon.className = "fa-solid fa-play"
    }
}

//basis animatie om de audio in een cirkel te krijgen
function animate() {
    requestAnimationFrame(animate)
    analyser.getByteFrequencyData(data)

    context.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 60

    data.forEach((value, i) => {
        const angle = (i / data.length) * Math.PI * 2
        const length = value * 0.56

        const x = centerX + Math.cos(angle) * (radius + length)
        const y = centerY + Math.sin(angle) * (radius + length)

        context.beginPath()
        context.moveTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        )
        context.lineTo(x, y)
        context.strokeStyle = `hsl(${i * 3}, 100%, 60%)`
        context.lineWidth = Math.max(2, value / 40)
        context.lineCap = "round"
        context.lineJoin = "round"
        context.shadowBlur = 20
        context.shadowColor = context.strokeStyle
        context.stroke()
    })
}

// animatie met een glitch effect
function animate1() {
    requestAnimationFrame(animate1)
    analyser.getByteFrequencyData(data)

    context1.clearRect(0, 0, canvas1.width, canvas1.height)

    const centerX = canvas1.width / 2
    const centerY = canvas1.height / 2
    const radius = 60

    data.forEach((value, i) => {
        const angle = -(i / data.length) * Math.PI * 2 + Math.PI
        const length = value * 0.56

        // kijkt naar gemiddelde bas
        let bass = 0;
        for (let i = 0; i < 10; i++) {
            bass += data[i]
        }
        bass /= 10;
        let smoothBass = 0;
        smoothBass += (bass - smoothBass) * 0.1

        // hoe meer bas hoe erger het glitch effect
        const intensity = Math.max(0, smoothBass - 15)
        const jitter = intensity * 0.3 * (Math.random() - 0.5)

        const x = centerX + Math.cos(angle) * (radius + length) + jitter
        const y = centerY + Math.sin(angle) * (radius + length) + jitter

        context1.beginPath()
        context1.moveTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        )
        context1.lineTo(x, y)
        context1.strokeStyle = `hsl(${i * 3}, 100%, 60%)`
        context1.lineWidth = Math.max(2, value / 40)
        context1.lineCap = "round"
        context1.lineJoin = "round"
        context1.shadowBlur = 20
        context1.shadowColor = context.strokeStyle
        context1.stroke()
    })
}

animate()
animate1()