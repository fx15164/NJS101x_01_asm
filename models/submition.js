const mongoose = require('mongoose');
const { Schema } = mongoose;

const submitionSchema = new Schema({
    date: Date,
    breakTime: Number,
    staff: { type: mongoose.Types.ObjectId, ref: 'Staff' }
})

module.exports = mongoose.model('Submition', submitionSchema);