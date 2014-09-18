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


router.get('/planningQuantity', function(req, res) {

    var sql = "SELECT * FROM planning ORDER BY productionDate";

    pool.query(sql, function(err, result) {

        for(var i = 0; i < result.length; i++) {
            result[i].productionDate = new Date(result[i].productionDate);
        }
        res.json(result);
    });

});

module.exports = router;