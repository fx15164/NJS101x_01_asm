const express = require('express');
const router = express.Router();

const Submition = require('../models/submition');
const SubmitionItem = require('../models/submitionItem');
const isManager = require('../middlewares/is-manager');
const Staff = require('../models/staff');

// GET => /xacnhan
router.get('/xacnhan', isManager, (req, res) => {
    const staffId = req.query.id;
    let selectedMonth = req.query.month;
    let selectedStaff;

    // validate staffId
    if (!staffId) {
        return res.render('confirm', {
            title: 'Xác nhận',
            path: '/xacnhan',
            itemsMap: null
        });
    }
    if (!(req.staff.staffs.find(s => s._id.toString() === staffId))) {
        return res.redirect('/xacnhan');
    }

    const itemsMap = new Map();

    Staff.findById(staffId)
        .then(staff => {
            selectedStaff = staff
            return Submition
                .find({ staff: staffId })
        })
        .then(submitsions => {
            return SubmitionItem
                .find({ submition: { $in: submitsions}})
                .populate('submition')
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
            items.forEach(i => {
                // key by month
                const key = `${i.submition.date.getMonth() + 1}/${i.submition.date.getFullYear()}`;
                if (!itemsMap.get(key)) {
                    itemsMap.set(key, [i]);
                } else {
                    itemsMap.set(key, [...itemsMap.get(key), i]);
                }
            });

            selectedMonth = selectedMonth || itemsMap.keys().next().value;
            res.render('confirm', {
                title: 'Xác nhận',
                path: '/xacnhan',
                itemsMap,
                selectedMonth,
                selectedStaff
            });
        });
});

// POST => /xacnhanthang
router.post('/xacnhanthang', (req, res) => {
    const staffId = req.body.staffId;
    const month = req.body.month;
    const historyUrl = req.body.url || '/xacnhan';

    Staff.findById(staffId)
        .then(staff => {
            if (staff) {
                // check if is in managed staffs
                if (req.staff.staffs.find(s => s._id.toString() === staff._id.toString())) {
                    staff.confirmedMonth.push(month);
                    return staff.save();
                }
            }
        })
        .then(result => {
            res.redirect(historyUrl);
        })
});

// POST => /xoagiolam/...
router.post('/xoagiolam/:itemId', isManager,(req, res) => {
    const itemId = req.params.itemId;
    const submitionId = req.body.submitionId;
    const historyUrl = req.body.url || '/xacnhan';

    Submition.findOne({ _id: submitionId })
        .then(submition => {
            if (submition) {
                // check if have permituons to delete
                if (req.staff.staffs.find(s => s._id.toString() === submition.staff.toString())) {
                    // delete and update submitions
                    const newItems = submition.items.filter(i => i.toString() !== itemId);
                    submition.items = newItems;
                    return submition.save()
                        .then(result => {
                            return SubmitionItem.findByIdAndRemove(itemId);
                        })
                }
            }
        })
        .then(result => {
            res.redirect(historyUrl);
        });
});

module.exports = router;