const express = require('express');
const router = express.Router();
const fs = require('fs');

const Submition = require('../models/submition');
const SubmitionItem = require('../models/submitionItem');
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
            if (oldUrl) {
               fs.unlink(oldUrl, err => {
                  if (err) {
                     console.log(err);
                  }
               });
            }
            res.redirect('/thongtin');
         })
   });

// GET => /giolam
router.get('/giolam', isAuth, (req, res) => {
   const page = +req.query.page || 1;
   const itemPerPage = +req.query.item || 20;
   const hourMap = new Map();
   let totalItem;

   Submition
      .find({ staff: req.staff })
      .populate('items')
      .then(submitsions => {
         submitsions.forEach(s => {

            // cacl all month hour
            let total = 0;
            s.items.forEach(i => {
               if (i.endTime) {
                  total += i.endTime.getTime() - i.startTime.getTime();
               }
            });
            total = Math.round(total / (1000 * 60 * 60)) + s.breakTime;

            // key by month
            const key = `${s.date.getMonth() + 1}/${s.date.getFullYear()}`;
            if (!hourMap.get(key)) {
               hourMap.set(key, total);
            } else {
               hourMap.set(key, hourMap.get(key) + total);
            }
         });

         // find and pagnination
         return SubmitionItem
            .find({ submition: { $in: submitsions }})
            .countDocuments()
            .then(total => {
               totalItem = total;
               return SubmitionItem
                  .find({ submition: { $in: submitsions }})
                  .skip((page-1)*itemPerPage)
                  .limit(itemPerPage)
                  .populate('submition')
            })
      })
      .then(async function (items) {

         // cacl total hour if is last
         for (let i = 0; i < items.length; i++) {
            if (items[i].endTime && items[i].isLast()) {
               await Submition.findOne({ _id: items[i].submition._id })
                  .populate('items')
                  .then(submition => {
                     let totalTime = 0;
                     submition.items.forEach(i => {
                        totalTime += i.endTime.getTime() - i.startTime.getTime();
                     });
                     items[i].totalHour = Math.round(totalTime / (1000 * 60 * 60)) + submition.breakTime;
                  })
            }
         }
         return items;
      })
      .then(items => {
         res.render('submitsions', {
            title: 'Giờ làm',
            path: '/giolam',
            items: items,
            totalItem: totalItem,
            currentPage: page,
            itemPerPage: itemPerPage,
            hourMap: hourMap,
            staff: req.staff
         });
      });
});

module.exports = router;