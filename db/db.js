const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
)

const db = {}

db.sequelize = sequelize

db.user = require('../models/userModel')(sequelize, Sequelize.DataTypes)
db.message = require('../models/messageModel')(sequelize, Sequelize.DataTypes)

db.user.hasMany(db.message, {foreignKey: 'user_id'})
db.message.belongsTo(db.user, {
    foreignKey: 'user_id',
})

module.exports = db


