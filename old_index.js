const logEvent = require("./logEvents")
const EventEmitter = require('events')


class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()

myEmitter.on("log", (message) => logEvent(message))

setInterval(() => {
    myEmitter.emit("log", "This is a log event example.")
}, 2000);
