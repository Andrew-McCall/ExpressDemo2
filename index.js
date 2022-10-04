/// Setup
const express = require("express")

const app = express()

var trainers = [{id:0, firstName:"andrew", surname:"McCall", "age":25, hobbies:["Gaming", "Reading","Coding"]}]
var id = 0;

/// Middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path)
    console.log(req.ip)
    console.log(new Date())
    next()
})

/// Routes
app.get("/getAll", (req, res) => {
    res.status(200).json(trainers)
})

app.get("/getOne/:id", (req, res, next) => {

    for (const t of trainers) {
        if (t.id == req.params.id){
            res.status(200).json(t)
            return;
        }
    }
    
    next(new Error("Index invaild"))
})

app.delete("/deleteOne/:id", (req, res, next) => {
    try{
        trainers = trainers.filter(t => (t.id != req.params.id))
        res.status(200).json(trainers)
    }catch (err){
        next(new Error("Index invaild"))
    }
})

app.put("/create", (req, res, next) => {
    if (req.body.firstName && req.body.surname){
        req.body.id = ++id;
        trainers.push(req.body)
        res.status(201).json(req.body)
    }else{
        next(new Error('Expected {"firstName":"{name}", "surname":"{name}"}'))
    }
})

app.post("/update/:id", (req, res,next) => {

    const index = trainers.indexOf(trainers.find(t => t.id == req.params.id))

    if(index === -1){
        next(new Error('Invaild Index'))
    }else{
        trainers[index] = {...trainers[index], ...req.body}

        res.status(200).json(trainers[index])
    }
    
})

app.get("/error", (req, res, next) => {
    next(new Error("Custom Error"))
})

/// Error Handling
app.use((err, req, res, next) => {
    console.log(err)
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send(err.stack)
    next(err)
})

/// Start
const server = app.listen(3001, () => {
    console.log(server.address())
})