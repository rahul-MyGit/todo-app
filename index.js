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
    
    const fileContents = fs.readFileSync("users.txt", "utf-8");
    const fileContentsObject = JSON.parse(fileContents);

    const userExists = fileContentsObject.users.some(user => user.username === username && user.password === password);
    if (userExists) {
        return res.send({
            success: false,
            message: "User already exists"
        });
    }

    fileContentsObject.users.push({
        id: userCounter,
        username,
        password,
        todos: []
    })
    userCounter++;

    fs.writeFileSync("users.txt", JSON.stringify(fileContentsObject))

    res.send({
        id: userCounter - 1,
        success: true
    })
})

app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/todos2.html")
})

app.post("/todo", (req, res) => {
    const userId = req.body.userId;
    const todoText = req.body.todo;
    
    const fileContents = fs.readFileSync("users.txt", "utf-8");
    const fileContentsObject = JSON.parse(fileContents);
    
    const user = fileContentsObject.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }
    
    const todoId = user.todos.length > 0 ? Math.max(...user.todos.map(t => t.id)) + 1 : 0;
    
    user.todos.push({
        id: todoId,
        text: todoText,
        completed: false
    });
    
    fs.writeFileSync("users.txt", JSON.stringify(fileContentsObject));
    
    res.send({
        success: true,
        todoId: todoId
    });
})

app.delete("/todo", (req, res) => {
    const userId = req.body.userId;
    const todoId = req.body.todoId;
    
    const fileContents = fs.readFileSync("users.txt", "utf-8");
    const fileContentsObject = JSON.parse(fileContents);
    
    const user = fileContentsObject.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }
    
    const todoIndex = user.todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
        return res.status(404).send({ success: false, message: "Todo not found" });
    }
    
    user.todos.splice(todoIndex, 1);
    
    fs.writeFileSync("users.txt", JSON.stringify(fileContentsObject));
    
    res.send({
        success: true,
        message: "Todo deleted"
    });
})

app.get("/todos", (req, res) => {
    const userId = parseInt(req.query.userId);
    
    const fileContents = fs.readFileSync("users.txt", "utf-8");
    const fileContentsObject = JSON.parse(fileContents);
    
    const user = fileContentsObject.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
    }
    
    res.send({
        success: true,
        todos: user.todos
    });
})

app.listen(3000);