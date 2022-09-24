const { Schema, default: mongoose } = require('mongoose');

const Submition = require('./submition');

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
    },
    submition: {
        type: mongoose.Types.ObjectId,
        ref: 'Submition',
        required: true
    }
})

submitionItemSchema.methods.isLast = function() {
    const items = this.submition.items;
    return this._id.toString() === items[items.length - 1].toString();
}

module.exports = mongoose.model('SubmitionItem', submitionItemSchema);