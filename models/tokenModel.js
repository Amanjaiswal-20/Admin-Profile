const mongoose = require('mongoose')
const validator = require('validator');

const { Schema } = mongoose

const tokenSchema = new Schema({

    token: {
        type: String,
        required: [true,]
    }
})

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;