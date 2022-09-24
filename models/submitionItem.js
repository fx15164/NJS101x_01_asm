const { Schema, default: mongoose } = require('mongoose');

const submitionItemSchema = new Schema({ 
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    workplace: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('SubmitionItem', submitionItemSchema);