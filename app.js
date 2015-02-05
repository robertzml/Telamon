var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var swig = require('swig');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var planning = require('./routes/planning');
var dining = require('./routes/dining');
var statistic = require('./routes/statistic');
var parameter = require('./routes/parameter');

var app = express();

// This is where all the magic happens!
app.engine('html', swig.renderFile);

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
//app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'telamon', resave: true, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/planning', planning);
app.use('/dining', dining);
app.use('/statistic', statistic);
app.use('/parameter', parameter);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.locals.momentDateTime = function(datetime) {
    return moment(datetime).format("YYYY-MM-DD HH:mm:ss");
}

app.locals.momentDate = function(date) {
    return moment(date).format("YYYY-MM-DD");
}

module.exports = app;
