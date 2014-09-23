/**
 * Created by zml on 2014/9/17.
 * statistic file
 */

var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');

router.get('/planning', function(req, res) {

    res.render('statistic/planning', { title: '计划统计'});
});


// make one batch inventory
router.post('/make-inventory', function(req, res) {
    var date = req.body.date;
    var batch = req.body.batch;

    var sql = "call make_inventory(?,?);";
    var params = [ date, batch ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        res.render('statistic/inventory');
    });
});


/* statistic date range picker to select planning quantity */
router.get('/planningQuantity', function(req, res) {

    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    var sql = "SELECT * FROM planning WHERE productionDate BETWEEN ? AND ? ORDER BY productionDate";
    var params = [ startDate, endDate ];

    pool.query(sql, params, function(err, result) {

        for(var i = 0; i < result.length; i++) {
            result[i].productionDate = moment(result[i].productionDate).format('YYYY-MM-DD');
        }
        res.json(result);
    });

});

module.exports = router;