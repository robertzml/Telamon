var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var pool = require('../models/pool');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res) {

    res.render('users/login', { title: '用户登录' })
});

router.post('/login', function(req, res) {

    var username = req.body["username"];
    var password = req.body["password"];

    var sha1 = crypto.createHash('sha1');
    var sha1sum = sha1.update(password).digest('hex');

    var sql = "SELECT * FROM user where username = ?";
    var param = [ username ];

    pool.query(sql, param, function(err, result) {
        if (err) throw err;

        if (result.length == 0) {
            res.locals.error = '用户不存在';
            res.render('users/login', { title: '登录' });
        } else {

            if (result[0].password == sha1sum) {

                req.session.username = result[0].username;

                res.redirect('/');
            } else {
                res.locals.error = '密码错误';
                res.render('users/login', { title: '登录' });
            }
        }

    });

});

module.exports = router;
