const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const birthdayEventSchema = new Schema({
    birthdayPerson: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'UserPayment',
        required: false
    }],
    eventCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalMoneyAmount: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    eventDate: {
        type: Date,
        required: true
    },
    isBoughtPresent: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('BirthdayEvent', birthdayEventSchema)