const express = require('express');
const router = express.Router();

const Submition = require('../models/submition');

// GET => /
router.get('/', (req, res) => {
   let tab = req.query.tab ? parseInt(req.query.tab) : 1;
   req.staff
      .getTodaySubmition()
      .then(submition => {
         res.render('home', {
            title: 'Trang chủ',
            path: '/',
            staff: req.staff,
            submition,
            tab
         });
      })
});

// POST => /diemdanh
router.post('/diemdanh', (req, res) => {
   req.staff
      .getTodaySubmition()
      .then(submition => {
         return submition.startWorking(req.body.workplace);
      })
      .then(result => {
         res.redirect('/?tab=1');
      })
});

// POST => /kethuc
router.post('/ketthuc', (req, res) => {
   req.staff
      .getTodaySubmition()
      .then(submition => {
         return submition.endWorking();
      })
      .then(result => {
         res.redirect('/?tab=2');
      })
})

// POST => /nghiphep
router.post('/nghiphep', (req, res) => {
   const breakTime = parseInt(req.body.breaktime);
   const reason = req.body.reason;

   const _date = new Date(req.body.date)
   const date = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());

   Submition.findOne({
      date: date,
      staff: req.staff
   })
      .then(submition => {
         if (submition) {
            return submition;
         }
         return Submition.create({
            date: date,
            breakTime: 0,
            staff: req.staff
         })
      })
      .then(submition => {
         const { annualLeave } = req.staff;
         if (breakTime > 0 && breakTime <= 8 && breakTime <= annualLeave*8) {
            submition.breakTime = breakTime;
            submition.reason = reason;
            req.staff.annualLeave = (annualLeave*8 - breakTime)/8;
         }
         return submition.save();
      })
      .then(result => {
         return req.staff.save();
      })
      .then(result => {
         res.redirect('/?tab=3');
      })
});

module.exports = router;