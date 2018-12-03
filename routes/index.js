const express = require('express');
const router = express.Router();
const request = require('request');

const steamUrl = process.env.STEAM_URL;
const steamKey = process.env.STEAM_KEY;
const armaServerUrl = process.env.ARMA_SERVER_URL;
const armaServerKey = process.env.ARMA_SERVER_KEY;

/**
 *   GET index
 *   @example: http://192.168.30.77:8190/ --> [online]
 */

router.get('/', function(req, res, next) {
  res.send("online");
});

/**
 *   GET games achievements (Ottengo l'elenco dei trofei per un determinato gioco)
 *   @example: http://192.168.30.77:8190/steam/game/292030/achievements --> [{games: "...."}]
 */

router.get("/steam/game/:appid/achievements", function(req, res, next) {
    let url = steamUrl + 'ISteamUserStats/GetSchemaForGame/v2/?key='+ steamKey +'&appid=' + req.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET user steam data
 *   @example: http://192.168.30.77:8190/steam/users/76561197960435530/data --> [{"...."}]
 */

router.get("/steam/users/:steamid/data", function(req, res, next) {
    let url = steamUrl + 'ISteamUser/GetPlayerSummaries/v0002/?key='+ steamKey +'&steamids=' + req.params.steamid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET user steam data
 *   @example: http://192.168.30.77:8190/steam/users/76561197960435530/data --> [{"...."}]
 */

router.get("/steam/users/:steamid/ban", function(req, res, next) {
    let url = steamUrl + 'ISteamUser/GetPlayerBans/v1/?key='+ steamKey +'&steamids=' + req.params.steamid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET Arma 3 info
 *   @example: http://192.168.30.77:8190/steam/arma/news --> [{"...."}]
 */

router.get("/steam/arma/news", function(req, res, next) {
    let url = steamUrl + 'ISteamNews/GetNewsForApp/v0002/?appid=107410&count=10&maxlength=300&format=json';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET List by cop
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/lists/cop --> [{coplevel: "3", ....}]
 */

router.get("/lists/cop/", (req, res, next) => {

    fs.readFile(process.env.PLAYER_JSON, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            let level = "5";
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*coplevel!=0]', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            res.send(result);

        }
    });
});

/**
 *   GET List by med
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8190/lists/med --> [{mediclevel: "3", ....}]
 */

router.get("/lists/med/", (req, res, next) => {

    fs.readFile(process.env.PLAYER_JSON, process.env.FILE_ENCRYPTION, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            let level = "5";
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*mediclevel!=0]', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            res.send(result);

        }
    });
});

/**
 *   GET Arma 3 server info
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/server/data --> [{"...."}]
 */

router.get("/server/data", function(req, res, next) {
    let url = armaServerUrl + "?object=servers&element=detail&key=" + armaServerKey;
    request.get(url, function(error, httpResponse, httpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(httpBody);
    });
});

// RICHIESTE RSS

router.get("/rssFeed/discussioni", (req, res, next) => {

    fs.readFile(process.env.DISCUSSION_JSON, process.env.FILE_ENCRYPTION, function(err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            let obj = JSON.parse(data);
            res.send(obj);
        }
    });

});

router.get("/rssFeed/annunci", (req, res, next) => {

    fs.readFile(process.env.ADVICE_JSON, process.env.FILE_ENCRYPTION, function(err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            let obj = JSON.parse(data);
            res.send(obj);
        }
    });
});

module.exports = router;
