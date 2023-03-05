const verify = (...allowedPerms) => {
    return (request, response, next) => {
        if (!request?.perms) return response.sendStatus(403)

        const permsArray = [...allowedPerms]
        console.log(permsArray)
        console.log(request.perms)
        const result = request.perms.map((perm) => permsArray.includes(perm)).find((found) => found == true)

        if (!result) return response.sendStatus(403)
        next()
    }
}

module.exports = { verify }