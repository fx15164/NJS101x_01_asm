const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const Staff = require('./models/staff');

const authRouter = require('./routers/auth');
const homeRouter = require('./routers/home');
const covidRouter = require('./routers/covid');
const otherRouter = require('./routers/other');

const app = express();

// vew engine
app.set('view engine', 'ejs');

// session && flash
app.use(session({
    secret: '...',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// request body parser
app.use(bodyParser.urlencoded({ extended: false }));

// setup request
app.use((req, res, next) => {
    // set isLoggedIn to view
    res.locals.isLoggedIn = req.session.isLoggedIn;
    // // set request staff
    if (!req.session.staff) {
        return next();
    }
    Staff.findOne({ _id: req.session.staff._id })
        .then(staff => {
            req.staff = staff;
            next();
        })
})

app.use('/images', express.static('images'));


// router
app.use(authRouter);
app.use(homeRouter);
app.use(covidRouter);
app.use(otherRouter);

// handle error
app.use((err, req, res, next) => {
    console.log(err);
})

// start
mongoose.connect('mongodb://localhost:27017/asm')
    .then(() => {
        return Staff.findOne()
            .then(staff => {
                if (!staff) {
                    return new Staff({
                        name: "Joe Dynim",
                        email: 'joedynim@gmail.com',
                        password: 'joedynim',
                        doB: Date.now(),
                        salaryScale: 1.2,
                        startDate: Date.now(),
                        department: 'x',
                        annualLeave: 4
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