const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userPaymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    birthdayEventId: {
        type: Schema.Types.ObjectId,
        ref: 'BirthdayEvent',
        required: true
    }
})

module.exports = mongoose.model('UserPayment', userPaymentSchema)