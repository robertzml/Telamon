var express = require('express');
var router = express.Router();


var mysql = require('mysql');
var DB_NAME = 'nodesample';

var pool  = mysql.createPool({
    host     : '192.168.56.102',
    user     : 'root',
    password : '123456'
});

var conn = mysql.createConnection({
    host: '192.168.56.102',
    user: 'root',
    password: '123456',
    database:'telamon',
    port: 3306
});


router.get('/', function(req, res) {
    var sql = "SELECT * FROM dining";

    conn.connect();
    conn.query(sql, function(err, rows, fields) {
        if (err)
            throw err;
        //console.log('The solution is: ', rows[0].solution);

       // res.render('dining/index', { title: '食堂管理', data: [ {id: rows[0].id, name: rows[0].name }, { id: rows[1].id, name: rows[1].name } ] });
        res.render('dining/index', { title: '食堂管理', data: rows });
    });
   // conn.end();

    //res.render('dining/index', { title: '食堂管理' });
});



module.exports = router;