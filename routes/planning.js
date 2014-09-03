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
            data.push({id: rows[i].id, productionDate: moment(rows[i].productionDate).format("YYYY-MM-DD"),
                productionBatch: rows[i].productionBatch, updateDate:  moment(rows[i].updateDate).format("YYYY-MM-DD hh:mm:ss"),
                remark: rows[i].remark
            })
        }

        res.render('planning/index', { title: '计划查询', data: data });
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


    var sql = "INSERT INTO planning(productionDate, productionBatch, updateDate, remark) VALUES(?,?,?,?)";
    var params = [ planningDate, batch, now, remark ];

    pool.query(sql, params, function(err, result) {

        var id = result.insertId;

        sql = "SELECT * FROM dining";

        pool.query(sql, function(err, rows) {

            var sqlT = '';

            for (var i = 0; i < rows.length; i++) {

                var count = req.body["planningCount" + rows[i].id];
                if (count == '')
                    count = 0;

                var sql2 = "INSERT INTO planningDetails(planningId, targetId, quantity) VALUES(?, ?, ?)";
                var params2 = [ id, rows[i].id, count ];

                pool.query(sql2, params2, function(err, result) {

                });
            }

            res.redirect('/planning');

        });

    });

});


module.exports = router;