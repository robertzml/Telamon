var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('test', { title: 'Test' });
});

module.exports = router;