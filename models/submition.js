const mongoose = require('mongoose');
const { Schema } = mongoose;

const submitionSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    breakTime: { 
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    staff: { 
        type: mongoose.Types.ObjectId, 
        required: true,
        ref: 'Staff' 
    },
    items: [{ 
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
    }]
})

submitionSchema.methods.startWorking = function (workplace) {
    if (this.getWorkingItem()) {
        return;
    }
    const updatedItems = [
        ...this.items,
        {
            startTime: Date.now(),
            workplace: workplace
        }
    ]
    this.items = updatedItems;
    return this.save();
}

submitionSchema.methods.endWorking = function () {
    const idx = this.items.findIndex(i => !i.endTime);
    if (idx < 0) {
        return;
    }
    const updatedItems = [...this.items];
    updatedItems[idx].endTime = Date.now();
    //
    this.items = updatedItems
    return this.save();
}

submitionSchema.methods.getWorkingItem = function () {
    const idx = this.items.findIndex(i => !i.endTime);
    if (idx >= 0) {
        return this.items[idx];
    }
    return null;
}

module.exports = mongoose.model('Submition', submitionSchema);