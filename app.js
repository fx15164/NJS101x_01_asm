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
    Staff.findOne()
        .then(staff => {
            req.staff = staff;
            next();
        })
})

// router
app.use(router);

// start
mongoose.connect('mongodb://localhost:27017/asm')
    .then(() => {
        return Staff.findOne()
            .then(staff => {
                if (!staff) {
                    return new Staff({
                        name: "Joe Dynim",
                        doB: Date.now(),
                        salaryScale: 1.2,
                        startDate: Date.now(),
                        department: 'x',
                        annualLeave: 4,
                    }).save();
                }
                return staff;
            })
            .then(result => {
                app.listen(3000);
            })
    })
    .catch(err => {
        console.log(err);
    })