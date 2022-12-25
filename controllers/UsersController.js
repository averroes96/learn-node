const fsPromises = require("fs/promises")
const path = require("path")
const bcrypt = require("bcrypt")

const users = {
    data: require("../models/users.json"),
    setUsers: function(data) {
        this.data = data
    } 
}

const create = async (req, res) => {
    const { username, password, fullname, email, gender } = req.body

    if (!username || !password || !fullname) {
        return res.status(400).json({"detail": "username, password and fullname must be set"})
    }

    const usernameExists = users.data.find((user) => user.username == username)

    console.log(usernameExists)

    if (usernameExists) {
        return res.sendStatus(409)
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            "username": username,
            "password": hashedPassword,
            "fullName": fullname,
            "email": email,
            "gender": gender,
        }

        users.setUsers([...users.data, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(users.data)
        )
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({"Unexpected error": err.message})
    }
}

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({"detail": "username, password are required."})
    }

    const user = users.data.find((user) => user.username == username)

    if (!user) return res.sendStatus(401)

    aMatch = await bcrypt.compare(password, user.password)

    if (!aMatch) return res.sendStatus(401)

    res.json(user)
}

module.exports = { create, login }