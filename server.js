const logEvent = require("./logEvents")
const EventEmitter = require('events')
const http = require("http")
const path = require("path")
const fs = require("fs")
const fsPromises = require("fs/promises")


class Emitter extends EventEmitter {}

const myEmitter = new Emitter()

myEmitter.on("log", (message) => logEvent(message))

const PORT = process.env.PORT || 3500
const server = http.createServer((request, response) => {
    console.log(request.method, request.url)

    let filePath
    let contentType
    const extension = path.extname(request.url)

    switch (extension) {
        case ".css":
            contentType = "text/css"
            break;
        
        case ".js":
            contentType = "text/javascript"
            break;
        
        case ".json":
            contentType = "application/json"
            break;
        
        case ".jpg":
            contentType = "image/jpeg"
            break;

        case ".png":
            contentType = "image/png"
            break;
        
        case ".txt":
            contentType = "text/plain"
            break;
    
        default:
            contentType = "text/html"
            break;
    }

    filePath = contentType == "text/html" && request.url == "/"
        ? path.join(__dirname, "views", "index.html")
        : contentType == "text/html" && request.url.slice(-1) == "/"
            ? path.join(__dirname, "views", request.url, "index.html")
            : contentType == "text/html"
                ? path.join(__dirname, "views", request.url)
                :  path.join(__dirname, request.url)
    
    if (!extension && request.url.slice(-1) != "/")
        filePath += ".html"
    
    const fileExists = fs.existsSync(filePath)

    if (fileExists) {

    }
    else {
        switch (path.parse(filePath).base) {
            case "old-page.html":
                response.writeHead(301, {
                    "location": "/new-page.html"
                })
                response.end()
                break;
            case "www-page.html":
                response.writeHead(301, {
                    "location": "/"
                })
                response.end()
                break;
            default:
                response.writeHead(301, {
                    "location": "/404.html"
                })
                response.end()
                break;
        }
        console.log(path.parse(filePath))
    }

    // switch (request.url) {
    //     case "/":
    //     case "/index.html":
    //         response.statusCode = 200
    //         response.setHeader("Content-Type", "text/html")
    //         filePath = path.join(__dirname, "views", "index.html")
    //         fs.readFile(filePath, encoding="utf-8", (err, data) => {
    //             if (err) throw err
    //             response.end(data)
    //         })
    //         break;
    
    //     default:
    //         response.statusCode = 404
    //         response.setHeader("Content-Type", "text/html")
    //         filePath = path.join(__dirname, "views", "404.html")
    //         fs.readFile(filePath, encoding="utf-8", (err, data) => {
    //             if (err) throw err
    //             response.end(data)
    //         })
    //         break;
    // }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})


