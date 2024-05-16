const db = require('../db/db')
const User = db.user

const formatMessages = async (messages) => {
    const formattedMessages = await Promise.all(messages.map(async (message) => {
        const user = await User.findOne({ where: { user_id: message.user_id } })
        if (!user) return null
        return {
            id: String(message.message_id),
            user_id: String(message.user_id),
            content: message.content,
            user_name: user.username,
            created_at: String(message.createdAt)
        };
    }));
    return formattedMessages.filter((msg) => msg !== null);
};

module.exports = { formatMessages }