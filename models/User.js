const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    }]
})

module.exports = mongoose.model('User', userSchema)