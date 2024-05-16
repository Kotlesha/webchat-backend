const express = require('express')
const router = express.Router()

const { loginUser, registerUser } = require('../controllers/authController')
//const { verifyAccessToken } = require("../helpers/jwtHelper");

router.post('/login', loginUser)

router.post('/register', registerUser)

//router.delete('logout', verifyAccessToken, logoutUser)

module.exports = router