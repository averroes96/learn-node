const fsPromises = require("fs/promises")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv/config")

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

    const accessToken = jwt.sign(
        payload={"username": user.username},
        secretOrPrivateKey=process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "30s"
        }
    )

    const refreshToken = jwt.sign(
        payload={"username": user.username},
        secretOrPrivateKey=process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )

    const otherUsers = users.data.filter((other) => other.username != user.username)
    const userWithRefreshToken = {...user, refreshToken}

    users.setUsers([...otherUsers, userWithRefreshToken])
    await fsPromises.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(users.data)
    )
    
    res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.json({...user, accessToken})
}

module.exports = { create, login }