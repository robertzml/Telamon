/* The mysql connection module */

var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : '192.168.56.102',
    user     : 'root',
    password : '123456',
    database:'telamon'
});

exports.query = function(sql, callback) {
    pool.query(sql, callback);
};

exports.query = function(sql, params,  callback) {
    pool.query(sql, params, callback);
};