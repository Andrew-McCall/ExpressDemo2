/// Setup
const express = require("express")
const mongoose = require("mongoose")

const app = express()

/// Middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path)
    console.log(req.ip)
    console.log(new Date())
    next()
})

/// Routes
app.use("/array", require("./routes/trainers.js"))
app.use("/mongoose", require("./routes/mongoose.js"))

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
mongoose.connect("mongodb://127.0.0.1:27017/QA").then(()=>{
    console.log("DB Connected!")
}).catch(console.log)

const server = app.listen(3001, () => {
    console.log(server.address())
})
