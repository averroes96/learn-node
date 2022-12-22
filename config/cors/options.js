const whitelist = [
    "http://127.0.0.1:5500",
    "http://localhost:3500",
    "https://www.google.com"
]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) != -1 || !origin) {
            return callback(null, true)
        }
        else {
            return callback(new Error("Not allowed by CORS."))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions