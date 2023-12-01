const express = require("express");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const app = express();

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat_db"
});

app.use(express.json());
app.use(cors());

const isAuthenticated = (req, res, next) =>{
    const token = req.header("Authorization");

    jwt.verify(token, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", (err, user) => {
        if (err) {
          return res.status(403).json({ code_number: 403, message: "Forbidden: Invalid token" });
        }
    
        req.user = user;

        next();
      });
}

app.get("/", (req, res) =>{
    res.json({message: "Backend is ready!"});
});

//api
app.post("/login", (req, res) => {
    
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    
    con.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error." });
        }

        if (result.length === 1) {
            // User found
            const user = result[0];
            if(password == user.password){

                const token = jwt.sign({  userID: user.userid }, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", { expiresIn: "24h" });
                return res.status(200).json({ message: "User Login successfully!", codeNumber: 1, userID: user.userid, name: username, token: token });
            
            } else {
                return res.status(401).json({ message: "Invalid username or password.", codeNumber: 0 });
            }
        } else {
            return res.status(401).json({ message: "Invalid username or password." });
        }
    });

});

app.post("/register", (req, res)=>{

    const {username, password, firstname, lastname, gender} = req.body;

    const query = "INSERT INTO users(username, password, firstname, lastname, gender) VALUES(?, ?, ?, ?, ?)";

    con.query(query, [username, password, firstname, lastname, gender], (err, result)=>{

        console.log(result);

        if(!err){
            return res.status(201).json({message: 200});
        }
        
        return res.status(500).json({message: "Server Error."});
    });

});

app.get("/messages", isAuthenticated, (req, res)=> {

    const query = "SELECT userid, message, username FROM chats";

    con.query(query, (err, result) =>{
        if(!err){
            return res.status(200).json(result);
        }
        return res.status(500).json({message: "Server error."});
    });

});

app.listen(4001, ()=>{
    console.log("Server Running On Port 4001");
});
