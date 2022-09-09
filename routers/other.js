const express = require('express');
const router = express.Router();

const Submition = require('../models/submition');

// GET => /thongtin
router.get('/thongtin', (req, res) => {
    res.render('profile', {
       title: 'Thông tin cá nhân',
       path: '/thongtin',
       staff: req.staff
    });
 });
 
 // POST => /thongtin
 router.post('/thongtin', (req, res) => {
    req.staff.imageUrl = req.body.image;
    req.staff
       .save()
       .then(result => {
          res.redirect('/thongtin');
       })
 });
 
 // GET => /giolam
 router.get('/giolam', (req, res) => {
    Submition
       .find({ staff: req.staff })
       .then(submitsions => {
          const hourMap = new Map();
          submitsions.forEach(s => {
             // cacl over time and inover time
             let total = 0;
             s.items.forEach(i => {
                if (i.endTime) {
                   total += i.endTime.getTime() - i.startTime.getTime();
                }
             });
             total = Math.round(total/(1000*60*60)) + s.breakTime;
             // key by month
             const key = `${s.date.getMonth()}/${s.date.getFullYear()}`;
             if (!hourMap.get(key)) {
                hourMap.set(key, total);
             } else {
                hourMap.set(key, hourMap.get(key) + total);
             }
          });
          res.render('submitsions', {
             title: 'Giờ làm',
             path: '/giolam',
             submitsions: submitsions,
             hourMap: hourMap,
             staff: req.staff
          });
       })
 });

 module.exports = router;