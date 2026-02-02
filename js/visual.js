// canvas van waar het gaat gebeuren
const canvas = document.querySelector("#canvas")
const context = canvas.getContext("2d")
canvas.width = window.innerWidth / 2
canvas.height = window.innerHeight / 2

const audio = document.querySelector("#audio")
const audioContext = new AudioContext()
const track = audioContext.createMediaElementSource(audio)
const analyser = audioContext.createAnalyser()

// speeld af als je op de knop drukt
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

track.connect(analyser)
analyser.connect(audioContext.destination)

analyser.fftSize = 256
const data = new Uint8Array(analyser.frequencyBinCount)

//animatie om de audio in een cirkel te krijgen
function animate() {
    requestAnimationFrame(animate)
    analyser.getByteFrequencyData(data)

    context.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 50

    data.forEach((value, i) => {
        const angle = (i / data.length) * Math.PI * 2
        const length = value * 0.5

        const x = centerX + Math.cos(angle) * (radius + length)
        const y = centerY + Math.sin(angle) * (radius + length)

        context.beginPath();
        context.moveTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        context.lineTo(x, y)
        context.strokeStyle = `hsl(${i * 3}, 100%, 60%)`
        context.lineWidth = 4
        context.stroke()
    });
}

animate()