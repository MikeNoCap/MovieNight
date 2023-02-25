const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index")
})


let users = []
io.on("connection", socket => {
    let socketUserId;
    socket.on("join-room", (userId) => {
        socketUserId = userId;
        users.push(userId)
        socket.join("movie-night")
        if (users.length == 1) {
            socket.emit("init-session")
        }
        else {
            socket.to("movie-night").emit("user-connected", userId)
        }
    })
    socket.on("disconnect", () => {
        users = users.filter((item) => {
            return item !== socketUserId
        })
    })

})


server.listen(3000)