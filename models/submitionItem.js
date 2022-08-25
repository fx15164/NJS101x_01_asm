const mongoose = require('mongoose');
const { Schema } = mongoose;

const submitionItemSchema = new Schema({
    startWorking: Date,
    endWorking:   Date,
    workPlace: String,
    submition: { type: mongoose.Types.ObjectId, ref: 'Submition' }
})

module.exports = mongoose.model('SubmitionItem', submitionItemSchema);