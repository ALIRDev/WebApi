const fs = require("file-system");
const jsonQuery = require('json-query');
const winston = require('winston');

// Path file-system
const playersJson = "/alirdb/player.json";
const gangsJson = "/alirdb/gangs.json";
const vehiclesJson = "/alirdb/vehicles.json";
const wantedJson = "/alirdb/wanted.json";
const usersJson = "/alirdb/users.json";
const fileEncrypt = "utf8";

// TODO: HTTPS Request

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

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

    function logger(level, text, responseCode, type, from) {
        winston.log(level, text, {
            responseCode: responseCode,
            type: type,
            from: from
        });
    }

    /**
     *   GET System status
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/status --> [{"ok":"Sistema online"}]
     */

    app.get('/status', (req, res, next) => {
        res.send({"ok": "Sistema online"});
        logger("info", 'Status request', 200, "GET", getClientIp(req));
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
                logger("error", 'Players lenght request', 500, "GET", getClientIp(req))

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Players lenght request', 200, "GET", getClientIp(req))

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
                logger("error", 'Players request by playerid', 500, "GET", getClientIp(req))

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
                    logger("info", 'Players request by playerid', 200, "GET", getClientIp(req))

                } else {
                    res.send({404: "Nessun giocatore trovato"});
                    logger("info", 'Players request by playerid', 404, "GET", getClientIp(req))

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
                logger("error", 'Players request by name', 500, "GET", getClientIp(req))

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/' + name + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Players request by name', 200, "GET", getClientIp(req))

                } else {
                    res.send({404: "Nessun giocatore trovato"});
                    logger("info", 'Players request by name', 404, "GET", getClientIp(req))

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
                logger("error", 'Players list request', 500, "GET", getClientIp(req))

            } else {

                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                let sliced = result.slice(0, size);

                res.send(sliced);
                logger("info", 'Players list request', 200, "GET", getClientIp(req))

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
                logger("error", 'Vehicles lenght request', 500, "GET", getClientIp(req))
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Vehicles lenght request', 200, "GET", getClientIp(req))

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
                logger("error", 'Vehicles request by pid', 500, "GET", getClientIp(req))
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*pid~/' + pid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (err) {
                    res.send({"500": "Errore"});
                    console.log(err);
                }

                if (result.length > 0) {
                    res.send(result);
                    logger("info", 'Vehicles request by pid', 200, "GET", getClientIp(req))
                } else {
                    res.send({404: "Nessun veicolo trovato"});
                    logger("info", 'Vehicles request by pid', 404, "GET", getClientIp(req))
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
                logger("error", 'Wanted lenght request', 500, "GET", getClientIp(req))
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                logger("info", 'Wanted lenght request', 200, "GET", getClientIp(req))

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
                logger("error", 'Wanted request by wantedId', 500, "GET", getClientIp(req))
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
                    logger("info", 'Wanted request by wantedId', 200, "GET", getClientIp(req))
                } else {
                    res.send({404: "Nessun ricercato trovato"});
                    logger("info", 'Wanted request by wantedId', 404, "GET", getClientIp(req))
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
                console.log("GET Gangs/lenght request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                console.log("GET Gangs/lenght request from " + getClientIp(req) + " response")

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
                console.log("GET Gangs request from " + getClientIp(req) + " response: " + "Error")
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
                console.log("GET All Gangs request from " + getClientIp(req) + " response");

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
                console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/^' + gangName + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + result.length + " risultati");
                } else {

                    res.send({404: "not found"});

                    console.log("GET Gangs:name request from " + getClientIp(req) + " response: 404")
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
                console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + "Error")
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
                            console.log("GET Gangs/id/:playerid request from " + getClientIp(req) + " response: " + subval);
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
                console.log("GET Users/lenght request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                console.log("GET Users/lenght request from " + getClientIp(req) + " response")

            }
        });
    });

    /**
     *   GET Users by id
     *   @param: req = Url della richiesta
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
                console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*id=' + id + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + result.length + " risultati")
                } else {
                    res.send({404: "Nessun utente trovato"});
                    console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + "id not found")
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
                console.log("GET List/cop request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*coplevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                console.log("GET Lists:cop request from " + getClientIp(req))
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
                console.log("GET List/med request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                let level = "5";
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*mediclevel!=0]', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                res.send(result);
                console.log("GET Lists:med request from " + getClientIp(req))
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
                console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + "Error")
            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*steamid=' + steamid + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if (result.length > 0) {
                    res.send(result);
                    console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + result.length + " risultati")
                } else {
                    res.send({404: "Nessun utente trovato"});
                    console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + "steamid not found")
                }
            }
        });
    })

};

