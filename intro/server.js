const os = require("os")
const path = require("path")
// const {add, sub, mul, div} = require("./math")
const math = require("./math")

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename)) // absolute file path
console.log(path.basename(__filename)) // server.js
console.log(path.extname(__filename)) // .js
console.log(path.parse(__filename)) // object of all file information

console.log(math.add(2, 2))