const express = require('express');
const router = express.Router();

// GET => /covid
router.get('/covid', (req, res) => {
    res.render('covid', {
       title: 'Khai báo covid',
       path: '/covid'
    });
 });
 
 // POST => /nhietdo
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
 
 // POST => /vacine
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
 
 
 // POST => /trangthai
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