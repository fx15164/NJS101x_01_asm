const express = require('express');
const router = express.Router();
const fs = require('fs');

const Submition = require('../models/submition');
const isAuth = require('../middlewares/is-auth');

const upload = require('../util/upload');

// GET => /thongtin
router.get('/thongtin', isAuth, (req, res) => {
    res.render('profile', {
       title: 'Thông tin cá nhân',
       path: '/thongtin',
       staff: req.staff
    });
 });
 
 // POST => /thongtin
router.post(
   '/thongtin',
   isAuth,
   upload.single('avatar'),
   (req, res) => {
      if (!req.file) {
         return res.redirect('/thongtin');
      }
      const oldUrl = req.staff.imageUrl;
      req.staff.imageUrl = req.file.path;
      req.staff
         .save()
         .then(result => {
            // delete old avatar
            return fs.unlink(oldUrl, err => {
               if (err) {
                  console.log(err);
               }
               res.redirect('/thongtin');
            });
         })
   });
 
 // GET => /giolam
 router.get('/giolam', isAuth, (req, res) => {
    Submition
       .find({ staff: req.staff })
       .populate('items')
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
             const key = `${s.date.getMonth() + 1}/${s.date.getFullYear()}`;
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