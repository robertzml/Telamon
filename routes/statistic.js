/**
 * Created by zml on 2014/9/17.
 * statistic file
 */

var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');


router.get('/inventory', function(req, res) {

    res.render('statistic/inventory', { title: '整理数据', message: '' })
});

router.get('/planning', function(req, res) {

    res.render('statistic/planning', { title: '计划统计' });
});

router.get('/cost', function(req, res) {

    res.render('statistic/cost', { title: '成本统计' });
});




// make one batch inventory
router.post('/make_inventory', function(req, res) {
    var date = req.body.inventory_date;
    var batch1 = req.body.checkBatch1;
    var batch2 = req.body.checkBatch2;

    if (batch1 == 'checkBatch1') {
        var sql = "call make_inventory(?,?);";
        var params = [ date, 1 ];

        pool.query(sql, params, function(err, result) {
            if (err) throw err;

        });
    }

    if (batch2 == 'checkBatch2') {
        var sql = "call make_inventory(?,?);";
        var params = [ date, 2 ];

        pool.query(sql, params, function(err, result) {
            if (err) throw err;
        });
    }

    if (batch1 == 'checkBatch1' && batch2 == 'checkBatch2') {
        var sql = "call make_inventory(?,?);";
        var params = [ date, 0 ];

        pool.query(sql, params, function(err, result) {
            if (err) throw err;
        });
    }

    res.render('statistic/inventory', { title: '整理数据', message: '整理完成' })
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

// get the statistic inventory data by date range, return json
router.get('/costInventory', function(req, res) {

    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    var sql = "SELECT * FROM inventory WHERE batch = 0 AND productionDate BETWEEN ? AND ? ORDER BY productionDate";
    var params = [ startDate, endDate ];

    pool.query(sql, params, function(err, result) {

        for(var i = 0; i < result.length; i++) {
            result[i].productionDate = moment(result[i].productionDate).format('YYYY-MM-DD');
        }
        res.json(result);
    });
});



module.exports = router;