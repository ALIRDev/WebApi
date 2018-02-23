const express        = require('express');
const ip             = require("ip");
const app            = express();
const routes         = require('./app/api_routes');
const auth           = require('http-auth');
const winston        = require('winston');

const port           = 8000;
const HOST           = ip.address();

app.listen(port, HOST);

console.log("   ----  ALIR WebApi  ----   ");

console.log(`In esecuzione su http://${HOST}:${port}`);

const basic = auth.basic({
        realm: "Users",
        file: "./htpasswd/user.htpasswd"
    }
);

app.use(auth.connect(basic));

basic.on('success', (result, req) => {
    winston.info("User " + result.user + " authenticated");
});

basic.on('fail', (result, req) => {
    winston.warn("User " + result.user + " authentication failed");
});

basic.on('error', (error, req) => {
    winston.error("Authentication error: " + error.code + " - " + error.message);
});

routes(app);