const audioContext = new AudioContext()

const audioElement = document.querySelector("audio")
const track = audioContext.createMediaElementSource(audioElement)
track.connect(audioContext.destination)

const button = document.querySelector("button")
button.addEventListener("click", buttonHandler)

function buttonHandler() {
    if (audioContext.state === "suspended") {
        audioContext.resume()
    }

    if (button.dataset.playing === "false") {
        audioElement.play()
        button.dataset.playing = "true"
        button.innerText = "Pause"
    } else if (button.dataset.playing === "true") {
        audioElement.pause()
        button.dataset.playing = "false"
        button.innerText = "Play"
    }
}

audioElement.addEventListener("ended", () => {
    button.dataset.playing = "false";
})