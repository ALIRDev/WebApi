const fs             = require("file-system");
const jsonQuery      = require('json-query');
const winston        = require('winston');

// Path file-system
const playersJson           = "/alirdb/player.json";
const fileEncrypt           = "utf8";

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
     *   GET List by donor !=1
     *   @param: req = Url della richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/lists/donor/1 --> [{....}]
     */

    app.get('/lists/donor/1', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Whitelist request for donor level 1', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*donorlevel=1]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                logger("info", 'Whitelist request for donor level 1', 200, "GET", getClientIp(req), req.user)
            }
        });
    });

    /**
     *   GET List by donor !=2
     *   @param: req = Url della richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/lists/donor/2 --> [{....}]
     */

    app.get('/lists/donor/2', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Whitelist request for donor level 2', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*donorlevel>=2]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                logger("info", 'Whitelist request for donor level 2', 200, "GET", getClientIp(req), req.user)
            }
        });
    });

    /**
     *   GET Donor stats
     *   @param: req = Url della richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/donor/stats --> [{"onelev": int,"twolev": int}]
     */

    app.get('/donor/stats', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Stats request for donations', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);

                let leve1 = jsonQuery('rows[**][*donorlevel=1]', {data: obj, allowRegexp: false}).value;
                let leve2 = jsonQuery('rows[**][*donorlevel>=2]', {data: obj, allowRegexp: false}).value;

                let onelenght = leve1.length;
                let twolenght = leve2.length;

                res.send({"onelev": onelenght,"twolev": twolenght});
                logger("info", 'Stats request for donations', 200, "GET", getClientIp(req), req.user)
            }
        });
    });

};

