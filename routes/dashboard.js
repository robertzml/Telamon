var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');

router.get('/', function(req, res) {
    res.render('dashboard', { title: '实时界面' });
});


/* dashboard real energy data, get the start value */
router.get('/energy', function(req,res) {

    var date = moment();
    var startType;
    if (date.hour() < 12)
        startType = 1;
    else
        startType = 4;

    var sql = "SELECT * FROM realEnergy WHERE to_days(readTime) = to_days(now()) AND startType = ?";
    var params = [ startType ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        res.json({data: result});

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

module.exports = router;