const mongoose = require('mongoose');
const { Schema } = mongoose;

const staffSchema = new Schema({
    name: String,
    doB: Date,
    salaryScale: Number,
    startDate: Date,
    department: String,
    annualLeave: Number,
    Image: String
})

module.exports = mongoose.model('Staff', staffSchema);