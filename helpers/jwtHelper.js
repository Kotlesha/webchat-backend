const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            user_id: userId
        }

        const secret = process.env.JWT_ACCESS_TOKEN_SECRET

        const options = {
            expiresIn: '5d'
        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(createError.InternalServerError())
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) return next(createError.Unauthorized(err.message))
        req.payload = payload
        next()
    })
    //req.user = payload
}

module.exports = { signAccessToken, verifyAccessToken }