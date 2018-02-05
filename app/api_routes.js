const fs             = require("file-system");
const jsonQuery      = require('json-query');

// Path file-system
const playersJson = "/alirdb/player.json";
const gangsJson = "/alirdb/gangs.json";
const vehiclesJson = "/alirdb/vehicles.json";
const wantedJson = "/alirdb/wanted.json";
const usersJson = "/alirdb/users.json";
const fileEncrypt = "utf8";

// TODO: HTTPS Request

module.exports = function(app) {

    app.use(function(req, res, next) {
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

    /**
     *   GET System status
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/ --> [{"ok":"Sistema online"}]
     */

    app.get('/', (req, res, next) => {
        res.send({"ok" : "Sistema online"});
        console.log("GET request from " + getClientIp(req) + ", system online")
    });

    /**
     *   GET Players lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/lenght --> [{56}]
     */

    app.get('/players/lenght/', (req, res, next) => {

        fs.readFile( playersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Players/lenght request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                console.log("GET Players/lenght request from " + getClientIp(req) + " response")

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

        fs.readFile( playersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Players:playerid request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*playerid~/^' + playerid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Players:playerid request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun giocatore trovato"});
                    console.log("GET Players:playerid request from " + getClientIp(req) + " response: " + "Players not found" )
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

        fs.readFile( playersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Players/name:name request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/^' + name + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Players/name:name request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun giocatore trovato"});
                    console.log("GET Players/name:name request from " + getClientIp(req) + " response: " + "Players not found" )
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

        fs.readFile( playersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Players:pid request from " + getClientIp(req) + " response: " + "Error" )
            }else{

                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                let sliced = result.slice(0, size);

                res.send(sliced);
                console.log("GET Players/list:name request from " + getClientIp(req) + " response: " + sliced.length +  " Players with limiters" )

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

        fs.readFile( vehiclesJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Vehicles/lenght request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                console.log("GET Vehicles/lenght request from " + getClientIp(req) + " response")

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

        fs.readFile( vehiclesJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Vehicles:pid request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*pid~/' + pid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(err){
                    res.send({"500":"Errore"});
                    console.log(err);
                }

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Vehicles:pid request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun veicolo trovato"});
                    console.log("GET Vehicles:pid request from " + getClientIp(req) + " response: " + "Vehicles not found" )
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

        fs.readFile( wantedJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Wanted/lenght request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                let lenght = result.length;

                res.send({size: lenght});
                console.log("GET Wanted/lenght request from " + getClientIp(req) + " response")

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

        fs.readFile( wantedJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Wanted:wantedID request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*wantedID~/^' + wantedID + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Wanted:wantedID request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun ricercato trovato"});
                    console.log("GET Wanted:wantedID request from " + getClientIp(req) + " response: " + "wanted not found" )
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

        fs.readFile( gangsJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Gangs/lenght request from " + getClientIp(req) + " response: " + "Error" )
            }else{
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
     *   GET All Gangs
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs --> [{..},{..}]
     */

        app.get('/gangs/all', (req, res, next) => {

            fs.readFile( gangsJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Gangs request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);

                let result = jsonQuery('rows[**][]', {data: obj}).value;
                // Lancio il risultato

                res.send(result);
                console.log("GET All Gangs request from " + getClientIp(req) + " response" );

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

        fs.readFile( gangsJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*name~/^' + gangName + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + result.length + " risultati" );
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

        fs.readFile( gangsJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*members~/^' + playerid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

                if(result.length > 0){

                    res.send(result);
                    console.log("GET Gangs:name request from " + getClientIp(req) + " response: " + result.length + " risultati" );

                }

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

        fs.readFile( usersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Users/lenght request from " + getClientIp(req) + " response: " + "Error" )
            }else{
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

        fs.readFile( usersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*id=' + id + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun utente trovato"});
                    console.log("GET Users/id/:id request from " + getClientIp(req) + " response: " + "id not found" )
                }
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

        fs.readFile( usersJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome
                let result = jsonQuery('rows[**][*steamid=' + steamid + ']', {data: obj, allowRegexp: false}).value;
                // Lancio il risultato

                if(result.length > 0){
                    res.send(result);
                    console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + result.length + " risultati" )
                }else{
                    res.send({"404":"Nessun utente trovato"});
                    console.log("GET Users:steamid request from " + getClientIp(req) + " response: " + "steamid not found" )
                }
            }
        });
    })

};

