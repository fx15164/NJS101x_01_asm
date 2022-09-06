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
            path: '/',
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
})

router.get('/thongtin', (req, res) => {
   res.render('profile', {
      title: 'Thông tin cá nhân',
      path: '/thongtin',
      staff: req.staff
   });
});

router.post('/thongtin', (req, res) => {
   req.staff.imageUrl = req.body.image;
   req.staff
      .save()
      .then(result => {
         res.redirect('/thongtin');
      })
});

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

router.get('/covid', (req, res) => {
   res.render('covid', {
      title: 'Khai báo covid',
      path: '/covid'
   });
});

router.post('/nhietdo', (req, res) => {
   const temperature = parseInt(req.body.temperature);
   if (temperature > 0) {
      req.staff.temperatures.push({
         temperature,
         date: new Date()
      });
      req.staff.save()
         .then(result => {
            res.redirect('/covid');
         })
   }
});

router.post('/vacine', (req, res) => {
   const first = req.body.first;
   const second = req.body.second;
   const firstDate = new Date(req.body.firstdate);
   const secondDate = new Date(req.body.seconddate);
   req.staff.vacine = {
      first,
      second,
      firstDate,
      secondDate
   };
   req.staff.save()
      .then(result => {
         res.redirect('/covid');
      });
});

router.post('/trangthai', (req, res) => {
   const status = req.body.status;
   if (status == 1) {
      req.staff.isCovid = true;
   } else {
      req.staff.isCovid = false;
   }
   req.staff.save()
   .then(result => {
      res.redirect('/covid');
   });
});

module.exports = router;