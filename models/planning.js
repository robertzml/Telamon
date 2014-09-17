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

exports.checkPlanning = function(planningDate, batch, callback) {
    var sql = "select count(*) as c from planning where productionDate = ? and productionBatch = ?";
    var param = [ planningDate, batch ];

    pool.query(sql, param, function(err, rows) {
       if (err) throw err;

        callback(rows[0].c);
    });
}

// add a planning
exports.add = function(planningDate, batch, now, remark, callback) {
    var sql = "INSERT INTO planning(productionDate, productionBatch, quantity, updateDate, remark) VALUES(?,?, 0, ?,?)";
    var params = [ planningDate, batch, now, remark ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        callback(result);
    });
};

// update planning total quantity
exports.updateQuantity = function(id, quantity, callback) {
    var sql = "UPDATE planning SET quantity = ? WHERE id = ?";
    var params = [ quantity, id ];

    pool.query(sql, params, function(err, result){
        if (err) throw err;

        callback();
    });
};

// add planning details
exports.addDetails = function(planningId, targetId, quantity, callback) {
    var sql = "INSERT INTO planningDetails(planningId, targetId, quantity) VALUES(?, ?, ?)";
    var params = [ planningId, targetId, quantity ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        callback();
    });
};

// update planning details
exports.updateDetails = function(planningId, targetId, quantity, callback) {
    var sql = "UPDATE planningDetails SET quantity = ? WHERE planningId = ? AND targetId = ?";
    var params = [ quantity, planningId, targetId ];

    pool.query(sql, params, function(err, result) {
        if (err) throw err;

        callback();
    });

};