const mongoose = require('mongoose');
const { Schema } = mongoose;

const Submition = require('./submition');

const staffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
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
    imageUrl: String,

    // role
    isManager: {
        type: Boolean,
        required: true
    },
    manager: {
        type: mongoose.Types.ObjectId,
        ref: 'Staff'  
    },
    staffs: [{
        type: mongoose.Types.ObjectId,
        ref: 'Staff'
    }],

    // covid
    temperatures: [{    
        temperature: {
            type: Number
        },
        date: {
            type: Date
        },
    }],
    vacine: {
        first: {
            type: String
        },
        firstDate: {
            type: Date
        },
        second: {
            type: String
        },
        secondDate: {
            type: Date
        }
    },
    isCovid: {
        type: Boolean
    },

    // salary
    confirmedMonth: []
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
        .then(submition => {
            return submition.populate('items');
        })
}

module.exports = mongoose.model('Staff', staffSchema);