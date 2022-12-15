const path = require("path")
const express = require("express")
const cors  = require("cors")

const { logger } = require("./middleware/logEvents")

const PORT = process.env.PORT || 3500
const app = express()

app.use(logger)

const whitelist = [
    "http://127.0.0.1:5500",
    "http://localhost:3500",
    "https://www.google.com"
]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) != -1) {
            return callback(null, true)
        }
        else {
            return callback(new Error("Not allowed by CORS."))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, "/public")))

app.get("^/$|^/index(.html)?$", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.get("^/new-page(.html)?$", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"))
})

app.get("^/old-page(.html)?$", (req, res) => {
    res.redirect(301, "/new-page.html")
})

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

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})