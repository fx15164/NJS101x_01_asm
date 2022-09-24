const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Staff = require('../models/staff');

router.get('/login', (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('login', {
        title: 'Đăng nhập',
        path: '/login',
        error: message,
        errors: []
     });
});

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').isLength({ min: 5 }).withMessage("Mật khẩu phải nhiều hơn 5 kí tự")
    ],
    (req, res) => {
        // check error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Đăng nhập',
                path: '/login',
                error: null,
                errors: errors.array()
             });
        }
        // find
        const email = req.body.email;
        const password = req.body.password;
        Staff.findOne({ email })
            .then(staff => {
                if (!staff) {
                    req.flash('error', 'Email không tồn tại');
                    return res.redirect('/login');
                }
                if (staff.password !== password) {
                    req.flash('error', 'Mật khẩu không chính xác');
                    return res.redirect('/login');
                } else {
                    req.session.staff = staff;
                    req.session.isLoggedIn = true;
                    const historyUrl = req.session.historyUrl || '/';
                    req.session.historyUrl = '/';
                    res.redirect(historyUrl);
                }
            })
    }
)

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
      });
})

module.exports = router;