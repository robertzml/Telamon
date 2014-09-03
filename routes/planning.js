var express = require('express');
var router = express.Router();

var pool = require('../models/pool');

var loadDining = function() {
    var sql = "SELECT * FROM dining";


    pool.query(sql, function(err, rows) {
        if (err) throw err;

        return rows;
    });
};


router.get('/', function(req, res) {

    var sql = "SELECT * FROM planning";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('planning/index', { title: '计划查询', data: rows });
    });
});

router.get('/create', function(req, res) {

    var dinings = loadDining();

    res.render('planning/create', { title: '计划录入', dinings: dinings });
});



module.exports = router;