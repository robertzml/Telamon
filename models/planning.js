/* The planning module */

var pool = require('./pool');

// get one planning details
exports.get = function(id, callback) {
    var sql = "SELECT * FROM planning WHERE id = ?";
    var param = [ id ];

    pool.query(sql, param, function(err, result) {
        if (err) throw err;

        callback(result);
    });

};

// get all plannings
exports.getAll = function(callback) {
    var sql = "SELECT * FROM planning";

    pool.query(sql, function(err, rows) {
        if (err) throw err;

        callback(rows);
    });
};


// get planning with dining details
exports.getDetails = function(id, callback) {
    var sql = "SELECT * FROM planningDetails LEFT JOIN dining on planningDetails.targetId = dining.id WHERE planningId = ?";
    var param = [ id ];

    pool.query(sql, param, function(err, rows) {
        if (err) throw err;

        callback(rows);
    });
};

exports.add = function(planningDate, batch, now, remark, callback) {
    var sql = "INSERT INTO planning(productionDate, productionBatch, quantity, updateDate, remark) VALUES(?,?, 0, ?,?)";
    var params = [ planningDate, batch, now, remark ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        callback(result);
    });
};

exports.updateQuantity = function(id, quantity, callback) {
    var sql = "UPDATE planning SET quantity = ? WHERE id = ?";
    var params = [ quantity, id ];

    pool.query(sql, params, function(err, result){
        if (err) throw err;

        callback();
    });
};