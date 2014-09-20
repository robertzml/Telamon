// parameter route

var express = require('express');
var router = express.Router();
var moment = require('moment');

var pool = require('../models/pool');


router.get('/', function(req, res) {

    var sql = "SELECT * FROM parameter";
    pool.query(sql, function(err, result) {
        if (err) throw err;

        res.render('parameter/index', { title: '参数设置', data: result })
    });

});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;

    var sql = "SELECT * FROM parameter WHERE id = ?";
    var param = [ id ];

    pool.query(sql, param, function(err, result) {
        if (err) throw err;

        res.render('parameter/edit', { title: '参数修改', data: result[0] })
    });
});


router.post('/edit', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var title = req.body.title;
    var value = req.body.value;

    var sql = "UPDATE parameter SET name = ?, title = ?, value = ? WHERE id = ?";
    var params = [ name, title, value, id ];

    pool.query(sql, params,  function(err, rows) {
        if (err) throw err;

        res.redirect('/parameter');
    });

});


// call in dashboard
router.get('/getValues', function(req, res) {
    var sql = "SELECT * FROM parameter";
    pool.query(sql, function(err, result) {
        if (err) throw err;

        res.json(result);
    });
});

module.exports = router;