const joi = require('joi')

const loginSchema = joi.object({
    username: joi.string().min(2).required(),
    password: joi.string().min(8).required()
})

const registerSchema = joi.object({
    username: joi.string().min(2).required(),
    password: joi.string().min(8).required(),
    confirmation_password: joi.ref('password')
})

module.exports = { registerSchema, loginSchema }