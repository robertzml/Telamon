var express = require('express');
var router = express.Router();
var moment = require('moment');

var pool = require('../models/pool');
var planning = require('../models/planning');


router.get('/', function(req, res) {

    planning.getAll(function(result) {
        res.render('planning/index', { title: '计划查询', data: result })
    });

});

router.get('/details/:id', function(req, res) {

    var id = req.params.id;

    planning.get(id, function(result) {
        res.render('planning/details', { title: '计划信息', id: id, data: result[0] });
    });

});

router.get('/edit/:id', function(req, res) {

    var id = req.params.id;

    planning.getDetails(id, function(result) {
        res.render('planning/edit', { title: '计划编辑', id: id, data: result });
    });

});

router.get('/create', function(req, res) {

    var sql = "SELECT * FROM dining";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('planning/create', { title: '计划录入', dinings: rows });
    });
});


router.post('/create', function(req, res) {

    var planningDate = req.body.planningDate;
    var batch = req.body.batch;
    var remark = req.body.remark;
    var now = new Date();

    planning.add(planningDate, batch, now, remark, function(result) {
        var id = result.insertId;

        var sql = "SELECT * FROM dining";

        pool.query(sql, function(err, rows) {

            var sqlT = '';
            var total = 0.0;
            for (var i = 0; i < rows.length; i++) {

                var count = req.body["planningCount" + rows[i].id];
                if (count == '')
                    count = 0;

                total = total + parseFloat(count);

                var sql2 = "INSERT INTO planningDetails(planningId, targetId, quantity) VALUES(?, ?, ?)";
                var params2 = [ id, rows[i].id, count ];

                pool.query(sql2, params2, function(err, result) {

                });
            }

            planning.updateQuantity(id, total, function() {
                res.redirect('/planning');
            });

            /*var sql3 = "UPDATE planning SET quantity = ? WHERE id = ?";
            var params3 = [ total, id ];
            pool.query(sql3, params3, function(err, result){
                res.redirect('/planning');
            });*/

        });
    });


});

router.get('/getQuantity', function(req, res) {
    var id = req.query.id;

    var sql = "SELECT sum(quantity) as q FROM planningDetails where planningId = ?";
    var param = [ id ];

    pool.query(sql, param, function(err, result) {
        res.json({ quantity: result[0].q });
    });
});


router.get('/getDetails', function(req, res) {
    var id = req.query.id;

    planning.getDetails(id, function(result) {
        res.json(result);
    });

});

module.exports = router;