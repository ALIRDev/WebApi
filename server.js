const express        = require('express');
const ip             = require("ip");
const app            = express();
const alirdb         = require('./api/alirdb');
const users          = require('./api/users');
const steam          = require('./api/steam');
const donations      = require('./api/donations');
const auth           = require('http-auth');
const morgan         = require('morgan');
const cors           = require('cors');

    /* ---------------------------------- */

const port           = 8190;
const HOST           = ip.address();

/* ---------------------------------- */

app.listen(port, HOST);

console.log("   ----  ALIR WebApi  ----   ");

console.log(`In esecuzione su http://${HOST}:${port}`);

const basic = auth.basic({
        realm: "ALIRWebApi",
        file: "./htpasswd/user.htpasswd"
    }
);

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

app.use(morgan('dev'));

app.use(cors(corsOptions));

app.use(function(req, res, next) {
    if ('/specific/path' === req.path) {
        next();
    } else {
        (auth.connect(basic))(req, res, next);
    }
});

/*basic.on('success', (result, req) => {
    winston.info("User " + result.user + " authenticated");
});*/

basic.on('fail', (result, req) => {
    console.warn("User " + result.user + " authentication failed");
});

basic.on('error', (error, req) => {
    console.error("Authentication error: " + error.code + " - " + error.message);
});

// Richieste alirdb
alirdb(app);
// Richieste donazioni
donations(app);
// Utenze ipb
users(app);
// Richieste di Steam e di Arma3Servers
steam(app);
