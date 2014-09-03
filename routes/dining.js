var express = require('express');
var router = express.Router();

/*
var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : '192.168.56.102',
    user     : 'root',
    password : '123456',
    database:'telamon'
});*/

var pool = require('../models/pool');


var loadList = function(req, res) {
    var sql = "SELECT * FROM dining";


    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('dining/index', { title: '食堂管理', data: rows });
    });
};


router.get('/', function(req, res) {

    var sql = "SELECT * FROM dining";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('dining/index', { title: '食堂管理', data: rows });
    });

});

router.get('/edit/:id', function(req, res) {
    var sql = "SELECT * FROM dining WHERE id = ?";
    var params = [ req.params.id ];

    pool.query(sql, params,  function(err, rows) {
        if (err) throw err;


        res.render('dining/edit', { title: '食堂管理', data: rows[0] });
    });
});

router.post('/edit', function(req, res) {

    var id = req.body.id;
    var name = req.body.name;
    var remark = req.body.remark;
    var status = req.body.status;

    var sql = "UPDATE dining SET name = ?, remark = ?, status = ? WHERE id = ?";
    var params = [ name, remark, status, id ];

    pool.query(sql, params,  function(err, rows) {
        if (err) throw err;


        res.redirect('/dining');
    });

});



module.exports = router;