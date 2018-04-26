const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const lessMiddleware  = require('less-middleware');
const logger          = require('morgan');
const auth            = require('http-auth');
const ip              = require("ip");
const cors            = require('cors');

const indexRouter     = require('./routes/index');
const usersRouter     = require('./routes/users');
const alirdbRouter    = require('./routes/alirdb');
const donationsRouter = require('./routes/donations');

const app = express();

// BasicAuth password file
const basic = auth.basic({
        realm: "ALIRWebApi",
        file: "./htpasswd/user.htpasswd"
    }
);

// Init cors data
const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alirdb', alirdbRouter);
app.use('/donations', donationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(req, res, next) {
    if ('/specific/path' === req.path) {
        next();
    } else {
        (auth.connect(basic))(req, res, next);
    }
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

basic.on('fail', (result, req) => {
    console.log("User " + result.user + " authentication failed");
});

basic.on('error', (error, req) => {
    console.log("Authentication error: " + error.code + " - " + error.message);
});

console.log("   ----  ALIR WebApi  ----   ");

let serverPort = process.env.PORT || "3000";

console.log("In esecuzione su http://" + ip.address() + ":" + serverPort);

module.exports = app;
