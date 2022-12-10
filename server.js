const path = require("path")
const express = require("express")

const PORT = process.env.PORT || 3500
const app = express()

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