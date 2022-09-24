const mongoose = require('mongoose');
const { Schema } = mongoose;

const Item = require('./submitionItem');

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
        type: mongoose.Types.ObjectId,
        ref: 'SubmitionItem'
    }]
})

submitionSchema.methods.startWorking = function (workplace) {
    if (this.getWorkingItem()) {
        return;
    }
    const item = new Item({
        startTime: Date.now(),
        workplace: workplace,
        endTime: null,
        submition: this
    })

    return item.save()
        .then(item => {
            const updatedItems = [
                ...this.items,
                item
            ]
            this.items = updatedItems;
            return this.save();
        })
}

submitionSchema.methods.endWorking = function () {
    const idx = this.items.findIndex(i => !i.endTime);
    if (idx < 0) {
        return;
    }
    const item = this.items[idx];
    item.endTime = Date.now();
    //
    return item.save();
}

submitionSchema.methods.getWorkingItem = function () {
    const idx = this.items.findIndex(i => !i.endTime);
    if (idx >= 0) {
        return this.items[idx];
    }
    return null;
}

module.exports = mongoose.model('Submition', submitionSchema);