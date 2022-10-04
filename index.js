const express = require("express")
const cors = require("cors")

const app = express();

app.use(express.json())
app.use(cors())

app.use( (req, res, next) => {
    console.log(req.url)
    console.log(new Date());

    next();
})


// Request, Response
app.get("/read", (req, res) => { 
    res.status(200).send("read")
})

app.get("/read/:id", (req, res) => { 
    res.status(200).send(req.params.id)
})

app.put("/create", (req, res) => { 

    // Create in DB
    console.log(req.body)

    res.status(201).json(req.body)
})

app.post("/replace", (req, res) => { 
    res.status(200).send("replace")
})

// Partial
app.patch("/update", (req, res) => {
    res.status(200).send("update")
})

app.delete("/delete", (req, res) => { 
    res.status(200).send("delete")
})

const server = app.listen(3001, ()=>{
    console.log(server.address())
})
