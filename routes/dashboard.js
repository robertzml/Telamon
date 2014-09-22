var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');

router.get('/', function(req, res) {
    res.render('dashboard', { title: '实时界面' });
});


/* dashboard real energy data */
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

router.get('/cost', function(req, res) {

});

module.exports = router;