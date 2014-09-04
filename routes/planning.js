var express = require('express');
var router = express.Router();
var moment = require('moment');

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

        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push({
                id: rows[i].id,
                productionDate: moment(rows[i].productionDate).format("YYYY-MM-DD"),
                productionBatch: rows[i].productionBatch,
                quantity: rows[i].quantity,
                updateDate:  moment(rows[i].updateDate).format("YYYY-MM-DD hh:mm:ss"),
                remark: rows[i].remark
            })
        }

        res.render('planning/index', { title: '计划查询', data: data });
    });
});

router.get('/details/:id', function(req, res) {

    var id = req.params.id;

    var sql = "SELECT * FROM planning WHERE id = ?";
    var param = [ id ];

    pool.query(sql, param, function(err, result) {

        var data = {
            id: result[0].id,
            productionDate: moment(result[0].productionDate).format("YYYY-MM-DD"),
            productionBatch: result[0].productionBatch,
            updateDate:  moment(result[0].updateDate).format("YYYY-MM-DD hh:mm:ss"),
            remark: result[0].remark
        };

        res.render('planning/details', { title: '计划信息', id: id, data: data });

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


    var sql = "INSERT INTO planning(productionDate, productionBatch, quantity, updateDate, remark) VALUES(?,?, 0, ?,?)";
    var params = [ planningDate, batch, now, remark ];

    pool.query(sql, params, function(err, result) {

        var id = result.insertId;

        sql = "SELECT * FROM dining";

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

            var sql3 = "UPDATE planning SET quantity = ? WHERE id = ?";
            var params3 = [ total, id ];
            pool.query(sql3, params3, function(err, result){
                res.redirect('/planning');
            });

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


module.exports = router;