/* The mysql connection module */

var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : '202.195.145.229',
    user     : 'utelamon',
    password : '123123',
    database :'telamon',
    multipleStatements: true
});

exports.query = function(sql, callback) {
    pool.query(sql, callback);
};

exports.query = function(sql, params,  callback) {
    pool.query(sql, params, callback);
};