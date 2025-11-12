const express = require('express');
const app = express();
const fs = require("fs");

let db = fs.readFileSync("users.txt", "utf-8");
let userCounter = JSON.parse(db).users.length;

app.use(express.json())

app.get("/signup", (req, res) => {
    // BAD
    res.sendFile(__dirname + "/signup.html")
})


app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const fileContents = fs.readFileSync("users.txt", "utf-8"); // 
    const fileContentsObject = JSON.parse(fileContents);

    fileContentsObject.users.push({
        id: userCounter,
        username,
        password,
        todos: []
    })
    userCounter++;

    fs.writeFileSync("users.txt", JSON.stringify(fileContentsObject))

    res.send({
        id: userCounter - 1
    })
})

app.get("/dashboard", (Req, res) => {
    res.sendFile(__dirname + "/todos.html")
})

app.post("/todo", (req, res) => {
    res.send("hi there")
})

app.delete("/todo", (req, res) => {
    res.send("hi there")
})

app.get("/todo", (req, res) => {

})

app.listen(3000);