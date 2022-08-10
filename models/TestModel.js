const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const testModelSchema = new Schema({
    title: String,
    testNumber: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('TestModel', testModelSchema)
