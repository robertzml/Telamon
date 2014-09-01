var express = require('express');
var router = express.Router();

router.get('/create', function(req, res) {
    res.render('planning/create', { title: '计划录入' });
});



module.exports = router;