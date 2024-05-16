const db = require('../db/db')
const User = db.user
const { loginSchema, registerSchema} = require('../helpers/validateSchemaHelper')
const { signAccessToken } = require('../helpers/jwtHelper')

const createError = require('http-errors')
const bcrypt = require('bcrypt')

const loginUser = async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body.user)
        const user = await User.findOne({where: {username: result.username}})
        if (!user) throw createError.NotFound(`User with the username ${result.username} not found`)

        const isMatchPasswords = bcrypt.compare(result.password, user.password)
        if (!isMatchPasswords) throw createError.Unauthorized('Username or password is incorrect')

        const accessToken = await signAccessToken(user.user_id)
        res.send(
            {
                user: {
                    id: String(user.user_id),
                    name: user.username,
                    password: user.password
                },
                token: accessToken
            })
    }
    catch (error){
        if (error.isJoi === true) next(createError.BadRequest('Invalid username or password'))
        next(error)
    }
}

const registerUser = async (req, res, next) => {
    try {
        const result = await registerSchema.validateAsync(req.body.user)
        const isExist = await User.findOne({where: {username: result.username}})

        if (isExist)
            throw createError.Conflict(`User with the username ${result.username} already exists`)

        const hashedPassword = await bcrypt.hash(result.password, 10)
        const user = new User({ username: result.username, password: hashedPassword })
        const savedUser = await user.save()

        res.send({
            user: {
                name: savedUser.username,
                password: savedUser.password
            }
        })
    }
    catch (error)
    {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

module.exports = {
    loginUser,
    registerUser
}