const fs             = require("file-system");
const jsonQuery      = require('json-query');
const winston        = require('winston');
const request        = require('request');

// Path file-system
const playersJson    = "/alirdb/player.json";
const gangsJson      = "/alirdb/gangs.json";
const vehiclesJson   = "/alirdb/vehicles.json";
const wantedJson     = "/alirdb/wanted.json";
const usersJson      = "/alirdb/users.json";
const fileEncrypt    = "utf8";

// TODO: HTTPS Request
// TODO: Request counter

module.exports = function (app) {

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

    /**
     *   -------------------------------------------------
     *                 RICHIESTE ALIRDB
     *   -------------------------------------------------
     */

    /**
     *   GET System status
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/status --> [{"ok":"Sistema online"}]
     */

    app.get('/status', (req, res, next) => {
        res.send({"ok": "Sistema online"});
        logger("info", 'Status request', 200, "GET", getClientIp(req), req.user);
    });

    /**
     *   GET Players lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/lenght --> [{56}]
     */

    app.get('/players/lenght/', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Players lenght request', 500, "GET", getClientIp(req), req.user)

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Players lenght request', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET Players by playerid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/76561197960737527 --> [{playerid: "76561197960737527", ....}]
     */

    app.get('/players/:playerid', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const playerid = req.params.playerid;

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Players request by playerid', 500, "GET", getClientIp(req), req.user)

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*playerid~/^' + playerid + '/i]', {
                    data: obj,
                    allowRegexp: true
                }).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Players request by playerid', 200, "GET", getClientIp(req), req.user)

                } else {
                    res.send({404: "Nessun giocatore trovato"});
                    logger("info", 'Players request by playerid', 404, "GET", getClientIp(req), req.user)

                }
            }
        });
    });

    /**
     *   GET Players by name
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/name/Fake --> [{name: "Fake", ....}]
     */

    app.get('/players/name/:name', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const name = req.params.name;

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Players request by name', 500, "GET", getClientIp(req), req.user)

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/' + name + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Players request by name', 200, "GET", getClientIp(req), req.user)

                } else {
                    res.send({404: "Nessun giocatore trovato"});
                    logger("info", 'Players request by name', 404, "GET", getClientIp(req), req.user)

                }
            }
        });
    });

    /**
     *   GET Players list
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/lists/100 --> [{....}]
     */

    app.get('/players/lists/:size', (req, res, next) => {

        const size = req.params.size;

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Players list request', 500, "GET", getClientIp(req), req.user)

            } else {

                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                let sliced = result.slice(0, size);

                res.send(sliced);
                logger("info", 'Players list request', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET Vehicle lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/vehicles/lenght --> [{56}]
     */

    app.get('/vehicles/lenght/', (req, res, next) => {

        fs.readFile(vehiclesJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Vehicles lenght request', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Vehicles lenght request', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET Vehicles by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/vehicles/76561197960737527 --> [{pid: "76561197960737527", ....}]
     */

    app.get('/vehicles/:pid', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const pid = req.params.pid;

        fs.readFile(vehiclesJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Vehicles request by pid', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*pid~/' + pid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (err) {
                    res.send({"500": "Errore"});
                    logger("error", 'Vehicles request by pid', 500, "GET", getClientIp(req), req.user)
                }

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Vehicles request by pid', 200, "GET", getClientIp(req), req.user)
                } else {
                    res.send({404: "Nessun veicolo trovato"});
                    logger("info", 'Vehicles request by pid', 404, "GET", getClientIp(req), req.user)
                }
            }
        });
    });

    /**
     *   GET Wanted lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/wanted/lenght --> [{56}]
     */

    app.get('/wanted/lenght/', (req, res, next) => {

        fs.readFile(wantedJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Wanted lenght request', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Wanted lenght request', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET Wanted by wantedID
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/wanted/76561197960737527 --> [{wantedID: "76561197960737527", ....}]
     */

    app.get('/wanted/:wantedID', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const wantedID = req.params.wantedID;

        fs.readFile(wantedJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Wanted request by wantedId', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*wantedID~/^' + wantedID + '/i]', {
                    data: obj,
                    allowRegexp: true
                }).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Wanted request by wantedId', 200, "GET", getClientIp(req), req.user)
                } else {
                    res.send({404: "Nessun ricercato trovato"});
                    logger("info", 'Wanted request by wantedId', 404, "GET", getClientIp(req), req.user)
                }
            }
        });
    });

    /**
     *   GET Gangs lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs/lenght --> [{56}]
     */

    app.get('/gangs/lenght/', (req, res, next) => {

        fs.readFile(gangsJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Gangs lenght request', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Gangs lenght request', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET All Gangs (LIMITER 75)
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs --> [{..},{..}]
     */

    app.get('/gangs/', (req, res, next) => {

        fs.readFile(gangsJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Gangs list request', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);

                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato
                let array = [];

                for (let index = 0; index < result.length; index++) {
                    let element = result[index];
                    if (index < 75) {
                        array.push(element);
                    }
                }

                res.send(array);
                logger("info", 'Gangs list request', 200, "GET", getClientIp(req), req.user)

            }
        });

    });

    /**
     *   GET Gangs by name
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs/Mano --> [{name: "Mano nera", ....}]
     */

    app.get('/gangs/:name', (req, res, next) => {

        // Prendo il nome dalla richiesta
        const gangName = req.params.name;

        fs.readFile(gangsJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Gangs request by name', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/^' + gangName + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Gangs request by name', 200, "GET", getClientIp(req), req.user)
                } else {

                    res.send({404: "not found"});
                    logger("info", 'Gangs request by name', 404, "GET", getClientIp(req), req.user)
                }
            }
        });

    });

    /**
     *   GET Gangs by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs/id/76561197960737527 --> [{name: "Mano nera", ....}]
     */

    app.get('/gangs/id/:playerid', (req, res, next) => {

        // Prendo il nome dalla richiesta
        const playerid = req.params.playerid;

        fs.readFile(gangsJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Gangs request by id', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                let finalName;

                for (let i = result.length - 1; i >= 0; i--) {

                    let subval = result[i].name;
                    let subres = result[i];

                    for (let y = subres.members.length - 1; y >= 0; y--) {

                        if (subres.members[y] === playerid) {
                            finalName = subres;
                            logger("info", 'Gangs request by id', 200, "GET", getClientIp(req), req.user);
                            // impedisco ulteriori risultati
                            break;
                        }
                    }

                }

                let arrayMaker = [finalName];

                res.send(arrayMaker);
            }

        });

    });

    /**
     *   GET Users lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/users/lenght --> [{56}]
     */

    app.get('/users/lenght/', (req, res, next) => {

        fs.readFile(usersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Users request lenght', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Users request lenght', 200, "GET", getClientIp(req), req.user)

            }
        });
    });

    /**
     *   GET Users by id
     *   @param: req = Url della richiestagithj
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/users/id/3 --> [{id: "3", ....}]
     */

    app.get('/users/id/:id', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const id = req.params.id;

        fs.readFile(usersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Users request by id', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*id=' + id + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Users request by id', 200, "GET", getClientIp(req), req.user)
                } else {
                    res.send({404: "Nessun utente trovato"});
                    logger("info", 'Users request by id', 404, "GET", getClientIp(req), req.user)
                }
            }
        });
    });

    /**
     *   GET List by cop
     *   @param: req = Url della richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/lists/cop --> [{coplevel: "3", ....}]
     */

    app.get('/lists/cop/', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'List request for cop', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*coplevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                logger("info", 'List request for cop', 200, "GET", getClientIp(req), req.user)
            }
        });
    });

    /**
     *   GET List by med
     *   @param: req = Url della richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/lists/med --> [{mediclevel: "3", ....}]
     */

    app.get('/lists/med/', (req, res, next) => {

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'List request for med', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*mediclevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                logger("info", 'List request for med', 200, "GET", getClientIp(req), req.user)
            }
        });
    });

    /**
     *   GET Users by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/users/76561198037236088 --> [{steamid: "76561198037236088", ....}]
     */

    app.get('/users/:steamid', (req, res, next) => {

        // Prendo il pid dalla richiesta
        const steamid = req.params.steamid;

        fs.readFile(usersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});
                logger("error", 'Users request by steamid', 500, "GET", getClientIp(req), req.user)
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*steamid=' + steamid + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Users request by steamid', 200, "GET", getClientIp(req), req.user)
                } else {
                    res.send({404: "Nessun utente trovato"});
                    logger("info", 'Users request by steamid', 404, "GET", getClientIp(req), req.user)
                }
            }
        });
    });

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

    /**
     *   -------------------------------------------------
     *                 RICHIESTE YOUTUBE
     *   -------------------------------------------------
     */

    /**
     *   GET Live status test
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/jhonny/live/embed --> [{"ok":"Sistema online"}]
     *
     *                     ---   NOT USED   ---
     */

    app.get('/jhonny/live/embed', (req, res, next) => {

        request({
            url: 'https://www.googleapis.com/youtube/v3/search',
            method: 'GET',
            data: {
                part: 'snippet',
                channelId: 'UCHfZlJ0hl47QH8DGmnIRjoA',
                key: 'AIzaSyA3C-U46hytCRtFgU_nld_Zh_yF2jd5jnE',
                eventType: 'live',
                type: 'video'
            }
        }, function (err, res, body) {
            console.log(body);
            // TODO: Per completare la richiesta è necessario essere https :(
        });

        res.send({"ok": "Sistema online"});
        logger("info", 'Status request', 200, "GET", getClientIp(req), req.user);
    });

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

    /**
     *   GET Arma 3 info
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/steam/arma/news --> [{"...."}]
     */

    const keyARm = "bcdzrsb2sy4nfdpb3w9g2fk7f5kqre04c2k";

    app.get('/server/data', function(req, res, next) {
        let url = 'https://arma3-servers.net/api/?object=servers&element=detail&key=' + keyARm;
        request.get(url, function(error, httpResponse, httpBody) {
            res.setHeader('Content-Type', 'application/json');
            res.send(httpBody);
        });
    });


};

