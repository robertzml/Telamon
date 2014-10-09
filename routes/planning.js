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

        planning.getDetails(id, function(rows) {

            res.render('planning/details', { title: '计划信息', id: id, data: result[0], details: rows });

        });
    });

});

router.get('/edit/:id', function(req, res) {

    var id = req.params.id;

    planning.getDetails(id, function(result) {
        res.render('planning/edit', { title: '计划编辑', id: id, data: result });
    });

});


router.post('/edit/:id', function(req, res) {

    var id = req.params.id;

    var sql = "SELECT * FROM dining WHERE status = 0";
    pool.query(sql, function(err, rows) {

        var total = 0.0;
        for(var i = 0; i < rows.length; i++) {
            var count = req.body["planningCount" + rows[i].id];
            if (count == null || count == '')
                count = 0;

            total = total + parseFloat(count);

            planning.updateDetails(id, rows[i].id, count, function(){
            });
        }

        planning.updateQuantity(id, total, function() {
            res.redirect('/planning/details/' + id);
        });
    });

});


router.get('/create', function(req, res) {

    var sql = "SELECT * FROM dining WHERE status = 0";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        res.render('planning/create', { title: '计划录入', dinings: rows, errorMsg: '' });
    });
});


router.post('/create', function(req, res) {

    var planningDate = req.body.planningDate;
    var batch = req.body.batch;
    var remark = req.body.remark;
    var now = new Date();

    planning.checkPlanning(planningDate, batch, function(exist) {

        if (exist == 1) {
            var sql = "SELECT * FROM dining WHERE status = 0";

            pool.query(sql, function(err, rows) {
                if (err) throw err;

                res.render('planning/create', { title: '计划录入', dinings: rows, errorMsg: '当前日期批次已录入' });
            });

        } else {
            planning.add(planningDate, batch, now, remark, function(result) {
                var id = result.insertId;

                var sql = "SELECT * FROM dining WHERE status = 0";

                pool.query(sql, function(err, rows) {

                    var total = 0.0;
                    for (var i = 0; i < rows.length; i++) {

                        var count = req.body["planningCount" + rows[i].id];
                        if (count == '')
                            count = 0;

                        total = total + parseFloat(count);

                        planning.addDetails(id, rows[i].id, count, function() {
                        });
                    }

                    planning.updateQuantity(id, total, function() {
                        res.redirect('/planning');
                    });

                });
            });
        }
    });

});


/*
* functions return json
*/
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

// call in dashboard
router.get('/getCurrentDetails', function(req, res) {
    var date = req.query.date;
    var batch = req.query.batch;

    var sql = "SELECT * FROM planning WHERE productionDate = ? AND productionBatch = ?";
    var param = [ date, batch ];

    pool.query(sql, param, function(err, result) {
        if (err) throw err;

        if (result.length == 0)
            res.json({});
        else {
            sql = "SELECT * FROM planningDetails LEFT JOIN dining on planningDetails.targetId = dining.id WHERE planningId = ?";
            param = [ result[0].id ];

            pool.query(sql, param, function(err, rows) {
                if (err) throw err;

                res.json(rows);
            });
        }
    });
});

module.exports = router;