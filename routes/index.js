var express = require('express');
var router = express.Router();
var moment = require('moment');
var pool = require('../models/pool');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: '主页' });
});


router.get('/test', function(req, res) {
   res.render('test', { title: '测试' });
});


router.get('/test-weight', function(req, res) {

    var date = moment().format("YYYY-MM-DD");

    var weight = 120;
    for (var i = 0; i < 500; i++) {
        var sql = "INSERT INTO realWeight(productionDate, batch, weight) VALUES(?, ?, ?)";
        weight = 200 + i * 0.5;
        var params = [ date, 2, weight ];

        pool.query(sql, params, function(err, result) {

        });
    }

    res.render('test', { title: '称重数据' });

});

router.get('/test-energy', function(req, res) {
    var date = moment().toDate();

    var sql = "INSERT INTO realEnergy(type, readData, accumulation, readTime, startType) VALUES(?, ?, ?, ?, ?)";
    var params = [1, 15.2, 0, date, 4];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;
        res.render('test', { title: '能耗数据' });
    });

});

module.exports = router;
