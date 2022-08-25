const express = require('express');

const Submition = require('./models/submition');

const router = express.Router();

router.get('/', (req, res) => {
   res.render('home', { title: 'Trang chủ', staff: req.staff });
});

router.post('/diemdanh', (req, res) => {
   const now = new Date();
   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
   Submition.create({
      date: today,
      breakTime: 5,
      staff: req.staff
   })
})

module.exports = router;