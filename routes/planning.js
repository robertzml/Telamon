var express = require('express');
var router = express.Router();

router.get('/create', function(req, res) {
    res.render('planning/create', { title: '添加计划' });
});



module.exports = router;