const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const permissions = require('../config/permissions')

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

    const usernameExists = await User.findOne({username: username}).exec()

    if (usernameExists) {
        return res.sendStatus(409)
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await User.create({
            "username": username,
            "password": hashedPassword,
            "fullName": fullname,
            "email": email,
            "gender": gender
        })

        console.log(result);

        res.status(201).json(result)
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
        payload={
            'UserInfo': {
                "username": user.username,
                "permissions": Object.values(user.permissions)
            }
        },
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
    
    res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: 'None'})
    res.json({...user, accessToken})
}

function refreshToken(req, res) {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(401) // unauthorized

    const refreshToken = cookies.jwt

    const user = users.data.find((user) => user.refreshToken == refreshToken)

    if (!user) return res.sendStatus(403) // forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || decoded.username != user.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        "username": user.username,
                        "permissions": Object.values(user.permissions)
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    'expiresIn': '30s'
                }
            )
            res.json({'accessToken': accessToken})
        }
    )
}

const logout = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204) // no content

    const refreshToken = cookies.jwt
    const user = users.data.find((user) => user.refreshToken == refreshToken)

    if (!user){
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        })
        
        return res.sendStatus(204)
    }

    const otherUsers = users.data.filter((other) => other.refreshToken != user.refreshToken)
    const user_payload = {...user, refreshToken: ''}
    users.setUsers([...otherUsers, user_payload])

    await fsPromises.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(users.data)
    )

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    })

    return res.sendStatus(204) // no content
}

module.exports = { create, login, refreshToken, logout }