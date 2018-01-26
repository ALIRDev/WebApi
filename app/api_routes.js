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

    // http://localhost:8000/
    //

    app.get('/', (req, res) => {
        res.send({"ok" : "Sistema online"});
        console.log("GET request from " + getClientIp(req) + ", system online")
    });

    /**
     *   GET Players by playerid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/players/76561197960737527 --> [{playerid: "76561197960737527", ....}]
     */

    app.get('/players/:playerid', (req, res) => {

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

    app.get('/players/name/:name', (req, res) => {

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
     *   GET Vehicles by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/vehicles/76561197960737527 --> [{pid: "76561197960737527", ....}]
     */

    app.get('/vehicles/:pid', (req, res) => {

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
                let result = jsonQuery('rows[**][*pid~/^' + pid + '/i]', {data: obj, allowRegexp: true}).value;
                // Lancio il risultato

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
     *   GET Wanted by wantedID
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/wanted/76561197960737527 --> [{wantedID: "76561197960737527", ....}]
     */

    app.get('/wanted/:wantedID', (req, res) => {

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
     *   GET All Gangs
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/gangs --> [{..},{..}]
     */

        app.get('/gangs', (req, res) => {

            fs.readFile( gangsJson , fileEncrypt , function (err, data) {
            if (err) {
                res.send({'500':'Errore durante la richiesta'});
                console.log("GET Gangs request from " + getClientIp(req) + " response: " + "Error" )
            }else{
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Lancio il risultato

                if(result.length > 0){

                    res.send(obj);
                    console.log("GET All Gangs request from " + getClientIp(req) + " response" );

                }

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

    app.get('/gangs/:name', (req, res) => {

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

    app.get('/gangs/id/:playerid', (req, res) => {

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
     *   GET Users by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8000/users/76561198037236088 --> [{steamid: "76561198037236088", ....}]
     */

    app.get('/users/:steamid', (req, res) => {

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

