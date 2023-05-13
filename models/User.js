const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    fullName : {
        type: String,
        required: true
    },
    email: String,
    gender: Number,
    permissions : {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    refreshToken: String

})

module.exports = mongoose.model('User', userSchema)