const http = require('http')
const express = require('express')
const {WebSocketServer, WebSocket} = require("ws");
const db = require("../db/db");
const {formatMessages} = require("../helpers/messageHelper");

const app = express()

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/cable' });

const Message = db.message

wss.on('connection', (ws) => {
    console.log('User is connected');

    ws.onmessage = async (e) => {
        const data = JSON.parse(e.data);

        if (data.command === 'subscribe') {
            const updatedMessages = await Message.findAll({
                order: [
                    ['createdAt', 'ASC']
                ]
            })
            const formattedMessages = await formatMessages(updatedMessages)
            sendMessage('connection', formattedMessages)
        }
    }

    ws.on('close', () => {
        console.log('User is disconnected');
    });
});

function sendMessage(type, data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                message: { type, data }
            }))
        }
    })
}

module.exports = {
    app, server, wss, sendMessage
}
