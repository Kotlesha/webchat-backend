const express = require('express')
const router = express.Router()

const { createMessage, deleteMessage, updateMessage } = require("../controllers/messageController")
const { verifyAccessToken } = require("../helpers/jwtHelper");

router.post('/', verifyAccessToken, createMessage)

router.delete('/:id', verifyAccessToken, deleteMessage)

router.patch('/:id', verifyAccessToken, updateMessage)

module.exports = router