const fs = require("file-system");
const jsonQuery = require('json-query');

const fileEncrypt = "utf8";
const playersJson = "/home/andreacw/webapi/today/player.json";

module.exports = function(app) {

    /**
     *   GET Players lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/players/lenght --> [{56}]
     */

    app.get("/players/lenght/", (req, res, next) => {

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
     *   GET Players find
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://37.59.102.107:8190/players/find/76561198037236088 --> [{playerid: "76561197960737527", ....}]
     *   @example: http://37.59.102.107:8190/players/find/Cola --> [{name: "Bob", ....}]
     */

    app.get("/players/find/:searchValue", (req, res, next) => {

        // Prendo il pid dalla richiesta
        const searchValue = req.params.searchValue;

        fs.readFile(playersJson, fileEncrypt, function (err, data) {
            if (err) {
                res.send({500: 'Errore durante la richiesta'});

            } else {
                // Parse del JSON locale
                let obj = JSON.parse(data);
                // Regex di ricerca per nome

                let result;

                if(isNaN(searchValue)){
                    console.log(searchValue);
                    result = jsonQuery('rows[**][*name~/' + searchValue + '/i]', {data: obj, allowRegexp: true}).value;
                }else{
                    console.log(searchValue);
                    result = jsonQuery('rows[**][*playerid~/^' + searchValue + '/i]', {data: obj, allowRegexp: true}).value;
                }

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
     *   @example: http://192.168.30.77:8190/players/lists/100 --> [{....}]
     */

    app.get("/players/lists/:size", (req, res, next) => {

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

};
