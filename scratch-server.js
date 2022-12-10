const logEvent = require("./logEvents")
const EventEmitter = require('events')
const http = require("http")
const path = require("path")
const fs = require("fs")
const fsPromises = require("fs/promises")


class Emitter extends EventEmitter {}

const myEmitter = new Emitter()

myEmitter.on("log", (message, fileName) => logEvent(message, fileName))

const PORT = process.env.PORT || 3500

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes("image") ? "utf-8" : ""
        )
        const data = contentType == "application/json" ? JSON.parse(rawData) : rawData
        response.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "Content-Type": contentType
        })
        response.end(contentType == "application/json" ? JSON.stringify(data) : data)
    
    } catch (error) {
        console.error(error);
        myEmitter.emit("log", `${error.name}: ${error.message}`, "errorLogs.txt")

        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((request, response) => {
    console.log(request.method, request.url)
    myEmitter.emit("log", `${request.method}: ${request.url}`, "requestLogs.txt")

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
        serveFile(filePath, contentType, response)
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
                serveFile(path.join(__dirname, "views", "404.html"), contentType, response)
                break;
        }
        console.log(path.parse(filePath))
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})