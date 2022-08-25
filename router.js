const express = require('express');

const Submition = require('./models/submition');
const SubmitionItem = require('./models/submitionItem');

const router = express.Router();

router.get('/', (req, res) => {
   res.render('home', { title: 'Trang chủ', staff: req.staff });
});

router.post('/diemdanh', (req, res) => {
   const now = new Date();
   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

   Submition.findOne({
      date: today,
      staff: req.staff
   })
      .then(submition => {
         if (submition) {
            return submition;
         }
         return Submition.create({
            date: today,
            breakTime: 5,
            staff: req.staff
         })
      })
      .then(submition => {
         return SubmitionItem.create({
         })
         console.log(req.body);
      })
});

module.exports = router;