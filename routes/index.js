const express = require('express');
const router = express.Router();
const request = require('request');

const steamUrl = process.env.STEAM_URL;
const steamKey = process.env.STEAM_KEY;

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

module.exports = router;
