const socket = io();
const myPeer = new Peer(undefined, {
    host: "/",
    port: 3001
})

myPeer.on("open", id=> {
    socket.emit("join-room", id)
    socket.on("init-session", () => {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { ideal: 4096 },
                height: { ideal: 2160 }
            },
            audio: {
                autoGainControl: false,
                channelCount: 2,
                echoCancellation: false,
                latency: 0,
                noiseSuppression: false,
                sampleRate: 48000,
                sampleSize: 16,
                volume: 1.0
              }
        }).then((stream) => {
            addVideoStream(document.getElementById("movie"), stream)
            socket.on("user-connected", userId => {
                console.log("Connecting to ", userId, " with stream ", stream)
                connectToNewUser(userId, stream)
            })
        })
    })
    myPeer.on("call", call => {
        call.answer(undefined)
        call.on("stream", leaderScreenStream => {
            console.log(leaderScreenStream)
            addVideoStream(document.getElementById("movie"), leaderScreenStream)
        })
    })
})




function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    call.on('stream', userVideoSteram => {

    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        document.getElementById("samtykke").addEventListener("click", () => {
            document.getElementById("home").style.opacity = 0;
            video.play()
        })
    })
}