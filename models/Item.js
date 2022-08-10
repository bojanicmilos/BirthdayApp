const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    urlLink: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Item', itemSchema)

