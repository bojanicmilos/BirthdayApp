const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const presentSchema = new Schema({
    birthdayEventId: {
        type: Schema.Types.ObjectId,
        ref: 'BirthdayEvent',
        required: true
    },
    presentBought: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    }
})

module.exports = mongoose.model('Present', presentSchema)