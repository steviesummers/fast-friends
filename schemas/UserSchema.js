const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    thoughts: {
        type: [String]
    },
    friends: {
        type: [String]
    }
})

const User = mongoose.model("User", UserSchema)
module.exports = User;