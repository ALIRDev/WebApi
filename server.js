const express        = require("express");
const ip             = require("ip");
const app            = express();
const generic         = require("./api/alirdb/generic");
const players         = require("./api/alirdb/players");
const lists         = require("./api/alirdb/list");
const users         = require("./api/alirdb/users");
const vehicle         = require("./api/alirdb/vehicle");
const wanted         = require("./api/alirdb/wanted");
const gangs         = require("./api/alirdb/gangs");
const steam          = require("./api/steam/steam");
const donations      = require("./api/donations/donations");
const auth           = require("http-auth");
const morgan         = require("morgan");
const cors           = require("cors");
//const https          = require("https");
const fs             = require("fs");
const Feed           = require("rss-to-json");
const CronJob        = require("cron").CronJob;

/* ---------------------------------- */

const port           = 8190;
const HOST           = ip.address();

/* ---------------------------------- */

//const key = fs.readFileSync('/home/andreacw/webapi/key/server.key');
//const cert = fs.readFileSync( '/home/andreacw/webapi/key/server.crt' );
//const ca = fs.readFileSync( '/home/andreacw/webapi/key/ca.crt' );

/*const options = {
    key: key,
    cert: cert,
    ca: ca
};*/

app.listen(port, HOST);

console.log("   ----  ALIR WebApi  ----   ");

console.log(`In esecuzione su http://${HOST}:${port}`);

// TODO: HTTPS Request

const basic = auth.basic({
        realm: "ALIRWebApi",
        file: "./htpasswd/user.htpasswd"
    }
);

//https.createServer(options, app).listen(8191);

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

const job = new CronJob('*/15 * * * *', function() {

        const key = "01f5ac2969949545e480ece0ac98ba12";
        const rss_discussion = "https://www.alir.eu/rss/1-rss-discussioni.xml/";
        const rss_news = "https://www.alir.eu/rss/3-annunci.xml/";
        const discussioniJson       = "/home/andreacw/webapi/discussioni.json";
        const annunciJson           = "/home/andreacw/webapi/annunci.json";

        Feed.load( rss_discussion + "/?member_id=3634&key=" + key, function (err, rss) {
            let json = JSON.stringify(rss);
            if (err){
                console.log(err);
            } else {
                fs.writeFile(discussioniJson, json, 'utf8',function(err) {});
            }
        });

        Feed.load( rss_news + "/?member_id=3634&key=" + key, function (err, rss) {
            let json = JSON.stringify(rss);
            if (err){
                console.log(err);
            } else {
                fs.writeFile(annunciJson, json, 'utf8',function(err) {});
            }
        });

        console.info("Updated RSS Feed completed!")

    }, function () {
        console.error("Error: CRON disabled.")
    },
    true,
    "America/Los_Angeles"
);

job.start();

// Richieste ALIRDB
generic(app);
players(app);
gangs(app);
vehicle(app);
wanted(app);
lists(app);
users(app);
// Richieste donazioni
donations(app);
// Richieste di Steam e di Arma3Servers
steam(app);
