const mongoose = require('mongoose');
const { Schema } = mongoose;

const Submition = require('./submition');

const staffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    doB: {
        type: Date,
        required: true
    },
    salaryScale: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    annualLeave: {
        type: Number,
        required: true
    },
    imageUrl: String
})

staffSchema.methods.getTodaySubmition = function () {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return Submition.findOne({
        date: today,
        staff: this
    })
        .then(submition => {
            if (submition) {
                return submition;
            }
            return Submition.create({
                date: today,
                breakTime: 0,
                staff: this
            })
        })
}

module.exports = mongoose.model('Staff', staffSchema);