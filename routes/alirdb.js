const express = require('express');
const router = express.Router();

// Path file-system
const playersJson = "/alirdb/player.json";
const gangsJson = "/alirdb/gangs.json";
const vehiclesJson = "/alirdb/vehicles.json";
const wantedJson = "/alirdb/wanted.json";
const usersJson = "/alirdb/users.json";
const generalsForumFeed = "/alirdb/forumGeneralFeed.json";
const adviceForumFeed = "/alirdb/forumAdviceFeed.json";
const fileEncrypt = "utf8";
const serverKey = "10f9dfa58c23a1ab511fc2478672ebef";
let generalFeed = "https://alir.eu/api/forums/topics?key=10f9dfa58c23a1ab511fc2478672ebef&forums=75,40,116,153&sortDir=desc&hidden=0";
let adviceFeed = "https://alir.eu/api/forums/topics?key=" + serverKey + "&forums=112&sortDir=desc&hidden=0";

/**
 *   Job cron per il salvataggio dei file su disco dei dati
 *   @param: req = Url della richiesta
 */

/*cron.schedule('1 * * * * *', function(){

    https.get(generalFeed, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });

});*/

// TODO: HTTPS Request
// TODO: Request counter

/**
 *   GET Players lenght
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/players/lenght --> [{56}]
 */

router.get('/players/lenght/', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});

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

router.get('/players/:playerid', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const playerid = req.params.playerid;

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

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

            } else {
                res.send({404: "Nessun giocatore trovato"});

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

router.get('/players/name/:name', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const name = req.params.name;

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*name~/' + name + '/i]', {data: obj, allowRegexp: true}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun giocatore trovato"});

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

router.get('/players/lists/:size', (req, res, next) => {

    const size = req.params.size;

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {

            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj, allowRegexp: true}).value;
            // Lancio il risultato

            let sliced = result.slice(0, size);

            res.send(sliced);

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

router.get('/vehicles/lenght/', (req, res, next) => {

    fs.readFile(vehiclesJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});


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

router.get('/vehicles/:pid', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const pid = req.params.pid;

    fs.readFile(vehiclesJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*pid~/' + pid + '/i]', {data: obj, allowRegexp: true}).value;
            // Lancio il risultato

            if (err) {
                res.send({"500": "Errore"});

            }

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun veicolo trovato"});

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

router.get('/wanted/lenght/', (req, res, next) => {

    fs.readFile(wantedJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});


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

router.get('/wanted/:wantedID', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const wantedID = req.params.wantedID;

    fs.readFile(wantedJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

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

            } else {
                res.send({404: "Nessun ricercato trovato"});

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

router.get('/gangs/lenght/', (req, res, next) => {

    fs.readFile(gangsJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});


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

router.get('/gangs/', (req, res, next) => {

    fs.readFile(gangsJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

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

router.get('/gangs/:name', (req, res, next) => {

    // Prendo il nome dalla richiesta
    const gangName = req.params.name;

    fs.readFile(gangsJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*name~/^' + gangName + '/i]', {data: obj, allowRegexp: true}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {

                res.send({404: "not found"});

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

router.get('/gangs/id/:playerid', (req, res, next) => {

    // Prendo il nome dalla richiesta
    const playerid = req.params.playerid;

    fs.readFile(gangsJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

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

router.get('/users/lenght/', (req, res, next) => {

    fs.readFile(usersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][]', {data: obj}).value;
            // Lancio il risultato

            let lenght = result.length;

            res.send({size: lenght});


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

router.get('/users/id/:id', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const id = req.params.id;

    fs.readFile(usersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*id=' + id + ']', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun utente trovato"});

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

router.get('/lists/cop/', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
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
 *   @param: req = Url della richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/lists/med --> [{mediclevel: "3", ....}]
 */

router.get('/lists/med/', (req, res, next) => {

    fs.readFile(playersJson, fileEncrypt, function (err, data) {
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
 *   GET Users by pid
 *   @param: req = Url della richiesta
 *   @param: res = Risposta alla richiesta
 *   @return: Array di oggetti
 *   @example: http://192.168.30.77:8000/users/76561198037236088 --> [{steamid: "76561198037236088", ....}]
 */

router.get('/users/:steamid', (req, res, next) => {

    // Prendo il pid dalla richiesta
    const steamid = req.params.steamid;

    fs.readFile(usersJson, fileEncrypt, function (err, data) {
        if (err) {
            res.send({500: 'Errore durante la richiesta'});

        } else {
            // Parse del JSON locale
            let obj = JSON.parse(data);
            // Regex di ricerca per nome
            let result = jsonQuery('rows[**][*steamid=' + steamid + ']', {data: obj, allowRegexp: false}).value;
            // Lancio il risultato

            if (result.length > 0) {
                res.send(result);

            } else {
                res.send({404: "Nessun utente trovato"});
            }
        }
    });
});

module.exports = router;
