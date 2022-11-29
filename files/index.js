const fs = require("fs")
const fsPromise = require("fs").promises
const path = require("path")

// fs.readFile(path.join(__dirname, "starter.txt"), encoding="utf-8", (err, data) => {
//     if (err) throw err
//     console.log(data)
// })

// fs.readFile("./files/file_that_does_not_exist.txt", encoding="utf-8", (err, data) => {
//     if (err) throw err
//     console.log(data)
// })

// CALLBACK HELL !!!

// fs.writeFile(path.join(__dirname, "reply.txt"), "Hi ada, nice to meet you.", (err) => {
//     if (err) throw err
//     console.log("Write complete")
//     fs.appendFile(path.join(__dirname, "reply.txt"), "\n\nYes it is.", err => {
//         if (err) throw err
//         console.log("Append complete")
//         fs.rename(path.join(__dirname, "reply.txt"), path.join(__dirname, "reply_modified.txt"), err => {
//             if (err) throw err
//             console.log("Renaming complete")
//         })
//     })
// })

const fsOps = async () => {
    
    try {
        const data = await fsPromise.readFile(path.join(__dirname, "starter.txt"), encoding="utf-8")
        console.log(data)

        await fsPromise.unlink(path.join(__dirname, 'starter.txt'))

        await fsPromise.writeFile(path.join(__dirname, "promiseWrite.txt"), data)
        await fsPromise.appendFile(path.join(__dirname, "promiseWrite.txt"), "\n\nNice to meet you ada!")
        await fsPromise.rename(path.join(__dirname, "promiseWrite.txt"), path.join(__dirname, "promiseComplete.txt"))

        const newData = await fsPromise.readFile(path.join(__dirname, "promiseComplete.txt"), encoding="utf-8")
        console.log(newData)
    } catch (err) {
        console.error(err)
    }
}

fsOps()

process.on("uncaughtException", err => {
    console.error(`uncaughtException: ${err}`)
    process.exit(1)
})