const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

const isAuth = require('../middlewares/is-auth');
const isManager = require('../middlewares/is-manager');


// GET => /covid
router.get('/covid', isAuth, (req, res) => {
    res.render('covid', {
       title: 'Khai báo covid',
       path: '/covid',
       staff: req.staff
    });
 });

 // GET => /covid.pdf
 router.get('/covid.pdf', isManager, (req, res) => {
   const doc = new PDFDocument();
   doc.pipe(res);
   doc.fontSize(20)
      .text('Thông tin Covid nhân viên', { align: 'center' })
   req.staff.staffs.forEach(s => {
      doc.fontSize(15).text(s.name);
      doc.fontSize(12).text(`    Mui 1: ${s.vacine.first || 'Chua khai bao'}`);
      doc.fontSize(12).text(`    Mui 2: ${s.vacine.first || 'Chua khai bao'}`);
      doc.text('------------------------------------------------------------');
   });
   doc.end();
 })
 
 // POST => /nhietdo
 router.post('/nhietdo', isAuth, (req, res) => {
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
 router.post('/vacine', isAuth, (req, res) => {
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
 router.post('/trangthai', isAuth, (req, res) => {
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