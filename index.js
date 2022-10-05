/// Setup
const express = require("express")

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
app.use("/trainers", require("./routes/trainers.js"))

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