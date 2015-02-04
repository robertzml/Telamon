var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res) {

    res.render('users/login', { title: '用户登录' })
});

router.post('/login', function(req, res) {

    res.render('index/index', { title: '主页' });
});

module.exports = router;
