const whitelist = require('../config/cors').whitelist

const credentials = (request, response, next) => {
    const origin = request.headers.origin

    if (whitelist.includes(origin)) {
        response.headers('Access-Control-Allow-Credentials', true)
    }

    next()
}

module.exports = credentials