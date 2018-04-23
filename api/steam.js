const winston        = require('winston');
const request        = require('request');

// TODO: HTTPS Request
// TODO: Request counter

// Ottengo l'indirizzo ip chiamante
function getClientIp(req) {
    let ipAddress;
    let forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        let forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function logger(level, text, responseCode, type, from, loggedUsers) {
    winston.log(level, text + " - ", {
        responseCode: responseCode,
        type: type,
        from: from,
        authUser: loggedUsers
    });
}

module.exports = function (app) {

    /**
     *   -------------------------------------------------
     *                 RICHIESTE STEAM
     *   -------------------------------------------------
     */

    const steamK = "7FC5C2ACE4CA1A33929ABAD8F5843B59";

    /**
     *   GET games achievements (Ottengo l'elenco dei trofei per un determinato gioco)
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/steam/game/292030/achievements --> [{games: "...."}]
     */

    app.get('/steam/game/:appid/achievements', function(req, res, next) {
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

    app.get('/steam/users/:steamid/data', function(req, res, next) {
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

    app.get('/steam/users/:steamid/ban', function(req, res, next) {
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

    app.get('/steam/arma/news', function(req, res, next) {
        let url = 'http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=107410&count=10&maxlength=300&format=json';
        request.get(url, function(error, steamHttpResponse, steamHttpBody) {
            res.setHeader('Content-Type', 'application/json');
            res.send(steamHttpBody);
        });
    });

};

