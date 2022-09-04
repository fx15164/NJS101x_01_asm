const express = require('express');
const submition = require('./models/submition');
const router = express.Router();

const Submition = require('./models/submition');

router.get('/', (req, res) => {
   let tab = req.query.tab ? parseInt(req.query.tab) : 1;
   req.staff
      .getTodaySubmition()
      .then(submition => {
         res.render('home', {
            title: 'Trang chủ',
            staff: req.staff,
            submition,
            tab
         });
      })
});

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

router.post('/nghiphep', (req, res) => {
   const date = new Date(req.body.date)
   const breakTime = parseInt(req.body.breakTime);
   const reason = req.body.reason;
   Submition.find({
      date: date,
      staff: req.staff
   })
   .then(submition => {
      console.log(submition);
   })
})

module.exports = router;