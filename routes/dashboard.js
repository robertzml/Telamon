var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');

router.get('/', function(req, res) {
    var sql = "SELECT * FROM parameter";

    pool.query(sql, function(err, result) {
        if (err) throw err;

        var morningStart, morningEnd, noonStart, noonEnd;
        var batch;
        var now = moment();

        for (var i = 0; i < result.length; i++ ) {
            switch(result[i].name) {
                case 'morning-start':
                    morningStart = moment(result[i].value, 'HH:mm:ss');
                    break;
                case 'morning-end':
                    morningEnd = moment(result[i].value, 'HH:mm:ss');
                    break;
                case 'noon-start':
                    noonStart = moment(result[i].value, 'HH:mm:ss');
                    break;
                case 'noon-end':
                    noonEnd = moment(result[i].value, 'HH:mm:ss');
                    break;
            }
        }

        if (now.isAfter(morningStart) && now.isBefore(morningEnd))
            batch = 1;
        else if (now.isAfter(noonStart) && now.isBefore(noonEnd))
            batch = 2;
        else
            batch = -1;

        res.render('dashboard', { title: '实时界面', batch: batch });
    });

});


// get the dashboard cost data by 30 days, return json
router.get('/lastCost', function(req, res) {

    var startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
    var endDate = moment().subtract(1, "days").format("YYYY-MM-DD");

    var sql = "SELECT productionDate, sum(totalCount) as sumCount, sum(totalWeight) as sumWeight, ROUND(AVG(averageCost), 2) as avgCost FROM " +
        "inventory WHERE productionDate BETWEEN ? AND ? group by productionDate ORDER BY productionDate";
    var params = [ startDate, endDate ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        for(var i = 0; i < result.length; i++) {
            result[i].productionDate = moment(result[i].productionDate).format('YYYY-MM-DD');
        }
        res.json(result);
    });
});


router.get('/getStartEnergy', function(req, res) {
    var date = req.query.date;
    var batch = req.query.batch;
    var type = req.query.type;

    var sql = "call get_start_energy(?,?,?, @a);";
    var params = [ date, batch, type ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        res.json(result[0][0].r_value);
    });
});

// not called
router.get('/getProduction', function(req, res) {
    var date = req.query.date;
    var batch = req.query.batch;

    var sql = "SELECT COUNT(*) as count, SUM(weight) as weight FROM realWeight WHERE productionDate = ? AND batch = ?";
    var params = [ date, batch ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        res.json(result[0]);
    });
});

router.get('/getRiceAmount', function(req, res) {
    var date = req.query.date;
    var batch = req.query.batch;

    var sql = "call get_rice_amount(?, ?, @a)";
    var params = [ date, batch ];

    pool.query(sql, params, function(err, result) {
        if (err) throw  err;

        res.json(result[0][0].p_weight);
    });
});

module.exports = router;