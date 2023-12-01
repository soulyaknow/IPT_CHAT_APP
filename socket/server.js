const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) =>{
    res.json({message: "socket is ready!"});
});

const isAuthenticated = (socket, next) => {
    const query = socket.handshake.query;

    if (query && query.token){
        jwt.verify(query.token, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }    
};

io.use(isAuthenticated);

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("chat", (messageObj) => {
        const { userid, message, username } = messageObj;

        const query = "INSERT INTO chats(userid, message, username) VALUES(?, ?, ?)";

        con.query(query, [userid, message, username], (err, result) => {
            if (!err) {
                io.emit("chat", messageObj);
            } else {
                io.emit("chat", err);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(4002, () =>{
    console.log("Server listening on PORT 4002");
});