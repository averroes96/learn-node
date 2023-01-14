const jwt = require("jsonwebtoken")
const dotenv = require("dotenv/config")

const verify = (request, response, next) => {
    const authorization = request.headers["authorization"]

    if (!authorization) return response.sendStatus(401)

    console.log(authorization)
    token = authorization.split(" ")[1]

    console.log(token)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        console.log(error)
        if (error) return response.sendStatus(403)
        
        request.user = decoded.username
        next()
    })
}

module.exports = {verify}