const db = require('../db/db')
const User = db.user
const Message = db.message
const createError = require('http-errors')
const {sendMessage} = require("../socket/socket")
const {formatMessages} = require("../helpers/messageHelper")

const createMessage = async (req, res, next) => {
    try {
        const { user_id, content } = req.body;

        if (!user_id || !content) throw createError.UnprocessableEntity('Invalid user_id or content')

        const user = await User.findOne({where: {user_id: Number(user_id)}})
        if (!user) throw createError.NotFound(`User with the username ${user.username} not found`)

        const message = await Message.create({
            user_id: user_id,
            content: content
        })
        console.log(message)
        const result = {
            id: String(message.message_id),
            user_id: String(message.user_id),
            content: message.content,
            user_name: user.username,
            created_at: message.createdAt
        }

        sendMessage('create', result)
        await res.send(result)
    } catch (err)
    {
        console.log(err.message)
        next(err)
    }
}

const deleteMessage = async (req, res, next) => {
    try {
        const payload = req.payload;
        console.log(payload)
        const {user_id} = req.body;
        console.log(user_id)

        if (payload.user_id !== Number(user_id))
        {
            throw createError.BadRequest('Invalid id');
        }

        const message_id = req.params.id;

        const user = await User.findOne({where: {user_id: Number(user_id)}})
        if (!user) throw createError.NotFound(`User with the username ${user.username} not found`)

        const message = await Message.findOne({ where: { user_id: Number(user_id), message_id: Number(message_id) } })
        if (!message) throw createError.NotFound(`The user ${user.username} does not have a message with the id ${message_id}`)
        await message.destroy()

        const updatedMessages = await Message.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        })
        const formattedMessages = await formatMessages(updatedMessages)

        sendMessage('destroy', formattedMessages);
    }
    catch (err)
    {
        console.log(err.message)
        next(err)
    }
}

const updateMessage = async (req, res, next) => {
    try {
        const payload = req.payload;
        const {user_id, content} = req.body
        const message_id = req.params.id

        if (payload.user_id !== Number(user_id))
        {
            throw createError.BadRequest('Invalid id');
        }

        if (!user_id || !content) throw createError.UnprocessableEntity('Invalid user_id or content')

        const user = await User.findOne({where: {user_id: Number(user_id)}})
        if (!user) throw createError.NotFound(`User with the username ${user.username} not found`)

        const message = await Message.findOne({where: {user_id: Number(user_id), message_id: Number(message_id)}})
        if (!message) throw createError.NotFound(`The user ${user.username} does not have a message with the id ${message_id}`)

        if (message.content === content) throw createError.Conflict(`The contents of the messages are the same`)
        await message.update({ content: content });

        const updatedMessages = await Message.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        })

        const formattedMessages = await formatMessages(updatedMessages)
        await res.send({data: formattedMessages})
        sendMessage('update', formattedMessages);
    } catch (err)
    {
        console.log(err.message)
        next(err)
    }
}

module.exports = { createMessage, deleteMessage, updateMessage }