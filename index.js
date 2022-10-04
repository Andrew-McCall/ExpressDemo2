/// Setup
const express = require("express")

const app = express()

const names = ["Andrew", "David"]

/// Middleware
app.use(express.json())

/// Routes
app.get("/", (req, res) => {
    res.status(200).send("Hello, my name is!")
})

app.get("/getAll", (req, res) => {
    res.status(200).json(names)
})

app.get("/getOne/:id", (req, res) => {
    try{
        res.status(200).json(names[req.params.id])
    }catch (err){
        res.status(500).send("Index invaild")
    }
})

app.delete("/deleteOne/:id", (req, res) => {
    try{
        const deleted = names[req.params.id]
        
        // delete names[req.params.id]
        names.splice(req.params.id, 1)

        res.status(200).json(deleted)
    }catch (err){
        res.status(500).send("Index invaild")
    }
})

app.put("/create", (req, res) => {
    if (req.body.name){
        names.push(req.body.name)
        res.status(201).send(`${req.body.name}, ${names.length}`)
    }else{
        res.status(500).send('Expected {"name":"{name}"}')
    }
})

app.post("/update/:id", (req, res) => {
    if (req.params.id && req.query.name){
        const replaced = names[req.params.id]
        names[req.params.id] = req.query.name
        res.status(201).send(`${names[req.params.id]} replaced ${replaced}, ${req.params.id}`)
    }else{
        res.status(500).send('/update/{id}?name={name}')
    }
})

/// Start
const server = app.listen(3001, () => {
    console.log(server.address())
})