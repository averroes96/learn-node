const path = require("path")
const express = require("express")
const cors  = require("cors")
const corsOptions = require("./config/cors/options")

const { logger } = require("./middleware/logEvents")
const errorHandler = require("./middleware/errorHandler")

const PORT = process.env.PORT || 3500
const app = express()

app.use(logger)


app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/", require("./routes/root"))
app.use("/", express.static(path.join(__dirname, "/public")))

app.use("/subdir", require("./routes/subdir"))
app.use("/subdir", express.static(path.join(__dirname, "/public")))

app.use("/employees", require("./routes/api/employees"))
app.use("/users", require("./routes/api/users"))

// Route chaining
const one = (req, res, next) => {
    console.log("One")
    next()
}

const two = (req, res, next) => {
    console.log("Two")
    next()
}

const three = (req, res) => {
    console.log("Three")
    res.send("Finished!")
}

app.get("^/chaining(.html)?$", [one, two, three])

app.all("*", (req, res) => {
    if (req.accepts("html")) {
        res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({"error": "Resource not found (404)"})
    }
    else {
        res.type("Resource not found (404)")
    }
    
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})