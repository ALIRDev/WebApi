// Init
const express = require('express');
const request = require('request');
const router = express.Router();
// Variabili
const steamK = "7FC5C2ACE4CA1A33929ABAD8F5843B59";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ALIR - WebApi' , explanation: 'Il sistema funziona correttamente'});
});

/**
 *   GET System status
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/status --> [{"ok":"Sistema online"}]
 */

router.get('/status', (req, res, next) => {
    res.send({"ok": "Sistema online"});
    console.log("info", 'Status request');
});

/* --- RICHIESTE STEAM --- */

/**
 *   GET games achievements (Ottengo l'elenco dei trofei per un determinato gioco)
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/steam/game/292030/achievements --> [{games: "...."}]
 */

router.get('/steam/game/:appid/achievements', function(req, res, next) {
    let url = 'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key='+ steamK +'&appid=' + req.params.appid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET user steam data
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/steam/users/76561197960435530/data --> [{"...."}]
 */

router.get('/steam/users/:steamid/data', function(req, res, next) {
    let url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ steamK +'&steamids=' + req.params.steamid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET user steam data
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/steam/users/76561197960435530/data --> [{"...."}]
 */

router.get('/steam/users/:steamid/ban', function(req, res, next) {
    let url = 'http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ steamK +'&steamids=' + req.params.steamid;
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

/**
 *   GET Arma 3 info
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/steam/arma/news --> [{"...."}]
 */

router.get('/steam/arma/news', function(req, res, next) {
    let url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=107410&count=10&maxlength=300&format=json';
    request.get(url, function(error, steamHttpResponse, steamHttpBody) {
        res.setHeader('Content-Type', 'application/json');
        res.send(steamHttpBody);
    });
});

module.exports = router;
