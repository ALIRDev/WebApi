const fs = require("file-system");
const jsonQuery = require('json-query');

const usersJson = "/home/andreacw/webapi/today/users.json";
const fileEncrypt = "utf8";

module.exports = function (app) {

    /**
     *   GET Users by pid
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/users/76561198037236088 --> [{steamid: "76561198037236088", ....}]
     */

    app.get("/users/:steamid", (req, res, next) => {

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

    /**
     *   GET Users lenght
     *   @param: req = Url della richiesta
     *   @param: res = Risposta alla richiesta
     *   @return: Array di oggetti
     *   @example: http://192.168.30.77:8190/users/lenght --> [{56}]
     */

    app.get("/users/lenght/", (req, res, next) => {

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
     *   @example: http://192.168.30.77:8190/users/id/3 --> [{id: "3", ....}]
     */

    app.get("/users/id/:id", (req, res, next) => {

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


};
