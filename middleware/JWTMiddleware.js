const jwt = require("jsonwebtoken")
const dotenv = require("dotenv/config")

const verify = (request, response, next) => {
    const authorization = request.headers.authorization|| request.headers.Authorization

    if (!authorization?.startsWith('Bearer ')) return response.sendStatus(401)
    
    token = authorization.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        console.log(error)
        if (error) return response.sendStatus(403)
        
        request.user = decoded.UserInfo.username
        request.roles = decoded.UserInfo.roles
        next()
    })
}

module.exports = {verify}