const jwt = require("jsonwebtoken")

const verify = (request, response, next) => {
    const authorization = request.headers.authorization|| request.headers.Authorization

    if (!authorization?.startsWith('Bearer ')) return response.sendStatus(401)
    
    token = authorization.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) return response.sendStatus(403)
        
        request.user = decoded.UserInfo.username
        request.perms = decoded.UserInfo.permissions
        next()
    })
}

module.exports = {verify}