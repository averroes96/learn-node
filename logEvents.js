const {format} = require("date-fns")
const {v4: uuid} = require("uuid")
const fs = require("fs")
const fsPromises = require("fs/promises")
const path = require("path")

const logEvent = async (message, fileName) => {
    const now = format(new Date(), "yyyy/MM/dd:HH:mm:ss")
    const log = `[LOG ${uuid()} | ${now}]:\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "logs"))
        }
        await fsPromises.appendFile(path.join(__dirname, "logs", fileName), log)
    } catch (err) {
        console.error(err);
    }
}

module.exports = logEvent