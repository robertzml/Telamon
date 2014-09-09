var express = require('express');
var router = express.Router();


var pool = require('../models/pool');


router.get('/', function(req, res) {

    var sql = "SELECT * FROM dining";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('dining/index', { title: '食堂管理', data: rows });
    });

});

router.get('/create', function(req, res) {

    res.render('dining/create', { title: '食堂添加' });

});

router.post('/create', function(req, res) {

    var name = req.body.name;
    var remark = req.body.remark;

    var sql = "INSERT INTO dining(name, remark, status) VALUES(?,?,0)";
    var params = [ name, remark ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        res.redirect('/dining');
    });

});

router.get('/edit/:id', function(req, res) {
    var sql = "SELECT * FROM dining WHERE id = ?";
    var params = [ req.params.id ];

    pool.query(sql, params, function(err, rows) {
        if (err) throw err;

        res.render('dining/edit', { title: '食堂编辑', data: rows[0] });
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