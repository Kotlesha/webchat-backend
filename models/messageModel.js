module.exports = (sequelize, DataTypes) => {
    const messageModel = sequelize.define('messages', {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        message_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return messageModel
}