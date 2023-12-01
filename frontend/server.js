const express = require("express");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/login/index.html");
});

app.get("/register", (req, res) =>{
    res.sendFile(__dirname + "/register/index.html");
});

app.get("/landing", (req, res) =>{
    res.sendFile(__dirname + "/landing/index.html");
});

app.get("/chats", (req, res) =>{
    res.sendFile(__dirname + "/chats/index.html");
});

app.get("/about", (req, res) =>{
    res.sendFile(__dirname + "/about/index.html");
});

app.listen(4000, () =>{
    console.log("Server Running On Port 4000");
});