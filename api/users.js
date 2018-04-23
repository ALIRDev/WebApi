const winston        = require('winston');

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

    // TODO

    /**
     * GESTIONE DEGLI UTENTI
     *
     * Mi salvo i dati degli utenti ogni 30 min in locale, verifico che dispongano di uno SteamID64 (76561197960287930) valido
     * se l'id è valido e 64 lo salvo con i dati, altrimenti converto uno steam id di un'altro formato in 64. Se non è inserito cancello l'utenza.
     *
     * */

};

