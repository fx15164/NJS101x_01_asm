const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Staff = require('./models/staff');

const router = require('./router');
const staff = require('./models/staff');

const app = express();

// vew engine
app.set('view engine', 'ejs');

// request body parser
app.use(bodyParser.urlencoded({ extended: false }));

// set request staff
app.use((req, res, next) => {
    Staff.findOne({ _id: '6306484aa80b9cb33af11c20' }, function (err, staff) {
        if (staff) {
            req.staff = staff;
            next();
        }
    })
})

// router
app.use(router);

// start
mongoose.connect('mongodb+srv://admin:admin@asm1.yjqy9ym.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        Staff.findOne({ _id: '6306484aa80b9cb33af11c20' }, function (err, staff) {
            if (!staff) {
                return new Staff({
                    name: "Joe Dynim",
                    doB: Date.now(),
                    salaryScale: 1.2,
                    startDate: Date.now(),
                    annualLeave: 4,
                }).save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })